import orderService from './order.service';
import { StatusCodes } from 'http-status-codes';
import { handlerErrorRes } from '../../service/handleError.service';

class OrderController {
    async getOrderReceipt(req, res, next) {
        try {
            const userId = req.user.id;
            const filename = req.query.filename;

            const filePath = await orderService.getOrderReceipt(userId, filename);
            
            res.sendFile(filePath, (err) => {
                if(err){
                    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
                        message: 'Error sending file',
                        error: err.message 
                    });
                }
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    //ERROR PATH TRAVERSAL
    async getOrderReceiptError(req, res, next) {
        try {
            const filename = req.query.filename;

            const filePath = await orderService.getOrderReceiptError(filename);
            
            res.sendFile(filePath, (err) => {
                if(err){
                    console.log(`Error sending file: ${err}`);
                }
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }
    //ERROR PATH TRAVERSAL

    async getUserOrder(req, res, next) {
        try {
            const userId = req.user.id;
            const orderId = Number(req.params.orderId);
            let orders;
            if(orderId){
                orders = await orderService.getDetailUserOrder(userId, orderId);
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
            const {orderId} = await orderService.addOrder(userId, detailOrder);
            
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Added successfully',
                insertId: orderId,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }
}

export default new OrderController();