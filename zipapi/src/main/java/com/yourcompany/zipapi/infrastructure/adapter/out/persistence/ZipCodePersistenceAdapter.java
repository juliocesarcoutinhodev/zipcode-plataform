package com.yourcompany.zipapi.infrastructure.adapter.out.persistence;

import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.domain.port.out.ZipCodeRepositoryPort;
import com.yourcompany.zipapi.infrastructure.adapter.out.persistence.mapper.ZipCodePersistenceMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
public class ZipCodePersistenceAdapter implements ZipCodeRepositoryPort {

    private final ZipCodeJpaRepository jpaRepository;
    private final ZipCodePersistenceMapper mapper;

    @Override
    public Optional<ZipCode> findByCode(String code) {
        log.info("Looking up ZIP code {} in database", code);
        return jpaRepository.findByCode(code)
                .map(mapper::toDomain);
    }

    @Override
    public ZipCode save(ZipCode zipCode) {
        log.info("Persisting ZIP code {} to database", zipCode.code());
        var entity = mapper.toEntity(zipCode);
        var saved = jpaRepository.save(entity);
        return mapper.toDomain(saved);
    }
}
