const { Router } = require("express");
const { getAll, getById, searchFor } = require("../services/recipe");
const { isUser } = require("../middlewares/guards");

const catalogRouter = Router();

catalogRouter.get('/catalog', async (req, res) => {
    //console.log(req.user);
    const recipes = await getAll()

    res.render('catalog', { recipes });
});

catalogRouter.get('/catalog/:id', async (req, res) => {

    const recipe = await getById(req.params.id);

    if (!recipe) {
        res.render('404');
        return;
    }
    recipe.recommended = recipe.recommendList.length;
    const user = req.user;
    const isOwner = req.user?._id == recipe.owner.toString();
    const hasRecommended = Boolean(recipe.recommendList.find(l => req.user?._id == l.toString()));
    res.render('details', { recipe, user, isOwner, hasRecommended });
});



catalogRouter.get('/search', async (req, res) => {

    let { title } = req.query;

    
    let recipes = [];

    if (title ) {

        recipes = await searchFor(title);
    }else{
        recipes = await getAll();
    }

    res.render('search', { recipes });
});

module.exports = { catalogRouter }