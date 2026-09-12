package com.yourcompany.zipapi.infrastructure.adapter.out.external;

import com.yourcompany.zipapi.domain.exception.CnpjaIntegrationException;
import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.domain.port.out.ZipCodeExternalPort;
import com.yourcompany.zipapi.infrastructure.adapter.out.external.dto.CnpjaZipResponseDTO;
import com.yourcompany.zipapi.infrastructure.adapter.out.external.mapper.CnpjaZipMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
public class CnpjaZipAdapter implements ZipCodeExternalPort {

    private final RestClient restClient;
    private final CnpjaZipMapper mapper;

    @Override
    public Optional<ZipCode> findByCode(String code) {
        log.info("Fetching ZIP code {} from CNPJa API", code);
        try {
            var response = restClient.get()
                    .uri("/zip/{code}", code)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, (req, res) -> {
                        if (res.getStatusCode().value() == 404) {
                            throw new CnpjaIntegrationException("ZIP code not found in external API: " + code);
                        }
                        throw new CnpjaIntegrationException("Client error from CNPJa API: " + res.getStatusCode());
                    })
                    .body(CnpjaZipResponseDTO.class);

            if (response == null) {
                return Optional.empty();
            }
            return Optional.ofNullable(mapper.toDomain(response));
        } catch (CnpjaIntegrationException e) {
            if (e.getMessage().contains("not found")) {
                return Optional.empty();
            }
            log.error("CNPJa API integration error for code {}: {}", code, e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error calling CNPJa API for code {}: {}", code, e.getMessage(), e);
            throw new CnpjaIntegrationException("Failed to call CNPJa API for code: " + code, e);
        }
    }
}
