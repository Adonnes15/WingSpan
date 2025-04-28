const express=require('express')
const {sql,poolPromise}=require('./db.js');
const cors=require('cors');
const bodyParser=require('body-parser');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminRoutes=require("./routes/adminRoute")

const app=express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/users',adminRoutes);
const PORT= process.env.PORT || 5000;

app.listen(1433,()=>console.log("server is running"));


//login
app.post("/api/login",async(req,res)=>{
    try{
        let creds=req.body;
        const pool =await poolPromise;
        const result=await pool
        .request()
        .input("username",sql.VarChar,creds.username)
        .query("SELECT password FROM [User] WHERE username=@username");
        if(result.rowsAffected!=0 && await bcrypt.compare(creds.password,result.recordset[0].password)){
            jwt.sign({name:creds.EmployeeName}, "ohHappyDay#15",(err, token)=>{
                if(!err){
                    res.status(200).json({message:"login successful!",
                        token:token});
                }
                else{
                    res.json({err});
                }
            });
        }
        else{
            res.send({message:"login error"});
        }
        // res.send()

    }
    catch(error){
        res.status(404).json({
            success:false,
            error:error.message
        })
    }
})

// __________________________test APIs________________________________

app.get("/api/testing/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const sqlQueries=await utils.loadSQLQueries('users');
        const pool= await poolPromise;
        const result=await pool
        .request()
        .input("id",sql.Int,id)
        .query(sqlQueries.getByID);
        res.status(200).json({
            success:true,
            empData:result.recordset
        })
    }
    catch(error){
        res.status(404).json({
            success:false,
            error:error.message
        })
    }
});