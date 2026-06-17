CREATE TABLE zip_codes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code             VARCHAR(8)   NOT NULL UNIQUE,
    street           VARCHAR(255),
    number           VARCHAR(20),
    district         VARCHAR(100),
    city             VARCHAR(100) NOT NULL,
    state            VARCHAR(2)      NOT NULL,
    municipality     INTEGER,
    source_updated_at TIMESTAMP WITH TIME ZONE,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_zip_codes_code ON zip_codes(code);
