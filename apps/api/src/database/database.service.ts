import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { AppConfigService } from '../config/app-config.service';
import * as schema from './schema';

export type Database = ReturnType<typeof drizzle<typeof schema>>;

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool!: Pool;
  db!: Database;

  constructor(private readonly config: AppConfigService) {}

  async onModuleInit() {
    this.pool = new Pool({
      connectionString: this.config.databaseUrl,
      max: 20,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
    });

    this.db = drizzle(this.pool, { schema, logger: this.config.isDevelopment });

    await this.pool.connect();
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async checkHealth(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }
}
