package com.yourcompany.zipapi.domain.exception;

public class CnpjaIntegrationException extends RuntimeException {
    public CnpjaIntegrationException(String message, Throwable cause) {
        super(message, cause);
    }

    public CnpjaIntegrationException(String message) {
        super(message);
    }
}
