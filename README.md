# SMARTBRAIN Backend

This is the backend for the smart brain app.

## Setup

1. Make sure you have installed postgres.
2. Using the `psql` command open up the postgress command line.
3. Create a database: `CREATE DATABASE smart_brain;`.
4. Connect to the database: `\connect smart_brain;`.
5. Create table users:

```sql
CREATE TABLE users(
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    entries BIGINT DEFAULT 0,
    joined TIMESTAMP NOT NULL
);
```

6. Create table login:

```sql
CREATE TABLE login(
    id serial PRIMARY KEY,
    hash varchar(100) NOT NULL,
    email text UNIQUE NOT NULL
);
```

7. Create a file at the root directory of SMART_BRAIN backend and name it: **dbconfig.js**.
8. Edit the **dbconfig** file to look like below:

```javascript
const config = {
  host: "your_host_eg: 127.0.0.1",
  user: "your_postgres_user",
  password: "your_postgres_password",
  database: "smart_brain"
};
export default config;
```

9. Run `npm install` to install packages.
10. Run `npm start`.
11. Setup the frontend.

### Enjoy!!!
