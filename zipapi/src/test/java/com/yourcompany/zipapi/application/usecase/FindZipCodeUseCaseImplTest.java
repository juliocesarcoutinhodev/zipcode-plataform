package com.yourcompany.zipapi.application.usecase;

import com.yourcompany.zipapi.domain.exception.ZipCodeInvalidException;
import com.yourcompany.zipapi.domain.exception.ZipCodeNotFoundException;
import com.yourcompany.zipapi.domain.model.ZipCode;
import com.yourcompany.zipapi.domain.port.out.ZipCodeCachePort;
import com.yourcompany.zipapi.domain.port.out.ZipCodeExternalPort;
import com.yourcompany.zipapi.domain.port.out.ZipCodeRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FindZipCodeUseCaseImplTest {

    @Mock
    private ZipCodeCachePort cachePort;

    @Mock
    private ZipCodeRepositoryPort repositoryPort;

    @Mock
    private ZipCodeExternalPort externalPort;

    private FindZipCodeUseCaseImpl useCase;

    @BeforeEach
    void setUp() {
        useCase = new FindZipCodeUseCaseImpl(cachePort, repositoryPort, externalPort);
    }

    @Test
    void shouldReturnFromCacheWhenZipIsCached() {
        var zipCode = new ZipCode("03195000", "Rua do Oratório", null, "Alto da Mooca", "São Paulo", "SP", 3550308, "2026-06-01T23:59:59.999Z");

        when(cachePort.findByCode("03195000")).thenReturn(Optional.of(zipCode));

        var result = useCase.findByCode("03195000");

        assertThat(result).isEqualTo(zipCode);
        verify(cachePort).renewTtl("03195000");
        verify(repositoryPort, never()).findByCode(anyString());
        verify(externalPort, never()).findByCode(anyString());
    }

    @Test
    void shouldReturnFromDbAndPopulateCacheWhenZipIsInDbButNotInCache() {
        var zipCode = new ZipCode("01310100", "Avenida Paulista", null, "Bela Vista", "São Paulo", "SP", 3550308, "2026-06-01T23:59:59.999Z");

        when(cachePort.findByCode("01310100")).thenReturn(Optional.empty());
        when(repositoryPort.findByCode("01310100")).thenReturn(Optional.of(zipCode));

        var result = useCase.findByCode("01310100");

        assertThat(result).isEqualTo(zipCode);
        verify(cachePort).save("01310100", zipCode);
        verify(externalPort, never()).findByCode(anyString());
    }

    @Test
    void shouldCallExternalApiAndPersistAndCacheWhenZipNotFoundAnywhere() {
        var externalZip = new ZipCode("20040030", "Rua Primeiro de Março", null, "Centro", "Rio de Janeiro", "RJ", 3304557, "2026-06-01T23:59:59.999Z");
        var savedZip = new ZipCode("20040030", "Rua Primeiro de Março", null, "Centro", "Rio de Janeiro", "RJ", 3304557, "2026-06-01T23:59:59.999Z");

        when(cachePort.findByCode("20040030")).thenReturn(Optional.empty());
        when(repositoryPort.findByCode("20040030")).thenReturn(Optional.empty());
        when(externalPort.findByCode("20040030")).thenReturn(Optional.of(externalZip));
        when(repositoryPort.save(externalZip)).thenReturn(savedZip);

        var result = useCase.findByCode("20040030");

        assertThat(result).isEqualTo(savedZip);
        verify(repositoryPort).save(externalZip);
        verify(cachePort).save("20040030", savedZip);
    }

    @Test
    void shouldThrowNotFoundExceptionWhenZipNotFoundAnywhere() {
        when(cachePort.findByCode("99999999")).thenReturn(Optional.empty());
        when(repositoryPort.findByCode("99999999")).thenReturn(Optional.empty());
        when(externalPort.findByCode("99999999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> useCase.findByCode("99999999"))
                .isInstanceOf(ZipCodeNotFoundException.class);
    }

    @Test
    void shouldThrowInvalidExceptionForInvalidFormat() {
        assertThatThrownBy(() -> useCase.findByCode("abc"))
                .isInstanceOf(ZipCodeInvalidException.class);

        verify(cachePort, never()).findByCode(anyString());
        verify(repositoryPort, never()).findByCode(anyString());
        verify(externalPort, never()).findByCode(anyString());
    }

    @Test
    void shouldAcceptCodeWithHyphen() {
        var zipCode = new ZipCode("03195000", "Rua do Oratório", null, "Alto da Mooca", "São Paulo", "SP", 3550308, "2026-06-01T23:59:59.999Z");

        when(cachePort.findByCode("03195000")).thenReturn(Optional.of(zipCode));

        var result = useCase.findByCode("03195-000");

        assertThat(result).isEqualTo(zipCode);
    }

    @Test
    void shouldNotRenewTtlWhenCodeIsNull() {
        assertThatThrownBy(() -> useCase.findByCode(null))
                .isInstanceOf(ZipCodeInvalidException.class);
    }
}
