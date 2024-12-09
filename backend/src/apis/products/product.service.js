import { errorHandlerFunc } from '../../service/handleError.service';
import cloudinary from '../../config/cloudinary.config';
import productModel from '../../models/product.model';
import CustomError from '../../service/customError.service';
import { StatusCodes } from 'http-status-codes';

class ProductService{
    async getImgInfo(img){
        return errorHandlerFunc(async () => {
            //check if image uploaded to cloudinary or not
            if(!img){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Image not found'); 
            }
            const imgPublicId = img.filename;
            const imgUrl = cloudinary.url(imgPublicId, {
                transformation: [
                    {
                        quality: 'auto',
                        fetch_format: 'auto'
                    }
                ]
            });
            return { imgPublicId, imgUrl };
        });
    }

    async getAllProducts(){
        return errorHandlerFunc(async () => {
            const result = await productModel.getAllProducts();
            return result;
        });
    }

    async addProduct(productInfo, img){
        return errorHandlerFunc(async () => {
            const { imgPublicId, imgUrl } = await this.getImgInfo(img);
            const result = await productModel.addProduct(productInfo, imgUrl, imgPublicId);
            return result;
        });
    }

    async updateProduct(productId, productInfo, img){
        return errorHandlerFunc(async () => {
            //check product exist
            const product = await productModel.getProductById(productId);
            if(!product){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Product not found');
            }
            
            //upload image
            let imgPublicId, imgUrl;
            if(!img){
                //if not have new image => use old image
                imgPublicId = product.ImagePublicId;
                imgUrl = product.ImageUrl;
            }else{
                //if have new image => use new image and delete old image
                //create new image
                imgPublicId = (await this.getImgInfo(img)).imgPublicId;
                imgUrl = (await this.getImgInfo(img)).imgUrl;

                //delete old image
                await cloudinary.uploader.destroy(product.ImagePublicId);
            }

            //update product
            const result = await productModel.updateProduct(productId, productInfo, imgPublicId, imgUrl);
            if(result == 0){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No product updated');
            }

            return result;
        });
    }

    async deleteProduct(productId){
        return errorHandlerFunc(async () => {
            //check product exist
            const product = await productModel.getProductById(productId);
            if(!product){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Product not found');
            }

            //delete old image
            await cloudinary.uploader.destroy(product.ImagePublicId);

            //delete product
            const result = await productModel.deleteProduct(productId);
            if(result == 0){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No product deleted');
            }

            return result;
        });
    }
}

export default new ProductService()
