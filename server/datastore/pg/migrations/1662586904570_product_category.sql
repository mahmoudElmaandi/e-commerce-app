-- Up Migration
CREATE TABLE Categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    createdAt TIMESTAMP DEFAULT Now()
);

CREATE TABLE Products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    des TEXT NOT NULL,
    image TEXT NOT NULL,
    sku VARCHAR(30) NOT NULL,
    price NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    stock INTEGER DEFAULT 0,
    categoryId UUID NOT NULL,
    createdAt TIMESTAMP DEFAULT Now(),
    
    CONSTRAINT FK_Product_Category FOREIGN KEY(categoryId)
        REFERENCES Categories(id)
        ON DELETE CASCADE
);

-- Down Migration
DROP TABLE Categories;
DROP TABLE Products;