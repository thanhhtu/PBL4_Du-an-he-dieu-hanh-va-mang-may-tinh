import express from 'express';
import authController from './auth.controller';
import validateMiddleware from '../../middleware/validate.middleware';

const route = express.Router();

route.post('/register', validateMiddleware.checkRegister, authController.register);
route.post('/login', validateMiddleware.checkLogin, authController.login);

/*
//SQL INJECTION
route.post('/login', validateMiddleware.checkLogin, authController.loginError); 
//email: ' OR '1'='1' LIMIT 3,1 -- ' 
//SQL INJECTION
*/

export default route;