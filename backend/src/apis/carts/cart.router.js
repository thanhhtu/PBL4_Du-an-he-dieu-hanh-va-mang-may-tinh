import express from 'express';
import cartController from './cart.controller';
import verifyMiddleware from '../../middleware/verify.middleware';
import authorizationMiddleware from '../../middleware/authorization.middleware';
import { Permission } from '../../types/rbac.object';
import validateMiddleware from '../../middleware/validate.middleware';

const route = express.Router();

route.use(verifyMiddleware.checkAuth);

route.get('/',
    authorizationMiddleware.checkPermission(Permission.VIEW_CART),
    cartController.getUserCart
);

route.route('/:productId')
    .post(
        validateMiddleware.productId,
        authorizationMiddleware.checkPermission(Permission.ADD_TO_CART),
        cartController.addProductToCart
    )
    .put(
        validateMiddleware.productId,
        authorizationMiddleware.checkPermission(Permission.EDIT_CART),
        validateMiddleware.checkProductCartQuantity,
        cartController.updateCart
    )
    .delete(
        validateMiddleware.productId,
        authorizationMiddleware.checkPermission(Permission.REMOVE_FROM_CART),
        cartController.deleteProductFromCart
    );

export default route;
