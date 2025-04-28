const express=require('express')
const {sql,poolPromise}=require('../db.js');
const cors=require('cors');
const bodyParser=require('body-parser');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');
const tokenAuth=require('../tokenAuth.js')
const utils=require('../data/utils.js')

const {Router} = require('express')

const router=Router();

router.use(cors());
router.use(bodyParser.json());

// getAll
router.get("/",async(req,res)=>{
    try{
        const sqlQueries=await utils.loadSQLQueries('users');
        const pool= await poolPromise;
        const result=await pool
        .request()
        .query(sqlQueries.getAll);
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
router.get("/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        if(isNaN(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid ID"
            });
        };
        const sqlQueries=await utils.loadSQLQueries('users');
        const pool= await poolPromise;
        const result=await pool
        .request()
        .input("id",sql.Int,id)
        .query(sqlQueries.getByID);
        
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
router.post("/",async(req,res)=>{
    try{
        let {EmployeeName,username,roles,manager_name,password}=req.body;
        if(!EmployeeName||!username||!password||!req.body['stack/skillset']){
            return res.status(400).json({
                success:false,
                message:"all fields must be populated"
            });  
        }
        const sqlQueries=await utils.loadSQLQueries('users')
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        password=hash;
        const pool= await poolPromise;
        const result=await pool
        .request()
        .input("EmployeeName",sql.VarChar,EmployeeName)
        .input("username",sql.VarChar,username)
        .input("password",sql.VarChar,password)
        .input("skill",sql.VarChar,req.body['stack/skillset'])
        .input("manager",sql.VarChar,manager_name)
        .input("roles",sql.VarChar,roles)
        .query(sqlQueries.newUser);
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

// update 
router.put("/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        let {EmployeeName,username,password,roles,manager_name}=req.body;

        if(!EmployeeName||!username||!password||!req.body['stack/skillset']){
            return res.status(400).json({
                success:false,
                message:"all fields must be populated"
            });  
        }
        if (!(password.length == 60 && password.startsWith('$2'))) {
            const salt = bcrypt.genSaltSync(10);
            password = bcrypt.hashSync(password, salt);   
        }
        const sqlQueries=await utils.loadSQLQueries('users');
        const pool = await poolPromise;
        const result= await pool
        .request()
        .input("id",sql.VarChar,id)
        .input("EmployeeName",sql.VarChar,EmployeeName)
        .input("username",sql.VarChar,username)
        .input("password",sql.VarChar,password)
        .input("skillset",sql.VarChar,req.body['stack/skillset'])
        .input("reportingMgr",sql.VarChar,manager_name)
        .input("roles",sql.VarChar,roles)
        .query(sqlQueries.updateUser);
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
router.delete("/:id",async(req,res)=>{
    try{
        const {id}=req.params;
        if(isNaN(id)){
            return res.status(400).json({
                success:false,
                message:"invalid id"
            });
        }
        const sqlQueries=await utils.loadSQLQueries('users');
        const pool =await poolPromise;
        const result= await
        pool.request()
        .input("id",sql.Int,id)
        .query(sqlQueries.deleteUser);
        res.status(200).json(result.rowsAffected);
    }
    catch(error){
        res.status(201).json({
            success:false,
            error:error.message,
        });
    }
})

module.exports=router