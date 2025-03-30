
import { errorHandlerFunc } from '../../service/handleError.service';
import CustomError from '../../service/customError.service';
import { StatusCodes } from 'http-status-codes';
import shippingModel from '../../models/shipping.model';
import orderProductModel from '../../models/orderProduct.model';
import orderModel from '../../models/order.model';
import productModel from '../../models/product.model';
import cartModel from '../../models/cart.model';
import pdfDocument, { file } from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { formattedPrice } from '../../service/format.service';

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

    async getOrderReceipt(userId, filename){
        return errorHandlerFunc(async () => {
            //check order belongs to user
            const regex = /order-(\d+)\.pdf/;
            const match = filename.match(regex);
            if(!match){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'Invalid filename');
            }
            const orderId = match[1];  
            const order = await orderModel.getUserOrderById(userId, orderId);
            if(!order){
                throw new CustomError(StatusCodes.NOT_FOUND, 'You are not authorized to access this order');
            }

            //get safe filename
            const safeFilename = path.basename(filename);  //remove ../
            const filePath = path.join(__dirname, 'pdf', `../../../public/pdf/${safeFilename}`);
            
            try{
                const stats = fs.statSync(filePath);
                if(!stats.isFile()){
                    throw new CustomError(StatusCodes.NOT_FOUND, 'File not found');
                }
            }catch(error){
                if (error.code === 'ENOENT') {
                    throw new CustomError(StatusCodes.NOT_FOUND, 'File not found');
                }
            }
            
            return filePath;
        });
    }

    //ERROR PATH TRAVERSAL
    async getOrderReceiptError(filename){
        return errorHandlerFunc(async () => {
            const filePath = path.join(__dirname, 'pdf', `../../../public/pdf/${filename}`);
            return filePath;
        });
    }
    //ERROR PATH TRAVERSAL

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

            //generate pdf;
            const pdfPath = await this.generateOrderPDF(userId, orderId);

            return {orderId, pdfPath};
        });
    }

    async generateOrderPDF(userId, orderId) {
        return errorHandlerFunc(async () => {
            const orderInfo = await this.getDetailUserOrder(userId, orderId);
            const doc = new pdfDocument({margin: 35});
            const fileName = `order-${orderId}.pdf`;
            const filePath = path.join(__dirname, `../../public/pdf/${fileName}`);
    
            doc.pipe(fs.createWriteStream(filePath));
    
            //page settings
            const startX = doc.page.margins.left;
            const endX = doc.page.width - doc.page.margins.right;
    
            //header
            doc.fontSize(24)
               .font('Helvetica-Bold')
               .text('RECEIPT', startX)
               .fontSize(12)
               .font('Helvetica')
               .text(orderInfo.CreatedAt, startX);
    
            //company Info
            const companyName = 'TTShop';
            const companyAddress = 'University of Science and Technology, Danang University';
    
            doc.font('Helvetica-Bold')
               .text(companyName, startX + 380, 50)
               .font('Helvetica')
               .text(companyAddress, startX + 380, doc.y + 5);
    
            // Bill to section
            doc.moveDown(2)
               .font('Helvetica-Bold')
               .text('Bill to:', startX, doc.y, {continued: false})
               .font('Helvetica')
               .text(orderInfo.ShippingInfo.Name, startX, doc.y + 5)
               .text(orderInfo.ShippingInfo.PhoneNumber, startX, doc.y + 5)
               .text(orderInfo.ShippingInfo.Address, startX, doc.y + 5);
    
            // Table settings
            const tableTop = doc.y + 20;
            const tableWidth = endX - startX;
            const columnWidths = [40, 220, 80, 100, 110];
            const cellPadding = 10;
            const rowHeight = 30;
            const tableHeaders = ['No.', 'Product', 'Quantity', 'Price', 'Total'];
    
            // Column positions
            const colPositions = columnWidths.reduce((acc, width, i) => {
                acc[i] = (i === 0) ? startX : acc[i-1] + columnWidths[i-1];
                return acc;
            }, []);
    
            // Draw table header
            doc.fillColor('#e5e5e5')
               .rect(startX, tableTop, tableWidth, rowHeight)
               .fill()
               .strokeColor('#000000')
               .lineWidth(1);
    
            // Header text
            tableHeaders.forEach((header, i) => {
                const textWidth = doc.widthOfString(header);
                const textX = colPositions[i] + (columnWidths[i] - textWidth) / 2;
                doc.font('Helvetica-Bold')
                   .fillColor('#000')
                   .text(header, textX, tableTop + cellPadding);
            });
    
            // Draw header border
            doc.rect(startX, tableTop, tableWidth, rowHeight).stroke();
            colPositions.forEach(x => {
                doc.moveTo(x, tableTop).lineTo(x, tableTop + rowHeight).stroke();
            });
            doc.moveTo(endX, tableTop).lineTo(endX, tableTop + rowHeight).stroke();
    
            // Table content
            let yPosition = tableTop + rowHeight;
            
            orderInfo.allOrderProducts.forEach((item, index) => {
                if (yPosition > 700) {
                    doc.addPage();
                    yPosition = 50;
                }
    
                // Draw row
                doc.rect(startX, yPosition, tableWidth, rowHeight).stroke();
    
                // Cell contents
                const cellY = yPosition + cellPadding;
                doc.font('Helvetica');
    
                // No.
                const noText = (index + 1).toString();
                doc.text(noText, colPositions[0] + (columnWidths[0] - doc.widthOfString(noText)) / 2, cellY);
    
                // Product
                doc.text(item.ProductName, colPositions[1] + cellPadding, cellY);
    
                // Quantity
                const qtyText = item.Quantity.toString();
                doc.text(qtyText, colPositions[2] + (columnWidths[2] - doc.widthOfString(qtyText)) / 2, cellY);
    
                // Price
                const priceText = formattedPrice(item.PriceAtOrder);
                doc.text(priceText, colPositions[3] + (columnWidths[3] - doc.widthOfString(priceText)) / 2, cellY);
    
                // Total
                const totalText = formattedPrice(item.Quantity * item.PriceAtOrder);
                doc.text(totalText, colPositions[4] + (columnWidths[4] - doc.widthOfString(totalText)) / 2, cellY);
    
                // Vertical lines
                colPositions.forEach(x => {
                    doc.moveTo(x, yPosition).lineTo(x, yPosition + rowHeight).stroke();
                });
                doc.moveTo(endX, yPosition).lineTo(endX, yPosition + rowHeight).stroke();
    
                yPosition += rowHeight;
            });
    
            // Total section
            const totalsY = yPosition + 20;
            const totalsLabelX = endX - 250;
            const totalsValueX = endX - 80;
    
            doc.fontSize(12)
               .font('Helvetica')
               .text('Subtotal:', totalsLabelX, totalsY)
               .text(formattedPrice(orderInfo.TotalPrice), totalsValueX, totalsY)
               .text('Shipping Fee:', totalsLabelX, totalsY + 20)
               .text('Free', totalsValueX, totalsY + 20)
               .font('Helvetica-Bold')
               .fontSize(15)
               .text('Total:', totalsLabelX, totalsY + 40)
               .text(formattedPrice(orderInfo.TotalPrice), totalsValueX, totalsY + 40);
    
            doc.end();
            return filePath;
        });
    }
}

export default new OrderService()
