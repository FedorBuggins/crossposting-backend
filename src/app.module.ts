import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import {
  PlatformRepository,
  TgPlatform,
  VkPlatform,
} from './platform-repository';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PlatformRepository, VkPlatform, TgPlatform],
})
export class AppModule {}
