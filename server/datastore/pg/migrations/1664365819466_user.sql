-- Up Migration
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(128) NOT NULL,
    password VARCHAR(128) NOT NULL,
    email VARCHAR(128) NOT NULL,
    createdAt TIMESTAMP DEFAULT Now()
);

-- Down Migration
DROP TABLE Users;