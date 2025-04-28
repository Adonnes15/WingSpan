const joi=require('joi');


exports.registerSchema = joi.object(
    
    {
        EmployeeName: joi.string().required().min(5),
        username: joi.string().required().min(3),
        reportingMgr: joi.number(),
        role: joi.string().required(),
        password:joi.string().required().min(8)
    }
)

exports.loginSchema=joi.object({

    email:joi.string().email().exist().required(),
    password:joi.string().required().min(8)

})