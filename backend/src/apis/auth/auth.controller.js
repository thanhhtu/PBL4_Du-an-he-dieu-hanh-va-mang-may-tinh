import authService from './auth.service';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { handlerErrorRes } from '../../service/handleError.service';

class AuthController {
    async register(req, res, next){
        try{
            const newUser = req.body;

            const token = await authService.register(newUser);
            res.status(StatusCodes.OK).json({
                success: true,
                token: token
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async login(req, res, next){
        try{
            const {Email, Password} = req.body;
            const token = await authService.login({Email, Password});
            if(token){
                res.status(StatusCodes.OK).json({
                    success: true,
                    token: token
                });
            }
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    //sql injection
    async loginError(req, res, next){
        try{
            const {Email, Password} = req.body;
            const token = await authService.loginError({Email, Password});
            if(token){
                res.status(StatusCodes.OK).json({
                    success: true,
                    token: token
                });
            }
        }catch(error){
            handlerErrorRes(error, res);
        }
    }
    //sql injection

    async getMe(req, res, next){
        try {
            res.status(StatusCodes.OK).json({
                success: true,
                UserId: req.user.id,
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }
}

export default new AuthController();