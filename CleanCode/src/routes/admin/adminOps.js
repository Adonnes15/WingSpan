const {Router}= require('express')
const bodyParser=require('body-parser')
const {getAllUsers,getByID,deleteUser,updateUserInfo,newUser}=require('../admin/controllers/AdminOps')
const activityMonitor=require("./activityMonitor.js")
const router=Router()
router.use(bodyParser.json());

router
.route('/')
.get(getAllUsers)
.post(newUser)

router
.route('/:id')
.get(getByID)
.delete(deleteUser)
.put(updateUserInfo)

router.use('/activity',activityMonitor)

module.exports=router