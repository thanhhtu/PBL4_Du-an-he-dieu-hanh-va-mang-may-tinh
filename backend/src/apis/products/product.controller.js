import productService from './product.service';
import { StatusCodes } from 'http-status-codes';
import { handlerErrorRes } from '../../service/handleError.service';

class ProductController {
    async getAllProducts(req, res, next){
        try{
            const result = await productService.getAllProducts();
            res.status(StatusCodes.OK).json({
                success: true,
                data: result
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async getPopularProducts(req, res, next){
        try{
            const allProducts = await productService.getAllProducts();
            const result = allProducts.splice(0, 4);
            res.status(StatusCodes.OK).json({
                success: true,
                data: result
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async getNewCollection(req, res, next){
        try{
            const allProducts = await productService.getAllProducts();
            const result = allProducts.slice(-8);
            res.status(StatusCodes.OK).json({
                success: true,
                data: result
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async addProduct(req, res, next){
        try{
            const productInfo = req.body;
            const img = req.file; 
            const result = await productService.addProduct(productInfo, img);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Add successfully',
                insertId: result,
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async updateProduct(req, res, next){
        try{
            const productId = req.params.productId;
            const productInfo = req.body;
            const img = req.file;
            await productService.updateProduct(productId, productInfo, img);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Update successfully'
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }

    async deleteProduct(req, res, next){
        try{
            const productId = req.params.productId;
            await productService.deleteProduct(productId);
            res.status(StatusCodes.OK).json({
                success: true,
                message: 'Delete successfully'
            });
        }catch(error){
            handlerErrorRes(error, res);
        }
    }
}

export default new ProductController();