import express from 'express';
import shippingController from './shipping.controller';
import verifyMiddleware from '../../middleware/verify.middleware';
import authorizationMiddleware from '../../middleware/authorization.middleware';
import { Permission } from '../../types/rbac.object';
import validateMiddleware from '../../middleware/validate.middleware';

const route = express.Router();

route.use(verifyMiddleware.checkAuth);

route.get('/default',
    authorizationMiddleware.checkPermission(Permission.VIEW_SHIPPING),
    shippingController.getDefaultUserShipping
)

route.get('/:shippingId?', 
    validateMiddleware.shippingId,
    authorizationMiddleware.checkPermission(Permission.VIEW_SHIPPING),
    shippingController.getUserShipping
);

route.post('/',
    authorizationMiddleware.checkPermission(Permission.ADD_SHIPPING),
    validateMiddleware.checkShipping,
    shippingController.addShipping
);

route.put('/default/:shippingId',
    validateMiddleware.shippingId,
    authorizationMiddleware.checkPermission(Permission.CHANGE_DEFAULT_SHIPPING),
    shippingController.changDefaultShipping
)

route.route('/:shippingId')
    .put(
        validateMiddleware.shippingId,
        authorizationMiddleware.checkPermission(Permission.EDIT_SHIPPING),
        validateMiddleware.checkShipping,
        shippingController.updateShipping
    )
    .delete(
        validateMiddleware.shippingId,
        authorizationMiddleware.checkPermission(Permission.DELETE_SHIPPING),
        shippingController.deleteShipping
    );

export default route;
