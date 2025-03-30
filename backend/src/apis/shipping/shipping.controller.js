import shippingService from './shipping.service';
import { StatusCodes } from 'http-status-codes';
import { handlerErrorRes } from '../../service/handleError.service';

class ShippingController {
    async getUserShipping(req, res, next) {
        try {
            const userId = req.user.id;
            const shippingId = Number(req.params.shippingId);
            let shippings;
            if(shippingId){
                shippings = await shippingService.getDetailUserShipping(shippingId, userId);
            }else{
                shippings = await shippingService.getAllUserShipping(userId);
            }
            
            res.status(StatusCodes.OK).json({
                success: true,
                data: shippings,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async getDefaultUserShipping(req, res, next) {
        try {
            const userId = req.user.id;
            const shipping = await shippingService.getDefaultUserShipping(userId);
            
            res.status(StatusCodes.OK).json({
                success: true,
                data: shipping,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async addShipping(req, res, next) {
        try {
            const userId = req.user.id;
            const detailShipping = req.body;
            const result = await shippingService.addShipping(userId, detailShipping);
            
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Added successfully',
                insertId: result,
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async updateShipping(req, res, next) {
        try {
            const userId = req.user.id;
            const shippingId = Number(req.params.shippingId);
            const detailShipping = req.body;
            await shippingService.updateShipping(userId, shippingId, detailShipping);
            
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Updated successfully',
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async deleteShipping(req, res, next) {
        try {
            const userId = req.user.id;
            const shippingId = Number(req.params.shippingId);
            await shippingService.deleteShipping(userId, shippingId);
            
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Deleted successfully',
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }

    async changDefaultShipping(req, res, next) {
        try {
            const userId = req.user.id;
            const shippingId = Number(req.params.shippingId);
            await shippingService.changDefaultShipping(userId, shippingId);
            
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Changed successfully',
            });
        } catch (error) {
            handlerErrorRes(error, res);
        }
    }
}

export default new ShippingController();