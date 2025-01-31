import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { panic } from './panic';
import * as platformId from './platform-id';
import {
  NewPost,
  PlatformRepository,
  PostPlatform,
  PostPlatformMap,
} from './platform.repository';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly platformRepository: PlatformRepository,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('post')
  async post(post: NewPost): Promise<void> {
    const platforms = this.platformRepository.map();
    const vk = this.extractVk(platforms);
    const vkPost = await vk.publish(post);
    post.links.push(vkPost.url);
    const requests = [...platforms.values()].map((p) => p.publish(post));
    const responses = await Promise.allSettled(requests);
    console.log(responses);
  }

  private extractVk(platforms: PostPlatformMap): PostPlatform {
    const vk = platforms.get(platformId.VK) ?? panic('No VK platform');
    platforms.delete(platformId.VK);
    return vk;
  }
}
