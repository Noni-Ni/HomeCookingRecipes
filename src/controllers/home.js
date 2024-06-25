const { Router } = require("express");
const { getRecent } = require("../services/recipe");

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
    //console.log(req.user);
    const recipes = await getRecent()
    
    res.render('home', { recipes });
});

module.exports = { homeRouter }