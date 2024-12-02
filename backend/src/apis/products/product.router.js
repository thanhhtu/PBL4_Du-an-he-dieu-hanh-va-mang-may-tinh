import express from 'express'
import productController from './product.controller'
import uploadStorage from '../../service/multer.service'
import verifyMiddleware from '../../middleware/verify.middleware'
import authorizationMiddleware from '../../middleware/authorization.middleware'
import { Permission } from '../../types/rbac.object'
import validateMiddleware from '../../middleware/validate.middleware'

const route = express.Router()

route.use(verifyMiddleware.checkAuth)

route.get('/',
    authorizationMiddleware.checkPermission(Permission.VIEW_ALL_PRODUCTS),
    productController.getAllProducts
);

route.post('/',
    authorizationMiddleware.checkPermission(Permission.ADD_PRODUCT),
    uploadStorage.single('image'),
    validateMiddleware.checkProductInfo,
    productController.addProduct
);

route.route('/:id')
    .put(
        validateMiddleware.checkNumberParam,
        authorizationMiddleware.checkPermission(Permission.EDIT_PRODUCT),
        uploadStorage.single('image'),
        validateMiddleware.checkProductInfo,
        productController.updateProduct
    )
    .delete(
        validateMiddleware.checkNumberParam,
        authorizationMiddleware.checkPermission(Permission.DELETE_PRODUCT),
        productController.deleteProduct
    );

export default route
