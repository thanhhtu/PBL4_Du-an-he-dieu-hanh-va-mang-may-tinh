import pool from '../config/db.config';
import CustomError from '../service/customError.service';
import { errorHandlerFunc } from '../service/handleError.service';
import { StatusCodes } from 'http-status-codes';

class OrderProductModel {
    async getOrderProductsByOrderId(orderId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM order_product WHERE OrderId = ?;', orderId);
            connection.release();
            return rows;
        });
    }

    async addOrderProduct(orderId, productId, quantity, priceAtOrder){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = 'INSERT INTO order_product (OrderId, ProductId, Quantity, PriceAtOrder) VALUES (?, ?, ?, ?);';
            const value = [orderId, productId, quantity, priceAtOrder];
            const result = await connection.query(query, value);
            connection.release();

            if(!result[0].insertId){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No product is ordered');
            }

            return result[0].insertId;
        });
    }
}

export default new OrderProductModel();
