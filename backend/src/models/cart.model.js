import { StatusCodes } from 'http-status-codes';
import pool from '../config/db.config';
import CustomError from '../service/customError.service';
import { errorHandlerFunc } from '../service/handleError.service';

class CartModel {
    async getCardByUserId(userId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM cart WHERE UserId = ?;', userId);
            connection.release();
            return rows;
        });
    }

    async getProductInCart(userId, productId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM cart WHERE UserId = ? AND ProductId = ?;', [userId, productId]);
            connection.release();
            return rows[0];
        });
    }

    async addProductToCart(userId, productId, quantity){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = 'INSERT INTO cart (UserId, ProductId, Quantity) VALUES (?, ?, ?);';
            const value = [userId, productId, quantity];
            const result = await connection.query(query, value);
            connection.release();

            if(!result[0].insertId){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No product is added to the cart');
            }
            
            return result[0].insertId;
        });
    }

    async updateProductInCart(userId, productId, quantity){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = 'UPDATE cart SET Quantity = ? WHERE UserId = ? AND ProductId = ?';
            const value = [quantity, userId, productId];
            const results = await connection.query(query, value);
            connection.release();

            if(!results[0].affectedRows){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No cart is updated');
            }
            
            return results[0].affectedRows;
        });
    }

    async deleteProductFromCart(userId, productId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const results = await connection.query('DELETE FROM cart WHERE UserId = ? AND ProductId = ?', [userId, productId]);
            connection.release();
            
            if(!results[0].affectedRows){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No product is removed from the cart');
            }

            return results[0].affectedRows;
        });
    }

    async getProductInCartByProductIds(productIds){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const placeholders = productIds.map(() => '?').join(',');
            const [rows] = await connection.query(`SELECT * FROM cart WHERE ProductId IN (${placeholders});`, productIds);
            connection.release();
            return rows;
        });
    }
}

export default new CartModel()
