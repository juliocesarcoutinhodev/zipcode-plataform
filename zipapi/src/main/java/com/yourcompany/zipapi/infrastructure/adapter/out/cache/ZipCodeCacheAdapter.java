package com.yourcompany.zipapi.infrastructure.adapter.out.cache;

import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.domain.port.out.ZipCodeCachePort;
import com.yourcompany.zipapi.infrastructure.adapter.out.cache.mapper.ZipCodeCacheMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

@RequiredArgsConstructor
@Slf4j
public class ZipCodeCacheAdapter implements ZipCodeCachePort {

    private static final String KEY_PREFIX = "zip:";
    private static final long TTL_DAYS = 7;

    private final RedisTemplate<String, Object> redisTemplate;
    private final ZipCodeCacheMapper mapper;

    @Override
    public Optional<ZipCode> findByCode(String code) {
        String key = buildKey(code);
        log.debug("Looking up ZIP code {} in Redis cache", code);
        var entry = (ZipCodeCacheEntry) redisTemplate.opsForValue().get(key);
        return Optional.ofNullable(entry).map(mapper::toDomain);
    }

    @Override
    public void save(String code, ZipCode zipCode) {
        String key = buildKey(code);
        log.info("Saving ZIP code {} to Redis cache", code);
        redisTemplate.opsForValue().set(key, mapper.toEntry(zipCode), TTL_DAYS, TimeUnit.DAYS);
    }

    @Override
    public void renewTtl(String code) {
        String key = buildKey(code);
        log.debug("Renewing TTL for ZIP code {} in Redis cache", code);
        redisTemplate.expire(key, TTL_DAYS, TimeUnit.DAYS);
    }

    private static String buildKey(String code) {
        return KEY_PREFIX + code;
    }
}
