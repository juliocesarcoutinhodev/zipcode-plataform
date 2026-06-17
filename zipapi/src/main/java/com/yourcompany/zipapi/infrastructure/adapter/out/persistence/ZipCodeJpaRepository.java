package com.yourcompany.zipapi.infrastructure.adapter.out.persistence;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ZipCodeJpaRepository extends JpaRepository<ZipCodeEntity, UUID> {
    Optional<ZipCodeEntity> findByCode(String code);
}
