import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const RegisterSchema = z.object({
  orgName: z.string().min(2).max(100),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type RegisterDto = z.infer<typeof RegisterSchema>;

export interface JwtPayload {
  sub: string;
  orgId: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  name: string;
  iat?: number;
  exp?: number;
}
