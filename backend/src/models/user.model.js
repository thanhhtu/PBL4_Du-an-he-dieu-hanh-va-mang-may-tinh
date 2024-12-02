import pool from '../config/db.config';
import { errorHandlerFunc } from '../service/handleError.service';
import rbacModel from './rbac.model';
import { Role } from '../types/rbac.object';

class UserModel {
    //sql injection
    async getDetailUserError(loginInfo){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const query = `SELECT * FROM user WHERE Email = '${loginInfo.Email}' AND Password = '${loginInfo.Password}';`;
            const [rows] = await connection.query(query);
            connection.release();
            return rows;
        });
    }
    //sql injection

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

    async getAllUsersRoleUser(){
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

    async deleteUser(userId) {
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();

            //delete role of user
            await connection.query('DELETE FROM user_role WHERE UserId = ?', userId);

            //delete user
            const result = await connection.query('DELETE FROM user WHERE UserId = ?', userId);

            connection.release();
            return result[0].affectedRows;
        });
    }
}

export default new UserModel()
