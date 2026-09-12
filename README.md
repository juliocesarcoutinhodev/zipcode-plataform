# ZIP Code Search API

API REST para consulta de CEPs brasileiros utilizando a API externa CNPJá, com cache em Redis e persistência em PostgreSQL.

## Arquitetura

```
┌──────────────┐    ┌──────────────────┐    ┌──────────────┐
│  Controller   │───▶│  FindZipCodeUseCase │───▶│  Cache (Redis)│
└──────────────┘    └──────────────────┘    └──────────────┘
                            │                        │
                            ▼                        ▼
                     ┌──────────────┐        ┌──────────────┐
                     │  DB (Postgres)│        │ API CNPJá    │
                     └──────────────┘        └──────────────┘
```

Hexagonal Architecture (Ports & Adapters):
- `domain/` — entidades, exceções e interfaces de porta (sem frameworks)
- `application/` — casos de uso (lógica de negócio)
- `infrastructure/` — adapters de entrada (web) e saída (persistência, cache, API externa)

## Stack

| Tecnologia       | Versão         |
|------------------|----------------|
| Java             | 25 (LTS)       |
| Spring Boot      | 4.0.6          |
| Spring Framework | 7              |
| PostgreSQL       | 16             |
| Redis            | 7              |
| Flyway           | —              |
| MapStruct        | 1.6.x          |
| Testcontainers   | 1.20.x         |

## Pré-requisitos

- Docker e Docker Compose
- Java 25+ (caso queira rodar sem Maven wrapper)
- Token da API CNPJá

## Getting Started

### 1. Suba a infraestrutura

```bash
docker-compose up -d
```

### 2. Configure o token

```bash
export CNPJA_TOKEN=seu_token_aqui
```

### 3. Execute a aplicação

```bash
./mvnw spring-boot:run
```

### 4. Acesse o Swagger

Abra [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Endpoints

| Método | Path                    | Descrição              |
|--------|-------------------------|------------------------|
| GET    | `/api/v1/zip/{code}`    | Consultar um CEP       |
| GET    | `/actuator/health`      | Health check           |
| GET    | `/swagger-ui.html`      | Documentação Swagger   |

### Exemplo de requisição

```bash
curl http://localhost:8080/api/v1/zip/01310100
```

### Exemplo de resposta (200)

```json
{
  "code": "01310-100",
  "street": "Avenida Paulista",
  "number": null,
  "district": "Bela Vista",
  "city": "São Paulo",
  "state": "SP",
  "municipality": 3550308,
  "updated": "2026-06-01T23:59:59.999Z"
}
```

## Fluxo de busca

1. **Validação** — o CEP deve ter 8 dígitos numéricos (com ou sem hífen)
2. **Cache (Redis)** — se encontrado, retorna imediatamente (TTL 7 dias, renovado a cada acesso)
3. **Banco (PostgreSQL)** — se encontrado, salva no cache e retorna
4. **API externa (CNPJá)** — se encontrado, persiste no banco + cache e retorna
5. **404** — se não encontrado em nenhum lugar

## Estrutura do projeto

```
zipapi/
├── docker-compose.yml
├── .env.example
├── pom.xml
├── src/main/java/com/yourcompany/zipapi/
│   ├── ZipApiApplication.java
│   ├── domain/
│   │   ├── model/
│   │   ├── exception/
│   │   └── port/
│   ├── application/
│   │   └── usecase/
│   └── infrastructure/
│       ├── adapter/
│       │   ├── in/web/
│       │   └── out/ (persistence, cache, external)
│       └── config/
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
└── src/test/java/
```

## Testes

```bash
./mvnw test
```

- Testes unitários com Mockito (FindZipCodeUseCaseImpl)
- Testes de integração com Testcontainers (PostgreSQL + Redis)

## Variáveis de ambiente

| Variável        | Default       | Descrição            |
|-----------------|---------------|----------------------|
| `CNPJA_TOKEN`   | —             | Token da API CNPJá   |
| `DB_USER`       | `zipuser`     | Usuário PostgreSQL   |
| `DB_PASS`       | `zippass`     | Senha PostgreSQL     |
| `REDIS_HOST`    | `localhost`   | Host Redis           |
| `REDIS_PORT`    | `6379`        | Porta Redis          |
