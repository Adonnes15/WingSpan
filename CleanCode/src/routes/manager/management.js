const {Router}= require('express')
const bodyParser=require('body-parser')
const {getProjectList,getProjectStats,addProject,addTask}=require('../../controllers/manager/Management.js')

const router=Router()
router.use(bodyParser.json());

// project management_______________
router
route('/PM')
.get(getProjectList)
.post(addProject)

router
route('/PM/:project')
.get(getProjectStats)
.post(addTask)
.put(statusUpdate)

// Resource management______________
router
route('/RM')
.get(getProjectList)



module.exports=router