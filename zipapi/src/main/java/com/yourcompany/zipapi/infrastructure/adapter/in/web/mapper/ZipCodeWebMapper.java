package com.yourcompany.zipapi.infrastructure.adapter.in.web.mapper;

import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.infrastructure.adapter.in.web.dto.ZipCodeResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ZipCodeWebMapper {

    @Mapping(target = "code", expression = "java(formatCode(zipCode.code()))")
    ZipCodeResponseDTO toResponse(ZipCode zipCode);

    default String formatCode(String code) {
        if (code == null || code.length() != 8) return code;
        return code.substring(0, 5) + "-" + code.substring(5);
    }
}
