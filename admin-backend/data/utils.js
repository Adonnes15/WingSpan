const fs=require('fs-extra');
const sql=require('mssql');
const {join}=require('path')


const loadSQLQueries=async(foldername)=>{
    const filePath=join(process.cwd(),'data',foldername)
    const files=await fs.readdir(filePath)
    const sqlFiles=files.filter(f=>f.endsWith('.sql'));
    const queries={};
    for (sqlFile of sqlFiles){
        const query= fs.readFileSync(join(filePath,sqlFile),{encoding:"utf-8"});
        queries[sqlFile.replace('.sql',"")]=query;
    }
    return queries;

}

module.exports={
    loadSQLQueries
}