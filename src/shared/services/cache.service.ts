import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async set(cacheKey: string, cacheValue: any): Promise<void> {
    return await this.cacheManager.set(cacheKey, cacheValue);
  }

  public async setWithTTtl(cacheKey: string, cacheValue: any, ttl: number): Promise<void> {
    return await this.cacheManager.set(cacheKey, cacheValue, ttl);
  }

  public async get(cacheKey: string): Promise<any | null> {
    return await this.cacheManager.get(cacheKey);
  }

  public async delete(cacheKey: string): Promise<void> {
    return await this.cacheManager.del(cacheKey);
  }

  public async reset(): Promise<void> {
    return await this.cacheManager.reset();
  }
}
