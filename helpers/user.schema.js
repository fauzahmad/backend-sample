let Joi = require('joi');

exports.userValidationSchema = (obj) => {
    let schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).required(),
        password: Joi.string().required(),
    })
    let value = schema.validate(obj)
    return value
}
