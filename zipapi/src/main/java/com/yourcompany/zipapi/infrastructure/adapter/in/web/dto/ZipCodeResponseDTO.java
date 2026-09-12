package com.yourcompany.zipapi.infrastructure.adapter.in.web.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ZipCodeResponseDTO {
    private String code;
    private String street;
    private String number;
    private String district;
    private String city;
    private String state;
    private Integer municipality;
    private String updated;
}
