package com.yourcompany.zipapi.domain.model;

public record ZipCode(
    String code,
    String street,
    String number,
    String district,
    String city,
    String state,
    Integer municipality,
    String updated
) {}
