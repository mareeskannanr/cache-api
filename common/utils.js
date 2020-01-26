const Cache = require('../models/Cache');
const logger = require('winston');

//default ttl value 10 minutes
const TTL_VALUE = (process.env.TTL || 10) * 60 * 1000;
const MAX_ITEM_VALUE = process.env.MAX_ITEM_VALUE || 10;
const SUCCESS = "success";
const FAILURE = "failure";
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
const CACHE_HIT = "Cache hit";
const CACHE_MISS = "Cache miss";

module.exports = {

    generateRandomData(length = 10) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += CHARACTERS.charAt(Math.floor(Math.random() * length));
        }
        return result;
    },

    async saveInfo(cacheItem = {}, isRead = false) {
        try {
            let ttl = new Date().getTime() + TTL_VALUE;
            let no_of_hit = (cacheItem.no_of_hit || 0) + 1;
            let last_hit_time = new Date().getTime();
            let {key, data} = cacheItem;

            if(isRead) {
                await Cache.updateOne({key}, {ttl, no_of_hit, last_hit_time});
                return SUCCESS;
            }
    
            let cache = await Cache.findOne({key});
            if(cache != null) {
                await Cache.updateOne({key}, {ttl, no_of_hit, last_hit_time, data});
                return SUCCESS;
            }
    
            let count = await Cache.countDocuments({});
            if(MAX_ITEM_VALUE > count) {
                let cache = await new Cache({key, data, ttl, no_of_hit, last_hit_time});
                await cache.save();
                return SUCCESS;
            }
    
            //Check for oldest data in the cache and cache with least hit rate
            //if expired data found replaced it with the new cache data else replace the least hit rate key 
            let cacheByTTL = null;
            let cacheByHit = caches[0];
            caches.forEach(item => {
                if(new Date(item.ttl).getTime() <= new Date().getTime() && 
                    (!cacheByTTL || new Date(item.ttl).getTime() <= new Date(cacheByTTL).getTime())) {
                        cacheByTTL = item;
                }
    
                if(cacheByHit.no_of_hit > item.no_of_hit) {
                    cacheByHit = item;
                }
            });
    
            let replaceKey = cacheByTTL ? cacheByTTL.key : cacheByHit.key;
            await Cache.updateOne({replaceKey}, {key, ttl, no_of_hit, last_hit_time, data});
            return SUCCESS;

        } catch(e) {
            logger.error(e);
            return FAILURE;
        }
    },

    async getValueByKey(key) {
        try {
            let result = await Cache.findOne({key});
            let data = this.generateRandomData();

            if(result === null) {
                logger.info(CACHE_MISS);
                await this.saveInfo({key, data});
            } else {
                logger.info(CACHE_HIT);
                let currentTime = new Date().getTime();
                let ttl = new Date(result.ttl).getTime();
                if(currentTime < ttl) {
                    data = result.data;
                }
                await this.saveInfo({ key, data }, (currentTime < ttl));
            }

            return data;
        } catch(e) {
            logger.error(e);
            return null;
        }
    }
};