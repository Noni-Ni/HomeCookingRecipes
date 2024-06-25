const { Router } = require("express");
const { create, getById, update, deleteById, recommend } = require("../services/recipe");
const { isUser } = require("../middlewares/guards");
const { body, validationResult } = require('express-validator');
const { parseErrors } = require("../util");

const recipeRouter = Router();

recipeRouter.get('/create', isUser(), async (req, res) => {
    //console.log(req.user);


    res.render('create');
});

recipeRouter.post('/create', isUser(),
    body('title').trim().isLength({ min: 2 }).withMessage('Title should be at least 2 characters'),
    body('description').trim().isLength({ min: 10, max: 100 }).withMessage('Description should be between 10 and 100 characters long'),
    body('ingredients').trim().isLength({ min: 10, max: 200 }).withMessage('Ingredients should be between 10 and 200 characters long'),
    body('instructions').trim().isLength({ min: 10 }).withMessage('Instructions should be at least 10 characters long'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }),
    async (req, res) => {


        try {
            const result = validationResult(req);

            if (result.errors.length) {
                throw result.errors;
            }

            const recipe = await create(req.body, req.user._id);


            res.redirect('/catalog');
        } catch (err) {
            res.render('create', { data: req.body, errors: parseErrors(err).errors });
            return;
        }


    });

recipeRouter.get('/edit/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const data = await getById(id);
    if (!data) {
        res.status(404).render('404');
        return;
    }

    if (data.owner.toString() != req.user._id) {
        res.redirect('/login');
    }
    res.render('edit', { data: data });
});

recipeRouter.post('/edit/:id', isUser(),
    body('title').trim().isLength({ min: 2 }).withMessage('Title should be at least 2 characters'),
    body('description').trim().isLength({ min: 10, max: 100 }).withMessage('Description should be between 10 and 100 characters long'),
    body('ingredients').trim().isLength({ min: 10, max: 200 }).withMessage('Ingredients should be between 10 and 200 characters long'),
    body('instructions').trim().isLength({ min: 10 }).withMessage('Instructions should be at least 10 characters long'),
    body('image').trim().isURL({ require_tld: false, require_protocol: true }),
    async (req, res) => {
        const userId = req.user._id;
        const id = req.params.id;
        try {
            const validation = validationResult(req);

            if (validation.errors.length) {
                throw validation.errors;
            }

            const result = await update(id, req.body, userId);

            res.redirect('/catalog/' + id);

        } catch (err) {
            res.render('edit', { data: req.body, errors: parseErrors(err).errors });
        }

    });
recipeRouter.get('/delete/:id', isUser(), async (req, res) => {
    const id = req.params.id;
    const userId = req.user._id;

    try {


        await deleteById(id, userId);


        res.redirect('/catalog');
    } catch (err) {

        res.redirect('/catalog/' + id);
        return;
    }
});

recipeRouter.get('/recommend/:id', isUser(), async (req, res) => {
    const recipeId = req.params.id;
    const userId = req.user._id;

    try {


        await recommend(recipeId, userId);
        res.redirect('/catalog/' + recipeId);

        
    } catch (err) {

        res.redirect('/');
        return;
    }


})


module.exports = { recipeRouter }