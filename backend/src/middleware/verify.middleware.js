import userIdentityService from '../service/authentication.service'
import usersModel from '../models/users.model';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { handlerErrorRes } from '../service/handleError.service';
import CustomError from '../service/customError.service';

class VerifyMiddleware {
    async checkAuth(req, res, next){
        try {
            let token = req.headers.authorization;
            if(!token){
                throw new CustomError(StatusCodes.UNAUTHORIZED, 'No token provided');
            }
            
            token = token.split(' ')[1];
            req.user = await userIdentityService.decodeToken(token);
            
            let userID = Number(req.user.id);
            let storedToken = await usersModel.getAccessTokenByUserID(userID);
            if (token != storedToken) {
                throw new CustomError(StatusCodes.UNAUTHORIZED, 'Invalid token');
            }

            next();
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }
}

export default new VerifyMiddleware()
