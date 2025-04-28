const {Router}= require('express')
const bodyParser=require('body-parser')
const {getDashboard,getProjectList}=require('../../controllers/manager/Dashboard.js')

const router=Router()
router.use(bodyParser.json());

router
route('/')
.get(getProjectList)

router
route('/:project')
.get(getDashboard)

module.exports=router