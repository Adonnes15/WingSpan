const {Router}= require('express')
const bodyParser=require('body-parser')
const {projectResources}=require('../../controllers/manager/ManagerOps.js')
const mgmtRoutes=require("./management.js")
// const dashBoardRoutes=require("./dashboard.js")
const router=Router()
router.use(bodyParser.json());

// router.get('/resources',projectList)

// router.get('/resources/:project',projectResources)

// router.get('/calender',calender)


// router.use('/dashboard',dashBoardRoutes)
router.use('/management',mgmtRoutes)

module.exports=router