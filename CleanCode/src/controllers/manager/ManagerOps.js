const Connection=require('../../helpers/database')
// const bcrypt=require('bcryptjs');
// const jwt = require('jsonwebtoken');

const db=new Connection()


exports.getAllUsers=(req,res)=>{
    res.status(200).json({"message":"all good"})
}

exports.getByID=(req,res)=>{
    res.status(200).json({"message":req.params.id})
}