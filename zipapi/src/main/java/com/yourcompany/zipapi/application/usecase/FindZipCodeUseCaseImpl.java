package com.yourcompany.zipapi.application.usecase;

import com.yourcompany.zipapi.domain.exception.ZipCodeInvalidException;
import com.yourcompany.zipapi.domain.exception.ZipCodeNotFoundException;
import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.domain.port.in.FindZipCodeUseCase;
import com.yourcompany.zipapi.domain.port.out.ZipCodeCachePort;
import com.yourcompany.zipapi.domain.port.out.ZipCodeExternalPort;
import com.yourcompany.zipapi.domain.port.out.ZipCodeRepositoryPort;
import lombok.RequiredArgsConstructor;

import java.util.Optional;
import java.util.regex.Pattern;

@RequiredArgsConstructor
public class FindZipCodeUseCaseImpl implements FindZipCodeUseCase {

    private static final Pattern ZIP_PATTERN = Pattern.compile("^\\d{5}-?\\d{3}$");

    private final ZipCodeCachePort cachePort;
    private final ZipCodeRepositoryPort repositoryPort;
    private final ZipCodeExternalPort externalPort;

    @Override
    public ZipCode findByCode(String rawCode) {
        if (rawCode == null || !ZIP_PATTERN.matcher(rawCode).matches()) {
            throw new ZipCodeInvalidException(rawCode);
        }

        String normalizedCode = rawCode.replace("-", "");

        Optional<ZipCode> cached = cachePort.findByCode(normalizedCode);
        if (cached.isPresent()) {
            cachePort.renewTtl(normalizedCode);
            return cached.get();
        }

        Optional<ZipCode> fromDb = repositoryPort.findByCode(normalizedCode);
        if (fromDb.isPresent()) {
            cachePort.save(normalizedCode, fromDb.get());
            return fromDb.get();
        }

        Optional<ZipCode> fromExternal = externalPort.findByCode(normalizedCode);
        if (fromExternal.isPresent()) {
            ZipCode saved = repositoryPort.save(fromExternal.get());
            cachePort.save(normalizedCode, saved);
            return saved;
        }

        throw new ZipCodeNotFoundException(normalizedCode);
    }
}
