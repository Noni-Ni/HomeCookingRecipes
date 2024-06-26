const { Router } = require("express");
const { isGuest } = require("../middlewares/guards");

const { register, login } = require('../services/user');
const { createToken } = require('../services/jwt');
const { body, validationResult } = require('express-validator');
const { parseErrors } = require("../util");



const userRouter = Router();

userRouter.get('/register', isGuest(), (req, res) => {


    res.render('register');
});
userRouter.post(
    '/register',
    isGuest(),
    body('username').trim().isLength({ min: 2, max: 20 }).withMessage('Name should be between 2 and 20 characters long'),
    body('email').trim().isEmail().isLength({ min: 10 }).withMessage('Please enter a valid email'),
    body('password').trim().isLength({ min: 4 }).withMessage('Password must be at least 4 characters long'),
    body('repass').trim().custom((value, { req }) => value == req.body.password).withMessage('Passwords don\'t match'),
    async (req, res) => {
        const { username, email, password } = req.body;

        try {
            const result = validationResult(req);

            if (result.errors.length) {
                throw result.errors;
            }

            const user = await register(username, email, password);
            const token = createToken(user);

            res.cookie('token', token, { httpOnly: true });
            res.redirect('/');
        } catch (err) {
            res.render('register', { data: { username, email }, errors: parseErrors(err).errors });
            return;
        }
    }
);

userRouter.get('/login', isGuest(), (req, res) => {
    res.render('login');
});

userRouter.post('/login', isGuest(),
    body('email').trim(),
    body('password').trim(),
    async (req, res) => {
        const { email, password } = req.body;

        try {
            if (!email || !password) {
                throw new Error('All fields are required');
            }

            const user = await login(email, password);
            const token = createToken(user);

            res.cookie('token', token, { httpOnly: true });
            res.redirect('/');
        } catch (err) {
            res.render('login', { data: { email }, errors: parseErrors(err).errors });
            return;
        }
    });

userRouter.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = { userRouter };