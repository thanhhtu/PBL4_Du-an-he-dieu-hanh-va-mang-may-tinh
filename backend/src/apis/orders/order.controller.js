import orderService from './order.service';
import { StatusCodes } from 'http-status-codes';
import { handlerErrorRes } from '../../service/handleError.service';

class OrderController {
    async getUserOrder(req, res, next) {
        try {
            const userId = req.user.id;
            const orderId = Number(req.params.orderId);
            let orders;
            if(orderId){
                orders = await orderService.getDetailUserOrder(userId, orderId);

                /*
                //ERROR PATH TRAVERSAL
                orders = await orderService.getDetailUserOrderError(userId, orderId);
                //ERROR PATH TRAVERSAL
                */
            }else{
                orders = await orderService.getAllUserOrders(userId);
            }
            
            res.status(StatusCodes.OK).json({
                success: true,
                data: orders,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async addOrder(req, res, next) {
        try {
            const userId = req.user.id;
            const detailOrder = req.body;
            const result = await orderService.addOrder(userId, detailOrder);
            
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Added successfully',
                insertId: result,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }
}

export default new OrderController();