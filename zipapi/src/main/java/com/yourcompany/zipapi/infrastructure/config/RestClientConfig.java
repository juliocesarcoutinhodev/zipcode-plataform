package com.yourcompany.zipapi.infrastructure.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
@Slf4j
public class RestClientConfig {

    @Bean
    public RestClient cnpjaRestClient(@Value("${cnpja.base-url}") String baseUrl,
                                      @Value("${cnpja.api-token}") String apiToken) {
        log.info("Configuring RestClient for CNPJa API at {}", baseUrl);
        return RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", apiToken)
                .build();
    }
}
