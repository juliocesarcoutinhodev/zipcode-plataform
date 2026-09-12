package com.yourcompany.zipapi.infrastructure.adapter.out.cache;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZipCodeCacheEntry {
    private String code;
    private String street;
    private String number;
    private String district;
    private String city;
    private String state;
    private Integer municipality;
    private String updated;
}
