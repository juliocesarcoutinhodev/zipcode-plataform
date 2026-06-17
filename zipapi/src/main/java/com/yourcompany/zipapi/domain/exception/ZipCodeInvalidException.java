package com.yourcompany.zipapi.domain.exception;

public class ZipCodeInvalidException extends RuntimeException {
    public ZipCodeInvalidException(String code) {
        super("Invalid ZIP code format: " + code);
    }
}
