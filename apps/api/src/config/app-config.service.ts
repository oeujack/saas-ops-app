import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    return this.config.get<number>('PORT', 3001);
  }

  get nodeEnv(): string {
    return this.config.get<string>('NODE_ENV', 'development');
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get apiPrefix(): string {
    return this.config.get<string>('API_PREFIX', 'api');
  }

  get databaseUrl(): string {
    const url = this.config.get<string>('DATABASE_URL');
    if (!url) throw new Error('DATABASE_URL is required');
    return url;
  }

  get redisUrl(): string {
    const url = this.config.get<string>('REDIS_URL');
    if (!url) throw new Error('REDIS_URL is required');
    return url;
  }

  get allowedOrigins(): string[] {
    return this.config.get<string>('ALLOWED_ORIGINS', '').split(',').filter(Boolean);
  }
}
