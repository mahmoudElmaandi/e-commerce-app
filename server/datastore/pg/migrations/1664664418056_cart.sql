-- Up Migration
CREATE TABLE Carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    total NUMERIC(18, 2) NOT NULL DEFAULT 0,
    createdAt TIMESTAMP DEFAULT Now(),

    CONSTRAINT FK_User_Cart FOREIGN KEY(user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE
);

CREATE TABLE CartItems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER  NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT Now(),

    CONSTRAINT FK_Product_CartItem FOREIGN KEY(product_id)
        REFERENCES Products(id)
        ON DELETE CASCADE,

    CONSTRAINT FK_Cart_CartItem FOREIGN KEY(cart_id)
        REFERENCES Carts(id)
        ON DELETE CASCADE
);

-- Down Migration
DROP TABLE Carts;
DROP TABLE CartItems;