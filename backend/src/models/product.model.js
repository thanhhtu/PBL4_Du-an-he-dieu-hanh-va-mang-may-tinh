import pool from '../config/db.config';
import CustomError from '../service/customError.service';
import { errorHandlerFunc } from '../service/handleError.service';
import { StatusCodes } from 'http-status-codes';

class ProductModel {
    async getProductById(productId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM product WHERE ProductId = ?;', productId);
            connection.release();
            return rows[0];
        });
    }

    async getAllProducts(){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM product');
            connection.release();
            return rows;
        });
    }

    async addProduct(productInfo, imgUrl, imgPublicId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = 'INSERT INTO product (ProductName, Description, Price, Quantity, ImageUrl, ImagePublicId) VALUES (?, ?, ?, ?, ?, ?);';
            const {ProductName, Description, Price, Quantity} = productInfo;
            const value = [ProductName, Description, Price, Quantity, imgUrl, imgPublicId];
            const result = await connection.query(query, value);
            connection.release();

            if(!result[0].insertId){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No product is added');
            }

            return result[0].insertId;
        });
    }

    async updateProduct(productId, productInfo, imgPublicId, imgUrl){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = 'UPDATE product SET ProductName = ?, Description = ?, Price = ?, Quantity = ?, ImageUrl = ?, ImagePublicId = ? WHERE ProductId = ?';
            const {ProductName, Description, Price, Quantity} = productInfo;
            const value = [ProductName, Description, Price, Quantity, imgUrl, imgPublicId, productId];
            const results = await connection.query(query, value);
            connection.release();

            if(!results[0].affectedRows){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No product is updated');
            }
            
            return results[0].affectedRows;
        });
    }

    async deleteProduct(productId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const results = await connection.query('DELETE FROM product WHERE ProductId = ?', productId);
            connection.release();

            if(!results[0].affectedRows){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No product is deleted');
            }

            return results[0].affectedRows;
        });
    }

    async getProductsByIds(productIds){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const placeholders = productIds.map(() => '?').join(',');
            const [rows] = await connection.query(`SELECT * FROM product WHERE ProductId IN (${placeholders});`, productIds);
            connection.release();
            return rows;
        });
    }

    async updateStockQuantity(productId, stockQuantity){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const results = await connection.query('UPDATE product SET Quantity = ? WHERE ProductId = ?', [stockQuantity, productId]);
            connection.release();

            if(!results[0].affectedRows){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No product is updated');
            }
            
            return results[0].affectedRows;
        });
    }
}

export default new ProductModel()
