import pool from '../config/db.config';
import CustomError from '../service/customError.service';
import { errorHandlerFunc } from '../service/handleError.service';
import { StatusCodes } from 'http-status-codes';

class ShippingModel {
    async getUserShippingById(userId, shippingId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT *, CAST(IsDefault AS INT) AS IsDefault FROM shipping WHERE ShippingId = ? AND UserId = ?;', [shippingId, userId]);
            connection.release();
            return rows[0];
        });
    }

    async getAllUserShipping(userId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT *, CAST(IsDefault AS INT) AS IsDefault FROM shipping WHERE UserId = ?;', userId);
            connection.release();
            return rows;
        });
    }

    async getDefaultUserShipping(userId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT *, CAST(IsDefault AS INT) AS IsDefault FROM shipping WHERE IsDefault = 1 AND UserId = ?;', userId);
            connection.release();
            return rows[0];
        });
    }

    async addShipping(userId, detailShipping, isDefault){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();

            const query = 'INSERT INTO shipping (UserId, Name, PhoneNumber, Address, IsDefault) VALUES (?, ?, ?, ?, ?);'
            const {Name, PhoneNumber, Address} = detailShipping;
            const value = [userId, Name, PhoneNumber, Address, isDefault];
            const result = await connection.query(query, value);

            connection.release();

            if(!result[0].insertId){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No shipping information is added');
            }

            return result[0].insertId;
        });
    }

    async updateShipping(shippingId, detailShipping){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();

            const query = 'UPDATE shipping SET Name = ?, PhoneNumber = ?, Address = ? WHERE ShippingId = ?;'
            const {Name, PhoneNumber, Address} = detailShipping;
            const value = [Name, PhoneNumber, Address, shippingId];
            const result = await connection.query(query, value);
            
            connection.release();

            if(!result[0].affectedRows){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No shipping information is updated');
            }

            return result[0].affectedRows;
        });
    }

    async deleteShipping(shippingId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();

            const query = 'DELETE FROM shipping WHERE ShippingId = ?;';
            const value = [shippingId];
            const result = await connection.query(query, value);
            
            connection.release();

            if(!result[0].affectedRows){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No shipping information is updated');
            }

            return result[0].affectedRows;
        });
    }

    async updateUserDefaultShipping(shippingId, isDefault){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const result = await connection.query('UPDATE shipping SET IsDefault = ? WHERE ShippingId = ?;', [isDefault, shippingId]);
            connection.release();

            if(!result[0].affectedRows){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No shipping information is updated');
            }

            return result[0].affectedRows;
        });
    }
}

export default new ShippingModel();
