-- Up Migration
CREATE TABLE Carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    userId UUID NOT NULL,
    total NUMERIC(18, 8) NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT Now(),

    CONSTRAINT FK_User_Cart FOREIGN KEY(userId)
        REFERENCES Users(id)
        ON DELETE CASCADE
);

CREATE TABLE CartItems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cartId UUID NOT NULL,
    productId UUID NOT NULL,
    quantity INTEGER  NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT Now(),

    CONSTRAINT FK_Product_CartItem FOREIGN KEY(productId)
        REFERENCES Products(id)
        ON DELETE CASCADE,

    CONSTRAINT FK_Cart_CartItem FOREIGN KEY(cartId)
        REFERENCES Carts(id)
        ON DELETE CASCADE
);

-- Down Migration
DROP TABLE Carts;
DROP TABLE CartItems;