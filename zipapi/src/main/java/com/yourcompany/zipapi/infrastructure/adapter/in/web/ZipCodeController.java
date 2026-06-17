package com.yourcompany.zipapi.infrastructure.adapter.in.web;

import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.domain.port.in.FindZipCodeUseCase;
import com.yourcompany.zipapi.infrastructure.adapter.in.web.dto.ZipCodeResponseDTO;
import com.yourcompany.zipapi.infrastructure.adapter.in.web.mapper.ZipCodeWebMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/zip")
@RequiredArgsConstructor
@Slf4j
public class ZipCodeController {

    private final FindZipCodeUseCase useCase;
    private final ZipCodeWebMapper mapper;

    @GetMapping("/{code}")
    public ResponseEntity<ZipCodeResponseDTO> findByCode(@PathVariable String code) {
        log.info("REST request to find ZIP code: {}", code);
        ZipCode zipCode = useCase.findByCode(code);
        return ResponseEntity.ok(mapper.toResponse(zipCode));
    }
}
