package com.yourcompany.zipapi.infrastructure.adapter.out.external.mapper;

import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.infrastructure.adapter.out.external.dto.CnpjaZipResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CnpjaZipMapper {

    ZipCode toDomain(CnpjaZipResponseDTO dto);
}
