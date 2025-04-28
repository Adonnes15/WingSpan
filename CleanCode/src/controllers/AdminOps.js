const Connection=require('../helpers/database')
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken');

const db=new Connection()

exports.getAllUsers=async (req,res)=>{
    try{
        const result = await (await db.exec("getAllusersInfo")).recordset
        res.status(200).json({
            success:true,
            empData:result
        })
    }
    catch(error){
        res.status(404).json({"error":error})
    }
}

exports.getByID=async(req,res)=>{
    try{
        const {id}=req.params;
        if(isNaN(id)){
            return res.status(400).json({
                success:false,
                message:"Invalid ID"
            });
        };
        const result=await db.exec("getByID",{id});        
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
};

//delete entry
exports.deleteUser=async(req,res)=>{
    try{
        const {id}=req.params;
        if(isNaN(id)){
            return res.status(400).json({
                success:false,
                message:"invalid id"
            });
        }
        const result=await db.exec("deleteUser",{id})
        res.status(201).json(result.rowsAffected);
    }
    catch(error){
        res.status(404).json({
            success:false,
            error:error.message,
        });
    }
}

// update 
exports.updateUserInfo=async(req,res)=>{
    try{
        const {id}=req.params;
        let {EmployeeName,username,password,roles,manager_name}=req.body;
        let skillset=req.body['stack/skillset']
        if(!EmployeeName||!username||!password||!skillset){
            return res.status(400).json({
                success:false,
                message:"all fields must be populated"
            });  
        }
        if (!(password.length == 60 && password.startsWith('$2'))) {
            const salt = bcrypt.genSaltSync(10);
            password = bcrypt.hashSync(password, salt);   
        }
        const result=await db.exec("updateUserInfo",{id,EmployeeName,manager_name,password,skillset,roles,username})
        res.status(201).json(result.rowsAffected);
    }
    catch(error){
        res.status(404).json({
            success:false,
            error:error.message,
            message:"server error, try again."
        });
    }
}

//new entry
exports.newUser=async(req,res)=>{
    try{
        let {EmployeeName,username,roles,manager_name,password}=req.body;
        let skillset=req.body['stack/skillset'];
        if(!EmployeeName||!username||!password||!skillset){
            return res.status(400).json({
                success:false,
                message:"all fields must be populated"
            });  
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        password=hash;
        const result=await db.exec("newUser",{EmployeeName,username,password,roles,manager_name,skillset})
        res.status(201).send(result.rowsAffected);
   
    }
    catch(error){
        res.status(404).json({
            success:false,
            error:error.message
        })
    }
}

exports.getUserActivity=async(req,res)=>{
    res.send({"message":"we ok"})
}