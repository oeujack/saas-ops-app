import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import Redis from 'ioredis';
import { AppConfigService } from '../config/app-config.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator implements OnModuleDestroy {
  private client: Redis;

  constructor(private readonly config: AppConfigService) {
    super();
    this.client = new Redis(this.config.redisUrl, {
      lazyConnect: true,
      enableReadyCheck: false,
    });
  }

  async check(key: string): Promise<HealthIndicatorResult> {
    try {
      await this.client.ping();
      return this.getStatus(key, true);
    } catch {
      return this.getStatus(key, false);
    }
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
