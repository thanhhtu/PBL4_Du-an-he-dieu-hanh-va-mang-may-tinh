
import { errorHandlerFunc } from '../../service/handleError.service';
import CustomError from '../../service/customError.service';
import { StatusCodes } from 'http-status-codes';
import shippingModel from '../../models/shipping.model';
import orderProductModel from '../../models/orderProduct.model';
import orderModel from '../../models/order.model';
import productModel from '../../models/product.model';
import cartModel from '../../models/cart.model';

class OrderService{
    async shippingInfo(shipping){
        let shippingInfo = {
            ShippingId: Number(shipping.ShippingId),
            Name: shipping.Name,
            PhoneNumber: shipping.PhoneNumber,
            Address: shipping.Address
        };
        return shippingInfo;
    }

    async orderProductInfo(orderProduct){
        const product = await productModel.getProductById(orderProduct.ProductId);
        let orderProductInfo = {
            ShippingId: Number(orderProduct.OrderProductId),
            ProductId: Number(orderProduct.ProductId),
            ProductName: product.ProductName,
            Quantity: orderProduct.Quantity,
            PriceAtOrder: orderProduct.PriceAtOrder
        };
        return orderProductInfo;
    }

    async orderInfo(userId, order){
        const shipping = await shippingModel.getUserShippingById(userId, order.ShippingId);

        const orderProducts = await orderProductModel.getOrderProductsByOrderId(order.OrderId);
        let allOrderProductInfo = [];
        for(let orderProduct of orderProducts){
            const orderProductInfo = await this.orderProductInfo(orderProduct);
            allOrderProductInfo.push(orderProductInfo);
        }

        let orderInfo = {
            OrderId: Number(order.OrderId),
            UserId: Number(order.UserId),

            ShippingInfo: await this.shippingInfo(shipping),
            
            TotalPrice: order.TotalPrice,
            PaymentMethod: order.PaymentMethod,
            CreatedAt: order.CreatedAt,

            allOrderProducts: allOrderProductInfo
        };
        return orderInfo;
    }

    async getDetailUserOrder(userId, orderId){
        return errorHandlerFunc(async () => {
            const order = await orderModel.getUserOrderById(userId, orderId);
            if(!order){
                throw new CustomError(StatusCodes.NOT_FOUND, 'You are not authorized to access this order');
            }
            const orderInfo = await this.orderInfo(userId, order);
            return orderInfo;
        });
    }

    async getAllUserOrders(userId){
        return errorHandlerFunc(async () => {
            const orders = await orderModel.getAllUserOrders(userId);
            let allOrderInfo = [];
            for(let order of orders){
                const orderInfo = await this.orderInfo(userId, order);
                allOrderInfo.push(orderInfo);
            }
            return allOrderInfo;
        });
    }

    async addOrder(userId, detailOrder){
        return errorHandlerFunc(async () => {
            //validate shipping information
            const shipping = await shippingModel.getUserShippingById(userId, detailOrder.ShippingId);
            if(!shipping){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'You are not authorized to access this shipping information');
            }

            //validate exist product
            const orderProducts = detailOrder.OrderProducts;
            const orderProductIds = orderProducts.map(product => product.ProductId);
            
            const existProducts = await productModel.getProductsByIds(orderProductIds);
            const existProductIds = existProducts.map(product => product.ProductId);
            
            const nonExistProductIds = orderProductIds.filter(id => !existProductIds.includes(id));
            if(nonExistProductIds.length){
                throw new CustomError(StatusCodes.NOT_FOUND, `Not found product: ${nonExistProductIds}`);
            }

            //validate user added product to cart (add to cart then checkout)
            const productsInCart = await cartModel.getProductInCartByProductIds(orderProductIds);
            const productsInCartIds = productsInCart.map(product => product.ProductId);
            const nonProductsInCartIds = orderProductIds.filter(id => !productsInCartIds.includes(id));
            if(!productsInCartIds.length || nonProductsInCartIds.length){
                throw new CustomError(StatusCodes.NOT_FOUND, `Not add products ${nonProductsInCartIds} to cart`);
            }

            //validate stock product and calculate total price
            let totalPrice = 0;
            const stockProducts = [];
            for(let orderProduct of orderProducts){
                const product = await productModel.getProductById(orderProduct.ProductId);

                if(orderProduct.Quantity > product.Quantity){
                    throw new CustomError(StatusCodes.BAD_REQUEST, `There is not enough stock for product with id ${product.ProductId}`);
                }
                
                totalPrice += orderProduct.Quantity * orderProduct.PriceAtOrder;
                
                stockProducts.push({
                    ProductId: orderProduct.ProductId,
                    StockQuantity: product.Quantity - orderProduct.Quantity,
                    OrderQuantity: orderProduct.Quantity,
                    PriceAtOrder: orderProduct.PriceAtOrder
                });
            }

            //create order
            const orderId = await orderModel.addOrder(userId, detailOrder.ShippingId, totalPrice, detailOrder.PaymentMethod);
            for(let stockProduct of stockProducts){
                await orderProductModel.addOrderProduct(orderId, stockProduct.ProductId, stockProduct.OrderQuantity, stockProduct.PriceAtOrder);

                //update stock product quantity
                await productModel.updateStockQuantity(stockProduct.ProductId, stockProduct.StockQuantity);

                //remove product from cart
                await cartModel.deleteProductFromCart(userId, stockProduct.ProductId);
            }

            return orderId;
        });
    }
}

export default new OrderService()
