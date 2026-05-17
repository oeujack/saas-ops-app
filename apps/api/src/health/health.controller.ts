import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HealthIndicatorResult,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { DatabaseService } from '../database/database.service';
import { RedisHealthIndicator } from './redis-health.indicator';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly database: DatabaseService,
    private readonly redisIndicator: RedisHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check service health status' })
  check() {
    return this.health.check([
      async (): Promise<HealthIndicatorResult> => {
        const isHealthy = await this.database.checkHealth();
        return {
          postgres: {
            status: isHealthy ? 'up' : 'down',
          },
        };
      },
      () => this.redisIndicator.check('redis'),
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
    ]);
  }
}
