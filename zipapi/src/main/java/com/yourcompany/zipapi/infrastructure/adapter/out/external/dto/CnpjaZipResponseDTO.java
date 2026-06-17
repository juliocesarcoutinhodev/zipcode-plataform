package com.yourcompany.zipapi.infrastructure.adapter.out.external.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CnpjaZipResponseDTO {

    private String updated;
    private Integer municipality;
    private String code;
    private String street;

    @JsonProperty("number")
    private String number;

    private String district;
    private String city;
    private String state;
}
