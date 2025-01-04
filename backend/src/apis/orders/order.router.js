import express from 'express';
import orderController from './order.controller';
import verifyMiddleware from '../../middleware/verify.middleware';
import authorizationMiddleware from '../../middleware/authorization.middleware';
import { Permission } from '../../types/rbac.object';
import validateMiddleware from '../../middleware/validate.middleware';

const route = express.Router();

route.use(verifyMiddleware.checkAuth);

// route.get('/receipt', //query param
//     validateMiddleware.filename,
//     authorizationMiddleware.checkPermission(Permission.VIEW_ORDER),
//     orderController.getOrderReceipt
// );


//ERROR PATH TRAVERSAL
route.get('/receipt', //query param
    authorizationMiddleware.checkPermission(Permission.VIEW_ORDER),
    orderController.getOrderReceiptError
);
//ERROR PATH TRAVERSAL


route.get('/:orderId?',
    validateMiddleware.orderId,
    authorizationMiddleware.checkPermission(Permission.VIEW_ORDER),
    orderController.getUserOrder
);

route.post('/',
    authorizationMiddleware.checkPermission(Permission.ADD_ORDER),
    validateMiddleware.checkOrder,
    orderController.addOrder
);

export default route;
