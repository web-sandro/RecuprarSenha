const express = require('express');
const router = express.Router();

const AuthController = require('../controllers/authController');

router.get('/login', AuthController.loginForm);
router.post('/login', AuthController.login);

router.post('/logout', AuthController.logout);

router.get('/forgot-password', (req, res) => res.render('auth/forgot-password'));
router.post('/forgot-password', AuthController.forgotPassword);

router.get('/reset-password', (req, res) => res.render('auth/reset-password', { token: req.query.token }));
router.post('/reset-password', AuthController.resetPassword);

module.exports = router;