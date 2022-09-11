# ERD: e-commerece-app


## Storage
PostgreSQL

### Schema:

**Users**:
| Column | Type |
|--------|------|
| id | UUID |
| Username | STRING |
| Password | STRING |
| Email | STRING |
| First/Last name | STRING |
| CreatedAt | Timestamp |


**Products**:
| Column | Type |
|--------|------|
| id | UUID |
| name | STRING |
| desc | STRING |
| sku | STRING |
| price | decimal |
| createdAt | Timestamp |

**Category**:
| Column | Type |
|--------|------|
| id | UUID |
| name | STRING |
| createdAt | Timestamp |

## Server

### Auth


### API

**Auth**:

```
/signIn  [POST]
/signUp  [POST]
/signOut [POST]
```

**Products**:

```
/products/list [GET]
/products/new  [POST]
/products/:id  [GET]
/products/:id  [DELETE]
```


## Clients