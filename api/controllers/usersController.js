const UserAuth = require('../models/userAuth');
const { default: mongoose } = require('mongoose');
const bcrypt = require('bcrypt');
const {successResponse, errorResponse} = require('../helpers/responseHelpers');
const jwt = require('jsonwebtoken');

const getUserIds = (request, response, next) => {
    UserAuth.find().select('_id email').exec()
        .then((result) => {
            console.log('hit');
            successResponse(response, request, result);
        })
        .catch((error) => {
            errorResponse(response, request, error);
        })
};

const authenticateLogin = (request, response, next) => {
    const email = request.body.email;
    const password = request.body.password;
    
    UserAuth.findOne({email: email}).exec()
        .then((user) => {
            if(user != null) {
                bcrypt.compare(password, user.password, (err, isAuthenticated) => {
                    if(isAuthenticated) {
                        var token = jwt.sign(
                            {
                                email: user.email,
                                _id: user._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: '1d'
                            }
                        );
                        successResponse(response, request, token, "Auth Success")
                    } else {
                        errorResponse(response, request, "Auth Failed", 401);
                    }

                })
            } else {
                errorResponse(response, request, "Auth Failed", 401)
            }
        })
        .catch((error) => {
            errorResponse(response, request, error);
        })
};

const postUserSignup = (request, response, next) => {
    const password = request.body.password;
    const email = request.body.email;
    console.log(request.body)
    UserAuth.find({email: email}).exec()
        .then((result) => {

            if(result.length == 0){ 
                bcrypt.hash(
                    password, 
                    10, 
                    (err, hash) => {
                        if(err) {
                            console.log(err);
                            response.status(500).json({message: "There was an error creating your user. Please try Again."})
                        } else {
                            const user = new UserAuth({
                                _id: new mongoose.Types.ObjectId(),
                                email: email,
                                password: hash
                            });
                            user.save()
                                .then((result) => {
                                    successResponse(response, request, result, "User Successfully Created");
                                })
                                .catch((error) => {
                                    errorResponse(response, request, error);
                                });
                        }
                    }
                );
            } else {
                errorResponse(response, request, "Cannot create user because email already exists", 409);
            }
        })
        .catch((error) => {
            errorResponse(response, request, error);
        });
};

const deleteUserById = (request, response, next) => {
    const id = request.params.userId;
    UserAuth.findOneAndDelete({_id: id}).exec()
        .then((result) => {
            successResponse(response, request, result, "User Successfully Deleted");
        })
        .catch((error) => {
            errorResponse(response, request, error);
        });
}

module.exports = {
    authenticateLogin: authenticateLogin,
    postUserSignup: postUserSignup,
    getUserIds: getUserIds,
    deleteUserById: deleteUserById
}