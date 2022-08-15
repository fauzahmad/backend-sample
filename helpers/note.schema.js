let Joi = require('joi');

exports.noteValidationSchema = (obj) => {
    let schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        date: Joi.optional()
    })
    let value = schema.validate(obj)
    return value
}
