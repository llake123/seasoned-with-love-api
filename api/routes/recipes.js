const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const {getAllRecipes, getRecipeById, postRecipe, putRecipe, deleteRecipeById} = require('../controllers/recipesController')

/* GET */
router.get('/', getAllRecipes);

router.get('/:recipeId', getRecipeById)

/* POST */
router.post('/', checkAuth, postRecipe);


/* PUT */
router.put('/:recipeId', checkAuth, putRecipe)

/* DELETE */
router.delete('/:recipeId', checkAuth, deleteRecipeById)


module.exports = router;