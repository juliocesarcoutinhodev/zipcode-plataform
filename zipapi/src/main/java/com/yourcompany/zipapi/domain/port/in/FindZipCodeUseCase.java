package com.yourcompany.zipapi.domain.port.in;

import com.yourcompany.zipapi.domain.model.ZipCode;

public interface FindZipCodeUseCase {
    ZipCode findByCode(String code);
}
