import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppController } from './app.controller';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // await app.listen(process.env.PORT ?? 3000);
  await app.get(AppController).post({
    title: 'test',
    description: '',
    text: '',
    tags: [],
    links: [],
  });
  await app.close();
}

bootstrap();
