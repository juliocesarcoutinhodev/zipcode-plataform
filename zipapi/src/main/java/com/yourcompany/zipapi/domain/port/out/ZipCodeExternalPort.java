package com.yourcompany.zipapi.domain.port.out;

import com.yourcompany.zipapi.domain.model.ZipCode;

import java.util.Optional;

public interface ZipCodeExternalPort {
    Optional<ZipCode> findByCode(String code);
}
