import usersModel from '../../models/users.model'
import hashService from '../../service/hash.service'
import CustomError from '../../service/customError.service';
import { StatusCodes } from 'http-status-codes';
import userIdentityService from '../../service/authentication.service'
import { errorInfo } from '../../service/handleError.service';

class AuthService{
    async register(user){
        try {
            const newUser = await usersModel.getUserByEmail(user.Email);
            if(newUser){
                throw new CustomError(StatusCodes.CONFLICT, 'Email already exists'); //409
            }

            const hashObj = await hashService.hashPassword(user.Password);
            user.Password = hashObj.hashedPassword;

            const result = await usersModel.createUser(user);

            //set token
            const token = await userIdentityService.encodeToken(result);
            await usersModel.setAccessToken(token, user.Email)
            return token;
        }catch(error){
            const { statusError, messageError } = errorInfo(error);
            throw new CustomError(statusError, messageError);
        }
    }

    async login(loginInfo){
        try {
            const user = await usersModel.getUserByEmail(loginInfo.Email);
            if(user == null){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Email not found');
            }
            const check = await hashService.checkPassword(loginInfo.Password, user.Password);
            if(!check){
                throw new CustomError(StatusCodes.UNAUTHORIZED, 'Wrong password'); //401
            }

            const token = await userIdentityService.encodeToken(user.UserID);
            await usersModel.setAccessToken(token, loginInfo.Email)
            return token;
        }catch(error){
            const { statusError, messageError } = errorInfo(error);
            throw new CustomError(statusError, messageError);
        }
    }

    //sql injection
    async loginError(loginInfo){
        try {
            // loginInfo.Password = 
            const user = await usersModel.getUserError(loginInfo);

            // const token = await userIdentityService.encodeToken(user[0].UserID);
            // await usersModel.setAccessToken(token, loginInfo.Email)
            return user;
        }catch(error){
            const { statusError, messageError } = errorInfo(error);
            throw new CustomError(statusError, messageError);
        }
    }
    //sql injection
}

export default new AuthService()
