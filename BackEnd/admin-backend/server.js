const express=require('express')
const {sql,poolPromise}=require('./db.js');
const cors=require('cors');
const bodyParser=require('body-parser');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenAuth=require('./tokenAuth.js')

const app=express();
app.use(cors());
app.use(bodyParser.json());

const PORT= process.env.PORT || 5000;

app.listen(1433,()=>console.log("server is running"));

app.get("/api/users",async(req,res)=>{
    try{
        const pool= await poolPromise;
        const result=await pool
        .request()
        .query("SELECT e.*,m.EmployeeName AS manager_name from [User] e LEFT JOIN [User] m ON e.reportingMgr=m.id");
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

//get by id
app.get("/api/users/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        if(isNaN(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid ID"
            });
        };
        const pool= await poolPromise;
        const result=await pool
        .request()
        .input("id",sql.Int,id)
        .query("SELECT e.*,m.EmployeeName AS manager_name from [User] e LEFT JOIN [User] m ON e.reportingMgr=m.id WHERE e.id=@id");
        
        if (result.recordset.length==0){
            return res.status(404).json({
                success:false,
                message:"employee details not found"
            })
        }
        
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

//new entry

app.post("/api/users",async(req,res)=>{
    try{
        let user=req.body;
        if(!user.EmployeeName||!user.username||!user.password||!user['stack/skillset']){
            return res.status(400).json({
                success:false,
                message:"all fields must be populated"
            });  
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password, salt);
        user.password=hash;
        const pool= await poolPromise;
        const result=await pool
        .request()
        .input("EmployeeName",sql.VarChar,user.EmployeeName)
        .input("username",sql.VarChar,user.username)
        .input("password",sql.VarChar,user.password)
        .input("skill",sql.VarChar,user['stack/skillset'])
        .input("manager",sql.VarChar,user.manager_name)
        .query("INSERT INTO [User](EmployeeName,username,password,[stack/skillset],reportingMgr) VALUES(@EmployeeName,@username,@password,@skill,(SELECT id FROM [User] WHERE EmployeeName = @manager))");
        res.status(200).send(result.rowsAffected);
        // res.send();
    }
    catch(error){
        res.status(404).json({
            success:false,
            error:error.message
        })
    }
})

//login
app.post("/api/login",async(req,res)=>{
    try{
        let creds=req.body;
        const pool =await poolPromise;
        const result=await pool
        .request()
        .input("EmployeeName",sql.VarChar,creds.EmployeeName)
        .query("SELECT password FROM [User] WHERE EmployeeName=@EmployeeName");

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

// update 
app.put("/api/users/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        let {EmployeeName,username,password,_,reportingMgr}=req.body;

        if(!EmployeeName||!username||!password||!req.body['stack/skillset']){
            return res.status(400).json({
                success:false,
                message:"all fields must be populated"
            });  
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        password=hash;
        const pool = await poolPromise;
        const result= await pool
        .request()
        .input("id",sql.VarChar,id)
        .input("EmployeeName",sql.VarChar,EmployeeName)
        .input("username",sql.VarChar,username)
        .input("password",sql.VarChar,password)
        .input("skillset",sql.VarChar,req.body['stack/skillset'])
        .input("reportingMgr",sql.VarChar,req.body.manager_name)
        .query("UPDATE [User] SET EmployeeName = @EmployeeName,username = @username,password = @password,[stack/skillset] = @skillset,reportingMgr = (SELECT id FROM [User] WHERE EmployeeName = @reportingMgr) WHERE id = @id");
        res.status(200).json(result.rowsAffected);
    }
    catch(error){
        res.status(201).json({
            success:false,
            error:error.message,
            message:"server error, try again."
        });
    }
})

//delete entry
app.delete("/api/users/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        if(isNaN(id)){
            return res.status(400).json({
                success:false,
                message:"invalid id"
            });
        }
        const pool =await poolPromise;
        const result= await
        pool.request()
        .input("id",sql.Int,id)
        .query("DELETE FROM [User] where id=@id");
        res.status(200).json(result.rowsAffected);
    }
    catch(error){
        res.status(201).json({
            success:false,
            error:error.message,
        });
    }
})

app.get("/api/manager/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        const pool= await poolPromise;
        const result=await pool
        .request()
        .input("id",sql.Int,id)
        .query("SELECT * FROM [User] WHERE id=@id");
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