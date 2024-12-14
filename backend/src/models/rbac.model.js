import pool from '../config/db.config';
import CustomError from '../service/customError.service';
import { errorHandlerFunc } from '../service/handleError.service';

class RbacModel {
    async getRoleIdByRoleName(roleName){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query('SELECT * FROM role WHERE RoleName = ?', roleName);
            if(!rows[0]){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Role not found');
            }
            connection.release();
            return rows[0].RoleId;
        });
    }

    async getRoleNameByUserId(userId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query(`SELECT *
                                                    FROM user_role ur
                                                    JOIN role r ON ur.RoleId = r.RoleId
                                                    WHERE ur.UserId = ? `, userId);

            const result = rows.map((role) => role.RoleName)
            connection.release();
            return result;
        });
    }

    async getPermissionsByUserId(userId){
        return errorHandlerFunc(async () => {
            const connection = await pool.getConnection();
            const [rows] = await connection.query(`SELECT * 
                                                    FROM user u
                                                    JOIN user_role ur ON u.UserId = ur.UserId
                                                    JOIN role r ON ur.RoleId = r.RoleId
                                                    JOIN role_permission rp ON r.RoleId = rp.RoleId
                                                    JOIN permission p ON rp.PermissionId = p.PermissionId
                                                    WHERE u.UserId = ?`, userId);

            const result = rows.map((permission) => permission.PermissionName)
            connection.release();
            return result;
        });
    }
}

export default new RbacModel()