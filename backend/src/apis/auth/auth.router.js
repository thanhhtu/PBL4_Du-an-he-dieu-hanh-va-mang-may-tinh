import express from 'express';
import authController from './auth.controller';
import validateMiddleware from '../../middleware/validate.middleware';

const route = express.Router();

route.post('/register', validateMiddleware.checkRegister, authController.register);
route.post('/login', validateMiddleware.checkLogin, authController.login);

// route.post('/login', validateMiddleware.checkLogin, authController.loginError); //' OR '1'='1' -- '

export default route;