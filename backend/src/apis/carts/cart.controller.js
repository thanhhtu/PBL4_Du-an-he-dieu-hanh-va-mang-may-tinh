import cartService from './cart.service';
import { StatusCodes } from 'http-status-codes';
import { handlerErrorRes } from '../../service/handleError.service';

class CartController {
    async getUserCart(req, res, next){
        try{
            const userId = req.user.id;
            const result = await cartService.getUserCart(userId);
            res.status(StatusCodes.OK).json({
                success: true,
                data: result
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async addProductToCart(req, res, next){
        try{
            const userId = req.user.id;
            const productId = req.params.productId;
            const quantity = req.body.Quantity;

            const result = await cartService.addProductToCart(userId, productId, quantity);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Added successfully',
                insertId: result,
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async updateCart(req, res, next){
        try{
            const userId = req.user.id;
            const productId = req.params.productId;
            const quantity = req.body.Quantity;

            await cartService.updateCart(userId, productId, quantity);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Updated successfully'
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async deleteProductFromCart(req, res, next){
        try{
            const userId = req.user.id;
            const productId = req.params.productId;

            await cartService.deleteProductFromCart(userId, productId);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Deleted successfully'
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }
}

export default new CartController();