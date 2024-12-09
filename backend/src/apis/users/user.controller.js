import { StatusCodes } from 'http-status-codes';
import userService from './user.service';
import { handlerErrorRes } from '../../service/handleError.service';

class UserController {
    async getMe(req, res, next){
        try{
            const userId = req.user.id;
            const user = await userService.getUserById(userId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: user
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async updateMe(req, res, next){
        try{
            const userId = req.user.id;
            const userInfo = req.body;
            await userService.updateUser(userId, userInfo);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Update successfully'
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async getAllUsersByRoleUser(req, res, next){
        try{
            const users = await userService.getAllUsersByRoleUser();
            res.status(StatusCodes.OK).json({
                success: true,
                data: users
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async deleteUser(req, res, next){
        try{
            const userId = req.params.userId;
            await userService.deleteUser(userId);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Delete successfully'
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }
}

export default new UserController();