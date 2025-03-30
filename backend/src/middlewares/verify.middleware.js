import userIdentityService from '../service/authentication.service'
import { StatusCodes } from 'http-status-codes';
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
            
            let userId = Number(req.user.id);
            if (!userId) {
                throw new CustomError(StatusCodes.UNAUTHORIZED, 'Unauthorized');
            }

            next();
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }
}

export default new VerifyMiddleware()
