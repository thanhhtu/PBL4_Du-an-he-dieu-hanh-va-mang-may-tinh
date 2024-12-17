import pool from '../config/db.config';
import { errorHandlerFunc } from '../service/handleError.service';
import rbacModel from './rbac.model';
import { Role } from '../types/rbac.object';

class UserModel {
    //SQL INJECTION
    async getUserError(username, password){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = `SELECT * FROM user WHERE Email = '${username}' AND Password = '${password}';`;
            const [rows] = await connection.query(query);
            connection.release();
            return rows[0];
        });
    }
    //SQL INJECTION

    async getUserById(userId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM user WHERE UserId = ?;', userId);
            connection.release();
            return rows[0];
        });
    }

    async getUserByEmail(email) {
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM user WHERE Email = ?', email);
            connection.release();
            return rows[0];
        });
    }

    async getAllUsersByRoleUser(){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const roleId = await rbacModel.getRoleIdByRoleName(Role.USER);
            const [rows] = await connection.query(`SELECT u.* 
                                                    FROM user u
                                                    JOIN user_role ur ON u.UserId = ur.UserId
                                                    JOIN role r ON ur.RoleId = r.RoleId
                                                    WHERE r.RoleId = ?`, roleId);
            connection.release();
            return rows;
        });
    }

    async createUser(user){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
        
            //add user
            const queryUser = 'INSERT INTO user (Email, Password, FullName, PhoneNumber) VALUES (?, ?, ?, ?);';
            const {Email, Password, FullName, PhoneNumber} = user;
            const valueUser = [Email, Password, FullName, PhoneNumber];
            const resultUser = await connection.query(queryUser, valueUser);

            //add role
            const queryUserRole = 'INSERT INTO user_role (UserId, RoleId) VALUES (?, ?);';
            const userId = resultUser[0].insertId;
            const roleId = await rbacModel.getRoleIdByRoleName(Role.USER);
            const valueUserRole = [userId, roleId];
            await connection.query(queryUserRole, valueUserRole);

            connection.release();
            return userId;
        });
    }

    async updateUser(userId, userInfo){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            
            const query = 'UPDATE user SET FullName = ?, PhoneNumber = ? WHERE UserId = ?';
            const value = [userInfo.FullName, userInfo.PhoneNumber, userId];
            const results = await connection.query(query, value);

            connection.release();
            return results[0].affectedRows;
        });
    }

    async deleteUser(userId) {
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const result = await connection.query('DELETE FROM user WHERE UserId = ?', userId);
            connection.release();
            return result[0].affectedRows;
        });
    }

    async setPasswordResetToken(resetToken, resetExpiration, email){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            
            const query = `UPDATE user SET PasswordResetToken = ?, PasswordResetExpiration = ? WHERE Email = ?`;
            const value = [resetToken, resetExpiration, email];
            const results = await connection.query(query, value);
            
            connection.release();
            return results[0].affectedRows;
        });
    }

    async checkTokenPassword(email, resetToken){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = `SELECT * FROM user WHERE Email = ? AND PasswordResetToken = ? AND PasswordResetExpiration >= ?`;
            const value = [email, resetToken, new Date(Date.now())];
            const [rows] = await connection.query(query, value);
            connection.release();
            return rows[0];
        });
    }

    async resetPassword(newPassword, lastResetDate, email){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = `UPDATE user SET Password = ?, PasswordResetToken = NULL, PasswordResetExpiration = NULL, PasswordLastResetDate = ? WHERE Email = ?`;
            const value = [newPassword, lastResetDate, email];
            const results = await connection.query(query, value);
            connection.release();
            return results[0].affectedRows;
        });
    }
}

export default new UserModel()
