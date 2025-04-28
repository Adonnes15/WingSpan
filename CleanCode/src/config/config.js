require('dotenv').config();


const sqlconfig={
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

module.exports=sqlconfig