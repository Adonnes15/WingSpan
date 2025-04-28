const express=require('express')
const cors=require('cors')
const {adminOps,managerOps}=require("./routes")
require('dotenv')
const app=express()
app.use(cors())

app.use('/admin',adminOps)
app.use('/manager',managerOps)

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log(`server running on port:${PORT}`)
})