import { StatusCodes } from 'http-status-codes';
import userService from './user.service';
import { handlerErrorRes } from '../../service/handleError.service';

class UserController {
    async getOwnInfo(req, res, next){
        try{
            const userId = req.user.id;
            const user = await userService.getOwnInfo;
            res.status(StatusCodes.OK).json({
                success: true,
                data: user
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async getAllUsersRoleUser(req, res, next){
        try{
            let users;
            users = await userService.getAllUsersRoleUser();
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
            const userId = req.params.id;
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