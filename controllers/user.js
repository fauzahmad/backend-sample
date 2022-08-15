let mongoose = require('mongoose');
let user = mongoose.model('User');
let {validationResult} = require('express-validator');
let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
let {errorResponse} = require('../helpers/error');
let {userValidationSchema} = require('../helpers/user.schema');
require('dotenv').config();
let saltRounds = 10;

module.exports.signup = async function (req, res) {

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, "Missing Fields or Empty", 400, errors.array({onlyFirstError: true}))
        }

        const {data} = req.body
        const validate = userValidationSchema(data)
        if (validate.error) {
            errorResponse(res, "Field missing", 400, validate.error.details[0])
        }


        const salt = await bcrypt.genSalt(saltRounds);
        const hash_password = await bcrypt.hash(req.body.data.password, salt);

        const signup_data = {
            username: req.body.data.username,
            email: req.body.data.email,
            password: hash_password,
        }

        user.findOne(
            {email: req.body.data.email},
            {},
            {},
            function (err, userFound) {

                if (err) {
                    console.log(err);
                    errorResponse(res, 'User record not found', 400, err);
                } else if (userFound === null || userFound === undefined) {

                    user.create(signup_data,
                        function (err, userCreated) {
                            if (err) {
                                console.log(err);
                                errorResponse(res, 'User not created', 400, err);
                            } else {
                                errorResponse(res, 'Signup successful', 201, userCreated);
                            }

                        })

                } else {
                    errorResponse(res, 'User already exists', 404, userFound);
                }


            })


    } catch (error) {
        errorResponse(res, 'Internal server error', 500, error)
    }


}

module.exports.authenticateToken = function (req, res, next) {
    try {
        if (req.body.token) {
            let verification = jwt.verify(req.body.token, '12345678');
            if (verification) {
                next()
            } else {
                errorResponse(res, 'Token not verified', 400, '')
            }

        }
    } catch (error) {
        errorResponse(res, 'Internal server error', 500, error)
    }
}

module.exports.login = async function (req, res) {

    try {

        user.findOne(
            {email: req.body.data.email},
            {},
            {},
            function (err, userFound) {
                if (err) {
                    errorResponse(res, '', 400, err)
                } else {
                    if (userFound) {
                        let token = jwt.sign(
                            userFound,
                            "12345678" || process.env.JWT_SESSION_KEY,
                            {
                                expiresIn: '1d'
                            }
                        )
                        res.send({
                            success: true,
                            token: token,
                            data: userFound
                        })

                    } else {
                        errorResponse(res, 'User not found', 404, userFound)
                    }
                }
            }
        )



    } catch (error) {
        errorResponse(res, 'Internal server error', 500, error)
    }

}
