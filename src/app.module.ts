import { Module } from '@nestjs/common';
import { AppController, PostPlatformArray } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PostPlatformArray],
})
export class AppModule {}
