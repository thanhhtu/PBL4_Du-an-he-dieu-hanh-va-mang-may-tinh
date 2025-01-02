import authService from './auth.service';
import { StatusCodes } from 'http-status-codes';
import { handlerErrorRes } from '../../service/handleError.service';

class AuthController {
    async register(req, res, next){
        try{
            const newUserInfo = req.body;

            const {token, name} = await authService.register(newUserInfo);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Register successfully',
                token: token,
                name: name
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async login(req, res, next){
        try{
            const {Email, Password} = req.body;
            const {token, name, roles} = await authService.login({Email, Password});
            if(token){
                res.status(StatusCodes.OK).json({
                    success: true,
                    message: 'Login successfully',
                    token: token,
                    name: name,
                    roles: roles
                });
            }
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    //SQL INJECTION
    async loginError(req, res, next){
        try{
            const {Email, Password} = req.body;
            const {token, name, roles} = await authService.loginError({Email, Password});
            if(token){
                res.status(StatusCodes.OK).json({
                    success: true,
                    token: token,
                    name: name,
                    roles: roles
                });
            }
        }catch(error){
            handlerErrorRes(error, res);
        }
    }
    //SQL INJECTION

    async forgetPassword(req, res, next){
        try {
            const {Email} = req.body;

            const result = await authService.forgetPassword(Email);
            if(result){
                res.status(StatusCodes.OK).json({
                    success: true,
                    message: 'The password reset email has been sent successfully'
                });
            }
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async resetPassword(req, res, next){
        try {
            const {Email, PasswordResetToken, NewPassword} = req.body;

            const result = await authService.resetPassword(Email, PasswordResetToken, NewPassword);
            
            if(result){
                res.status(StatusCodes.OK).json({
                    success: true,
                    message: 'Reset password successfully'
                });
            }
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }
}

export default new AuthController();