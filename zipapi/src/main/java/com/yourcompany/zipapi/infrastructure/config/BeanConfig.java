package com.yourcompany.zipapi.infrastructure.config;

import com.yourcompany.zipapi.application.usecase.FindZipCodeUseCaseImpl;
import com.yourcompany.zipapi.domain.port.in.FindZipCodeUseCase;
import com.yourcompany.zipapi.domain.port.out.ZipCodeCachePort;
import com.yourcompany.zipapi.domain.port.out.ZipCodeExternalPort;
import com.yourcompany.zipapi.domain.port.out.ZipCodeRepositoryPort;
import com.yourcompany.zipapi.infrastructure.adapter.out.cache.ZipCodeCacheAdapter;
import com.yourcompany.zipapi.infrastructure.adapter.out.cache.mapper.ZipCodeCacheMapper;
import com.yourcompany.zipapi.infrastructure.adapter.out.external.CnpjaZipAdapter;
import com.yourcompany.zipapi.infrastructure.adapter.out.external.mapper.CnpjaZipMapper;
import com.yourcompany.zipapi.infrastructure.adapter.out.persistence.ZipCodeJpaRepository;
import com.yourcompany.zipapi.infrastructure.adapter.out.persistence.ZipCodePersistenceAdapter;
import com.yourcompany.zipapi.infrastructure.adapter.out.persistence.mapper.ZipCodePersistenceMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.client.RestClient;

@Configuration
public class BeanConfig {

    @Bean
    public ZipCodeRepositoryPort zipCodeRepositoryPort(ZipCodeJpaRepository jpaRepository,
                                                       ZipCodePersistenceMapper mapper) {
        return new ZipCodePersistenceAdapter(jpaRepository, mapper);
    }

    @Bean
    public ZipCodeCachePort zipCodeCachePort(RedisTemplate<String, Object> redisTemplate,
                                             ZipCodeCacheMapper mapper) {
        return new ZipCodeCacheAdapter(redisTemplate, mapper);
    }

    @Bean
    public ZipCodeExternalPort zipCodeExternalPort(RestClient cnpjaRestClient,
                                                   CnpjaZipMapper mapper) {
        return new CnpjaZipAdapter(cnpjaRestClient, mapper);
    }

    @Bean
    public FindZipCodeUseCase findZipCodeUseCase(ZipCodeCachePort cachePort,
                                                 ZipCodeRepositoryPort repositoryPort,
                                                 ZipCodeExternalPort externalPort) {
        return new FindZipCodeUseCaseImpl(cachePort, repositoryPort, externalPort);
    }
}
