const {Router}= require('express')
const bodyParser=require('body-parser')
const {getUserActivity,}=require('../../controllers/AdminOps')
const router=Router()
router.use(bodyParser.json());

router.get('/',getUserActivity)


module.exports=router