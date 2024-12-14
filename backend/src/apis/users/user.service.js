import { StatusCodes } from 'http-status-codes';
import userModel from '../../models/user.model';
import CustomError from '../../service/customError.service';
import { errorHandlerFunc } from '../../service/handleError.service';

class UserService {
    async userInfo(user) {
        let userInfo = {
            Id: Number(user.UserId),
            FullName: user.FullName,
            Email: user.Email,
            PhoneNumber: user.PhoneNumber,
            CreatedAt: user.CreatedAt,
        };
        return userInfo;
    }

    async getUserById(userId) {
        return errorHandlerFunc(async () => {
            const user = await userModel.getUserById(userId);
            let userInfo = await this.userInfo(user);
            return userInfo;
        })
    }

    async updateUser(userId, userInfo) {
        return errorHandlerFunc(async () => {
            const result = await userModel.updateUser(userId, userInfo);
            return result;
        })
    }

    async getAllUsersByRoleUser() {
        return errorHandlerFunc(async () => {
            const users = await userModel.getAllUsersByRoleUser();
            let allUserInfo = [];
            for (let user of users) {
                let userInfo = await this.userInfo(user);
                allUserInfo.push(userInfo);
            }
            return allUserInfo;
        })
    }

    async deleteUser(userId) {
        return errorHandlerFunc(async () => {
            const user = await userModel.getUserById(userId);
            if(!user){
                throw new CustomError(StatusCodes.NOT_FOUND, 'User not found');
            }
            const result = await userModel.deleteUser(userId);
            if(result == 0){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'No user deleted');
            }

            return result;
        })
    }
}

export default new UserService()
