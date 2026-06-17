package com.yourcompany.zipapi.domain.port.out;

import com.yourcompany.zipapi.domain.model.ZipCode;

import java.util.Optional;

public interface ZipCodeCachePort {
    Optional<ZipCode> findByCode(String code);
    void save(String code, ZipCode zipCode);
    void renewTtl(String code);
}
