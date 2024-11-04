import pool from '../config/db.config';
import CustomError from '../service/customError.service';
import { errorInfo } from '../service/handleError.service';
import { StatusCodes } from 'http-status-codes';

class UsersModel {
    //sql injection
    async getUserError(loginInfo){
        try{
            const connection = await pool.getConnection();
            console.log(loginInfo)
            const query = `SELECT * FROM users WHERE Email = '${loginInfo.Email}' AND Password = '${loginInfo.Password}';`;
            console.log(query);

            const [rows] = await connection.query(query);

            connection.release();
            return rows;
        }catch(error){
            const { statusError, messageError } = errorInfo(error);
            throw new CustomError(statusError, messageError);
        }
    }
    //sql injection

    async getDetailUser(userId){
        try{
            const connection = await pool.getConnection();
            const query = `SELECT Email, Password, FullName, PhoneNumber FROM users WHERE UserID = ?;`;
            const [rows] = await connection.query(query, userId);

            if(rows[0] == null){
                throw new CustomError(StatusCodes.NOT_FOUND, 'User not found'); //404
            }

            connection.release();
            return rows[0];
        }catch(error){
            const { statusError, messageError } = errorInfo(error);
            throw new CustomError(statusError, messageError);
        }
    }

    async createUser(user){
        try{
            const {Email, Password, FullName, PhoneNumber} = user;

            const connection = await pool.getConnection();
            
            const queryUser = `INSERT INTO users (Email, Password, FullName, PhoneNumber) VALUES (?, ?, ?, ?);`;
            const valueUser = [Email, Password, FullName, PhoneNumber];
            const resultsUser = await connection.query(queryUser, valueUser);


            connection.release();
            return resultsUser[0].insertId;
        }catch(error){
            const { statusError, messageError } = errorInfo(error);
            throw new CustomError(statusError, messageError);
        }
    }

    async getUserByEmail(email) {
        try{
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM users WHERE Email = ?', email);
            connection.release();
            console.log(rows[0])
            return rows[0];
        }catch(error){
            const { statusError, messageError } = errorInfo(error);
            throw new CustomError(statusError, messageError);
        }
    }

    async setAccessToken(accessToken, email){
        try{
            const connection = await pool.getConnection();
            await connection.query('UPDATE users SET AccessToken = ? WHERE Email = ?', [accessToken, email]);
            connection.release();
            return true;
        }catch(error){
            const { statusError, messageError } = errorInfo(error);
            throw new CustomError(statusError, messageError);
        }
    }

    async getAccessTokenByUserID(userId){
        try{
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM users WHERE UserID = ?', userId);
            connection.release();
            return rows[0].AccessToken;
        }catch(error){
            const { statusError, messageError } = errorInfo(error);
            throw new CustomError(statusError, messageError);
        }
    }
}

export default new UsersModel()
