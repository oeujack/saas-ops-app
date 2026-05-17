import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config/app-config.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';

@Module({
  imports: [AppConfigModule, DatabaseModule, HealthModule, AuthModule, SubscriptionsModule],
})
export class AppModule {}
