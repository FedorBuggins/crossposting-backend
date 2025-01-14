import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  PlatformRepository,
  TgPlatform,
  VkPlatform,
} from './platform.repository';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PlatformRepository, VkPlatform, TgPlatform],
})
export class AppModule {}
