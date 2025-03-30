import { StatusCodes } from 'http-status-codes';
import { handlerErrorRes } from '../service/handleError.service';
import rbacModel from '../models/rbac.model';

class AuthorizationMiddleware {
    checkPermission(permission){
        return async (req, res, next) => {
            try{
                const userId = Number(req.user.id);

                const userPermissions = await rbacModel.getPermissionsByUserId(userId);
                
                if(userPermissions.includes(permission)){
                    return next();
                }

                res.status(StatusCodes.FORBIDDEN).json({
                    success: false,
                    error: 'Permission denied. Unable to perform this action',
                });
            }catch(error){
                handlerErrorRes(error, res);
            }
        };
    }
}

export default new AuthorizationMiddleware()
