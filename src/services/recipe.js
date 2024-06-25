//TODO replace with real data service according exam description

const { Recipe } = require('../models/Recipe');

async function getAll() {
    return Recipe.find().lean();
}

async function getRecent() {
    return await Recipe.find().sort({ $natural: -1 }).limit(3).lean();
}

async function getById(id) {
    return Recipe.findById(id).lean();
}

async function create(data, ownerId) {


    const record = new Recipe({
        title: data.title,
        ingredients: data.ingredients,
        instructions: data.instructions,
        description: data.description,
        image: data.image,
        owner: ownerId
    });

    await record.save();

    return record;
}

async function update(id, data, userId) {
    const record = await Recipe.findById(id);

    if (!record) {
        throw new ReferenceError('Record not found ' + id);
    }

    if (record.owner.toString() != userId) {
        throw new Error('Access denied');
    }

    record.title = data.title;
    record.ingredients = data.ingredients;
    record.instructions = data.instructions;
    record.description = data.description;
    record.image = data.image;
    record.owner = userId;

    

    await record.save();

    return record;
}

async function deleteById(id, userId) {
    const record = await Recipe.findById(id);

    if (!record) {
        throw new ReferenceError('Recipe not found ' + id);
    }

    if (record.owner.toString() != userId) {
        throw new Error('Access denied');
    }

    await Recipe.findByIdAndDelete(id);
}

async function recommend(recipeId, userId) {
    const record = await Recipe.findById(recipeId);

    if (!record) {
        throw new ReferenceError('Record not found ' + recipeId);
    }

    if (record.owner.toString() == userId) {
        throw new Error('Access denied');
    }

    if(record.recommendList.find(l => l.toString() == userId)){
        return;
    }

    record.recommendList.push(userId);
    await record.save();

    return record;
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    deleteById,
    getRecent,
    recommend
}