const Recipe = require('../models/recipe');
const { default: mongoose } = require('mongoose');
const {successResponse, errorResponse} = require('../helpers/responseHelpers');

const getAllRecipes = (request, response, next) => {
    Recipe.find().exec()
        .then((result) => {
            successResponse(response, request, result);
        })
        .catch((error) => {
            errorResponse(response, request);
        });
}

const getRecipeById = (request, response, next) => {
    const id = request.params.recipeId;
    Recipe.findById(id).exec()
        .then((result) => {
            successResponse(response, request, result);
        })
        .catch((error) => {
            errorResponse(response, request, error);
        });
}

const postRecipe = (request, response, next) => {
    const recipeDTO = getRecipeFromBody(request.body);
    recipeDTO._id = new mongoose.Types.ObjectId();

    const recipe = new Recipe(recipeDTO)
    
    recipe.save()
        .then((result) => {
            successResponse(response, request, result, "Successfully Added Record", 201);
        })
        .catch((error) => {
            errorResponse(response, request, error);
        });
}

const putRecipe = (request, response, next) => {
    const id = request.params.recipeId;
    const recipeDTO = getRecipeFromBody(request.body);

    if(id === recipeDTO._id){
        Recipe.findOneAndUpdate({_id: id}, recipeDTO, {upsert: true}).exec()
        .then((result) => {
            var responseBody = {
                oldRecord: result,
                newRecord: recipeDTO,
                message: 'Successfully Updated'
            }
            successResponse(response, request,  responseBody);
        })
        .catch((error) => {
            errorResponse(response, request, error);
        });
    } else {
        errorResponse(response, request, 
            {
                message: "Id in request body and Id in request url do not match",
                urlId: id,
                bodyId: recipeDTO._id
            });
    }
}

const deleteRecipeById = (request, response, next) => {
    const id = request.params.recipeId;
    Recipe.findOneAndDelete({_id: id}).exec()
        .then((result) => {
            successResponse(response, request, result);
        })
        .catch((error) => {
            response.status(500).json({
                message: error
            });
        });
}

const getRecipeFromBody = (body) => {
    return {
        _id: body._id,
        name: body.name,
        author: body.author,
        description: body.description,
        ingredients: body.ingredients,
        steps: body.steps
    }
}


module.exports = {
    getAllRecipes: getAllRecipes, 
    getRecipeById: getRecipeById, 
    postRecipe: postRecipe, 
    putRecipe: putRecipe, 
    deleteRecipeById: deleteRecipeById
}