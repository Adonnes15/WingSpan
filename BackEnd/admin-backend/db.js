const sql=require('mssql');
require('dotenv').config();


const config={
    server: process.env.SERVER_NAME,
    database:process.env.DB_NAME,
    user:process.env.USER_NAME,
    password:process.env.PASSWORD,
    port:process.env.PORT,
    options:{
        encrypt:false,
        enableArithAbort:true
    }
};

const poolPromise=new sql.ConnectionPool(config)
.connect()
.then(pool=>{
    console.log("database connected");
    return pool;
})
.catch(error=>{
    console.log("error connecting",error);
    throw error;
})

module.exports={
    sql,
    poolPromise
}