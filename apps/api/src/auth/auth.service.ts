import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../database/database.service';
import { organizations, users } from '../database/schema';
import type { JwtPayload, LoginDto, RegisterDto } from './auth.schemas';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.database.db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);

    if (existing.length > 0) {
      throw new ConflictException('Email already in use');
    }

    const baseSlug = dto.orgName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    const [org] = await this.database.db
      .insert(organizations)
      .values({ name: dto.orgName, slug })
      .returning();

    if (!org) throw new Error('Failed to create organization');

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const [user] = await this.database.db
      .insert(users)
      .values({
        orgId: org.id,
        email: dto.email,
        name: dto.name,
        role: 'owner',
        passwordHash,
      })
      .returning();

    if (!user) throw new Error('Failed to create user');

    const token = this.signToken(user.id, org.id, user.email, user.role, user.name);

    return { token, user: this.omitHash(user), org };
  }

  async login(dto: LoginDto) {
    const result = await this.database.db
      .select()
      .from(users)
      .where(eq(users.email, dto.email))
      .limit(1);

    const user = result.at(0);

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.database.db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, user.id));

    const orgResult = await this.database.db
      .select()
      .from(organizations)
      .where(eq(organizations.id, user.orgId))
      .limit(1);

    const org = orgResult.at(0);
    if (!org) throw new UnauthorizedException('Organization not found');

    const token = this.signToken(user.id, user.orgId, user.email, user.role, user.name);

    return { token, user: this.omitHash(user), org };
  }

  async getMe(userId: string) {
    const result = await this.database.db.select().from(users).where(eq(users.id, userId)).limit(1);

    const user = result.at(0);
    if (!user) throw new UnauthorizedException();

    const orgResult = await this.database.db
      .select()
      .from(organizations)
      .where(eq(organizations.id, user.orgId))
      .limit(1);

    const org = orgResult.at(0);
    if (!org) throw new UnauthorizedException();

    return { user: this.omitHash(user), org };
  }

  private signToken(
    userId: string,
    orgId: string,
    email: string,
    role: string,
    name: string,
  ): string {
    const payload: JwtPayload = {
      sub: userId,
      orgId,
      email,
      role: role as JwtPayload['role'],
      name,
    };
    return this.jwt.sign(payload);
  }

  private omitHash(user: typeof users.$inferSelect) {
    const { passwordHash: _hash, ...safe } = user;
    return safe;
  }
}
