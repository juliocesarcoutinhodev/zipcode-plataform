package com.yourcompany.zipapi.infrastructure.adapter.out.persistence.mapper;

import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.infrastructure.adapter.out.persistence.ZipCodeEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;

@Mapper(componentModel = "spring")
public interface ZipCodePersistenceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(source = "updated", target = "sourceUpdatedAt")
    ZipCodeEntity toEntity(ZipCode zipCode);

    @Mapping(source = "sourceUpdatedAt", target = "updated")
    ZipCode toDomain(ZipCodeEntity entity);

    default OffsetDateTime map(String value) {
        if (value == null) return null;
        return OffsetDateTime.parse(value, DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }

    default String map(OffsetDateTime value) {
        if (value == null) return null;
        return value.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }
}
