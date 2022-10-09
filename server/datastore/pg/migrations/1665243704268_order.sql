-- Up Migration
CREATE TABLE Orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id  UUID NOT NULL,
    total NUMERIC(18,2)  NOT NULL,
    createdAt TIMESTAMP DEFAULT Now(),

    CONSTRAINT FK_User_Order FOREIGN KEY(user_id)
        REFERENCES Users(id)
        ON DELETE CASCADE
);

CREATE TABLE OrderItems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT Now(),

    CONSTRAINT FK_Product_OrderItem FOREIGN KEY(product_id)
        REFERENCES Products(id)
        ON DELETE CASCADE,

    CONSTRAINT FK_Order_OrderItem FOREIGN KEY(order_id)
        REFERENCES Orders(id)
        ON DELETE CASCADE
);

-- Down Migration
DROP TABLE Orders;
DROP TABLE OrderItems;