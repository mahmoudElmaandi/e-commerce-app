const { Pool } = require('pg');
const products = require('./products.json')
const dbConfig = require('../datastore/pg/database.json')


const pool = new Pool(dbConfig);

let categories = {
    "men's clothing": "1ca92a60-c6a1-4f04-b418-ad5224245b3c",
    "women's clothing": "2ca92a60-c6a1-4f04-b418-ad5224245b3c",
    "jewelery": "3ca92a60-c6a3-4f04-b418-ad5224245b3c",
    "electronics": "4ca92a60-c6a4-4f04-b418-ad5224245b3c"
}

const seedCategories = async () => {

    Object.entries(categories).forEach(async ([name, id]) => {
        await pool.query(`INSERT INTO Categories (id,name) VALUES($1,$2) `, [id, name])
    })
}

const seedProducts = async function name() {

    for (let index = 0; index < products.length; index++) {
        const product = products[index];
        await pool.query(`INSERT INTO Products (name,des,image,sku,price,categoryId,stock) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [product.name, product.des, product.image, product.sku, product.price, categories[product.category], product.stock]
        )
    }

};

(async () => {
    await seedCategories()
    await seedProducts()
})()