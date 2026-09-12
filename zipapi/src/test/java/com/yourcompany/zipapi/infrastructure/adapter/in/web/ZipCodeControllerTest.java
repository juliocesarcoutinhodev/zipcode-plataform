package com.yourcompany.zipapi.infrastructure.adapter.in.web;

import com.yourcompany.zipapi.domain.port.out.ZipCodeExternalPort;
import com.yourcompany.zipapi.infrastructure.adapter.out.cache.ZipCodeCacheEntry;
import com.yourcompany.zipapi.infrastructure.adapter.out.persistence.ZipCodeJpaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.RedisContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Testcontainers
class ZipCodeControllerTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @Container
    @ServiceConnection
    static RedisContainer redis = new RedisContainer(DockerImageName.parse("redis:7-alpine"));

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ZipCodeJpaRepository jpaRepository;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @MockBean
    private ZipCodeExternalPort externalPort;

    @BeforeEach
    void setUp() {
        jpaRepository.deleteAll();
        var keys = redisTemplate.keys("zip:*");
        if (keys != null) {
            redisTemplate.delete(keys);
        }
    }

    @Test
    void shouldReturn200ForValidCachedZip() throws Exception {
        var cacheEntry = ZipCodeCacheEntry.builder()
                .code("01310100")
                .street("Avenida Paulista")
                .district("Bela Vista")
                .city("São Paulo")
                .state("SP")
                .municipality(3550308)
                .updated("2026-06-01T23:59:59.999Z")
                .build();
        redisTemplate.opsForValue().set("zip:01310100", cacheEntry, 7, TimeUnit.DAYS);

        mockMvc.perform(get("/api/v1/zip/01310100")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("01310-100"))
                .andExpect(jsonPath("$.street").value("Avenida Paulista"))
                .andExpect(jsonPath("$.city").value("São Paulo"))
                .andExpect(jsonPath("$.state").value("SP"))
                .andExpect(jsonPath("$.municipality").value(3550308));
    }

    @Test
    void shouldReturn400ForInvalidFormat() throws Exception {
        mockMvc.perform(get("/api/v1/zip/abc")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("CEP inválido"))
                .andExpect(jsonPath("$.message").value("O CEP informado possui formato inválido. Informe apenas os 8 dígitos numéricos."));
    }

    @Test
    void shouldReturn404ForNonExistentZip() throws Exception {
        when(externalPort.findByCode("99999999")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/zip/99999999")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.error").value("CEP não encontrado"))
                .andExpect(jsonPath("$.message").value("O CEP informado não foi encontrado na base de dados."));
    }
}
