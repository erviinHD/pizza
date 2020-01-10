const pgPromise = require('pg-promise');

const pgp = pgPromise({});

const config = {
    host: 'localhost',
    port: '5432',
    database: 'pizza',
    user: 'postgres',
    password: 'sasql',
}

const db = pgp(config);

console.log("No sabia que poner")

db.any('select * from pizza').then(res => {
    console.log(res);
})