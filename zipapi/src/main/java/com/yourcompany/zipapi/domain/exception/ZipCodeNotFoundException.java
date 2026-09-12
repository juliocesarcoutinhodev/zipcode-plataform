package com.yourcompany.zipapi.domain.exception;

public class ZipCodeNotFoundException extends RuntimeException {
    public ZipCodeNotFoundException(String code) {
        super("ZIP code not found: " + code);
    }
}
