import pool from '../config/db.config';
import CustomError from '../service/customError.service';
import { errorHandlerFunc } from '../service/handleError.service';
import { StatusCodes } from 'http-status-codes';

class OrderModel {
    async getUserOrderById(userId, orderId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM purchase_order WHERE UserId = ? AND OrderId = ?;', [userId, orderId]);
            connection.release();
            return rows[0];
        });
    }

    async getAllUserOrders(userId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM purchase_order WHERE UserId = ?;', userId);
            connection.release();
            return rows;
        });
    }

    async addOrder(userId, shippingId, totalPrice, paymentMethod){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = 'INSERT INTO purchase_order (UserId, ShippingId, TotalPrice, PaymentMethod) VALUES (?, ?, ?, ?);';
            const value = [userId, shippingId, totalPrice, paymentMethod];
            const result = await connection.query(query, value);
            connection.release();

            if(!result[0].insertId){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No order is added');
            }

            return result[0].insertId;
        });
    }

    async getOrderById(orderId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM purchase_order WHERE OrderId = ?;', orderId);
            connection.release();
            return rows[0];
        });
    }
}

export default new OrderModel();
