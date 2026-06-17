package com.yourcompany.zipapi.infrastructure.adapter.out.cache.mapper;

import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.infrastructure.adapter.out.cache.ZipCodeCacheEntry;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ZipCodeCacheMapper {

    ZipCodeCacheEntry toEntry(ZipCode zipCode);

    ZipCode toDomain(ZipCodeCacheEntry entry);
}
