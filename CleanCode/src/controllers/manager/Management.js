const Connection=require('../../helpers/database')

const db=new Connection()

exports.getProjectList=async(req,res)=>{
    try{
        const result=await (await db.query("SELECT ProjectName FROM Project")).recordset;
        res.json({"empData":result})
    }
    catch(error){
        res.status(404).json({
            "status":"fail",
            "error":error
        })
    }
}

//new project
exports.addProject=async(req,res)=>{
    try{
        let {ProjectName,manager,description,url_repo,status}=req.body;
        if(!ProjectName||!manager||!status){
            return res.status(400).json({
                success:false,
                message:"all essential fields must be populated"
            });  
        }

        const result=await db.exec("addProject",{ProjectName,manager,description,url_repo,status})
        res.status(201).send(result.rowsAffected);
   
    }
    catch(error){
        res.status(404).json({
            success:false,
            error:error.message
        })
    }
}
//new task
exports.addTask=async(req,res)=>{
    try{
        let {assignedTo,createdBy,deadline,AssignedDate,status,priority,url_repo,description}=req.body;
        if(!assignedTo||!deadline||!AssignedDate||!description){
            return res.status(400).json({
                success:false,
                message:"all essential fields must be populated"
            });  
        }

        const result=await db.exec("addTask",{assignedTo,createdBy,deadline,AssignedDate,status,priority,url_repo,description})
        res.status(201).send(result.rowsAffected);
   
    }
    catch(error){
        res.status(404).json({
            success:false,
            error:error.message
        })
    }
}