import { errorHandlerFunc } from '../../service/handleError.service';
import cartModel from '../../models/cart.model';
import CustomError from '../../service/customError.service';
import { StatusCodes } from 'http-status-codes';
import productModel from '../../models/product.model';

class CartService{
    async cartInfo(cart){
        const product = await productModel.getProductById(cart.ProductId);
        let cartInfo = {
            CartId: Number(cart.CartId),
            ProductId: Number(product.ProductId),
            ProductName: product.ProductName,
            ProductImgUrl: product.ImageUrl,
            ProductPrice: Number(product.Price),
            Quantity: Number(cart.Quantity)
        };
        return cartInfo;
    }

    async getUserCart(userId){
        return errorHandlerFunc(async () => {
            const carts = await cartModel.getCardByUserId(userId);
            let allCartInfo = [];
            for(let cart of carts){
                let cartInfo = await this.cartInfo(cart);
                allCartInfo.push(cartInfo);
            }
            return allCartInfo;
        });
    }

    async addProductToCart(userId, productId){
        return errorHandlerFunc(async () => {
            const product = await productModel.getProductById(productId);
            if(!product){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Product not found');
            }
            const productInCart = await cartModel.getProductInCart(userId, productId);
            if(productInCart){
                const quantity = productInCart.Quantity + 1;
                await cartModel.updateProductInCart(userId, productId, quantity);
                console.log(productInCart)
                return productInCart.CartId;
            }else{
                const quantity = 1;
                const result = await cartModel.addProductToCart(userId, productId, quantity);
                return result;
            }
        });
    }

    async updateCart(userId, productId, quantity){
        return errorHandlerFunc(async () => {
            const productInCart = await cartModel.getProductInCart(userId, productId);
            if(!productInCart){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Product not found in cart');
            }
            
            const result = await cartModel.updateProductInCart(userId, productId, quantity);
            return result;
            
        });
    }

    async deleteProductFromCart(userId, productId){
        return errorHandlerFunc(async () => {
            const productInCart = await cartModel.getProductInCart(userId, productId);
            if(!productInCart){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Product not found in cart');
            }
            
            const result = await cartModel.deleteProductFromCart(userId, productId);
            return result;
            
        });
    }
}

export default new CartService()
