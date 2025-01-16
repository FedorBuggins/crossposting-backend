import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { VK } from 'vk-io';
import { panic } from './panic';
import * as platform from './platform-id';

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
export class VkPlatform implements PostPlatform {
  readonly #TOKEN = process.env.VK_TOKEN ?? panic('No VK_TOKEN');
  readonly #WALL_ID = '228977337';
  readonly #api = new VK({ token: this.#TOKEN }).api;

  id = platform.VK;

  async publish(post: NewPost): Promise<PublishedPost> {
    const msg = JSON.stringify(post);
    const res = await this.#api.wall.post({ message: msg });
    return {
      id: `${res.post_id}`,
      url: `https://vk.com/wall-${this.#WALL_ID}_${res.post_id}`,
      ...post,
      ...res,
    };
  }
}

export type PostPlatformMap = Map<PostPlatform['id'], PostPlatform>;

@Injectable()
export class TgPlatform implements PostPlatform {
  readonly #TOKEN = process.env.TG_TOKEN ?? panic('No TG_TOKEN');
  readonly #CHANNEL = 'justerest_crossposting_channel';
  readonly #api = new Telegraf(this.#TOKEN).telegram;

  id = 'tg';

  async publish(post: NewPost): Promise<PublishedPost> {
    const msg = JSON.stringify(post);
    const res = await this.#api.sendMessage(`@${this.#CHANNEL}`, msg);
    return {
      id: `${res.message_id}`,
      url: `https://t.me/${this.#CHANNEL}/${res.message_id}`,
      ...post,
      ...res,
    };
  }
}

@Injectable()
export class PlatformRepository {
  #map: PostPlatformMap = new Map();

  constructor(vk: VkPlatform, tg: TgPlatform) {
    this.#add(vk);
    this.#add(tg);
  }

  #add(platform: PostPlatform): void {
    this.#map.set(platform.id, platform);
  }

  map(): PostPlatformMap {
    return new Map(this.#map);
  }
}
