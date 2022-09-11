-- Up Migration
CREATE TABLE Category (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    createdAt TIMESTAMP DEFAULT Now()
);

CREATE TABLE Product (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    des TEXT NOT NULL,
    image TEXT NOT NULL,
    sku VARCHAR(30) NOT NULL,
    price NUMERIC(18, 8) NOT NULL,
    categoryId UUID NOT NULL,
    createdAt TIMESTAMP DEFAULT Now(),
    CONSTRAINT FK_Product_Category FOREIGN KEY(categoryId)
        REFERENCES Category(id)
        ON DELETE CASCADE
);

-- Down Migration
DROP TABLE Category;
DROP TABLE Product;