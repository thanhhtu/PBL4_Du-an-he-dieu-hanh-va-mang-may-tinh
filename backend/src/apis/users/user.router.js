import express from 'express';
import userController from './user.controller';
import verifyMiddleware from '../../middleware/verify.middleware';
import authorizationMiddleware from '../../middleware/authorization.middleware';
import { Permission } from '../../types/rbac.object';
import validateMiddleware from '../../middleware/validate.middleware';

const route = express.Router();

route.use(verifyMiddleware.checkAuth);

route.route('/me')
    .get(
        authorizationMiddleware.checkPermission(Permission.VIEW_USER),
        userController.getMe
    )
    .post(
        authorizationMiddleware.checkPermission(Permission.VIEW_USER),
        validateMiddleware.checkUserInfo,
        userController.updateMe
    );

route.get('/', 
    authorizationMiddleware.checkPermission(Permission.VIEW_ALL_USERS), 
    userController.getAllUsersByRoleUser
);

route.delete('/:userId',
        validateMiddleware.userId,
        authorizationMiddleware.checkPermission(Permission.DELETE_USER),
        userController.deleteUser
    );

export default route;``