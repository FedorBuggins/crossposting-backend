import { Controller, Get, Injectable, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Telegraf } from 'telegraf';
import { VK } from 'vk-io';

export interface PublishedPost extends NewPost {
  id: string;
  url: string;
}

export interface NewPost {
  title: string;
  description: string;
  text: string;
  tags: string[];
  links: string[];
}

export interface PostPlatform {
  id: string;
  publish(post: NewPost): Promise<PublishedPost>;
}

@Injectable()
export class PostPlatformArray extends Array<PostPlatform> {
  constructor() {
    super();
    const TG_TOKEN = process.env.TG_TOKEN ?? panic('No TG_TOKEN');
    const VK_TOKEN = process.env.VK_TOKEN ?? panic('No VK_TOKEN');
    const tg = new Telegraf(TG_TOKEN).telegram;
    this.push({
      id: 'tg',
      async publish(post): Promise<PublishedPost> {
        const channelId = '@justerest_crossposting_channel';
        return (await tg.sendMessage(channelId, JSON.stringify(post))) as any;
      },
    });
    this.push({
      id: 'vk',
      async publish(post): Promise<PublishedPost> {
        const vk = new VK({ token: VK_TOKEN });
        const message = JSON.stringify(post);
        return (await vk.api.wall.post({ message })) as any;
      },
    });
  }
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly platforms: PostPlatformArray,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('post')
  async post(post: NewPost): Promise<void> {
    const r = await Promise.allSettled(
      this.platforms.map((p) => p.publish(post)),
    );
    console.log(r);
  }
}

function panic(err: string): never {
  throw new Error(err);
}
