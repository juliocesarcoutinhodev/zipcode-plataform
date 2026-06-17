package com.yourcompany.zipapi.infrastructure.adapter.in.web;

import com.yourcompany.zipapi.domain.exception.CnpjaIntegrationException;
import com.yourcompany.zipapi.domain.exception.ZipCodeInvalidException;
import com.yourcompany.zipapi.domain.exception.ZipCodeNotFoundException;
import com.yourcompany.zipapi.infrastructure.adapter.in.web.dto.ErrorResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.OffsetDateTime;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ZipCodeNotFoundException.class)
    public ResponseEntity<ErrorResponseDTO> handleNotFound(ZipCodeNotFoundException ex, HttpServletRequest request) {
        log.warn("ZIP code not found: {}", ex.getMessage());
        return buildResponse(HttpStatus.NOT_FOUND, "CEP não encontrado",
                "O CEP informado não foi encontrado na base de dados.", request);
    }

    @ExceptionHandler(ZipCodeInvalidException.class)
    public ResponseEntity<ErrorResponseDTO> handleInvalid(ZipCodeInvalidException ex, HttpServletRequest request) {
        log.warn("Invalid ZIP code: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, "CEP inválido",
                "O CEP informado possui formato inválido. Informe apenas os 8 dígitos numéricos.", request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponseDTO> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        log.warn("Validation error: {}", ex.getMessage());
        return buildResponse(HttpStatus.BAD_REQUEST, "Requisição inválida",
                "Requisição inválida. Verifique os dados informados.", request);
    }

    @ExceptionHandler(CnpjaIntegrationException.class)
    public ResponseEntity<ErrorResponseDTO> handleCnpjaError(CnpjaIntegrationException ex, HttpServletRequest request) {
        log.error("CNPJa integration error: {}", ex.getMessage());
        return buildResponse(HttpStatus.SERVICE_UNAVAILABLE, "Serviço indisponível",
                "Não foi possível consultar o serviço externo no momento. Tente novamente em instantes.", request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDTO> handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno",
                "Ocorreu um erro interno. Por favor, tente novamente mais tarde.", request);
    }

    private ResponseEntity<ErrorResponseDTO> buildResponse(HttpStatus status, String error, String message, HttpServletRequest request) {
        var dto = ErrorResponseDTO.builder()
                .status(status.value())
                .error(error)
                .message(message)
                .timestamp(OffsetDateTime.now())
                .path(request.getRequestURI())
                .build();
        return ResponseEntity.status(status).body(dto);
    }
}
