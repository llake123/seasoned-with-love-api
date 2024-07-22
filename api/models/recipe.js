const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true },
    author: {type: String, required: true },
    description: {type: String, required: true },
    steps: [String],
    ingredients: [String]
});

module.exports = mongoose.model('Recipe', recipeSchema);