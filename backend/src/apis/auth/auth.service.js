import userModel from '../../models/user.model';
import hashService from '../../service/hash.service';
import CustomError from '../../service/customError.service';
import { StatusCodes } from 'http-status-codes';
import userIdentityService from '../../service/authentication.service';
import { errorHandlerFunc } from '../../service/handleError.service';
import rbacModel from '../../models/rbac.model';
import mailService from '../../service/mail.service';

class AuthService {
    async register(newUserInfo) {
        return errorHandlerFunc(async () => {
            const user = await userModel.getUserByEmail(newUserInfo.Email);
            if (user) {
                throw new CustomError(StatusCodes.CONFLICT, 'Email already exists');
            }

            const hashObj = await hashService.hashPassword(newUserInfo.Password);
            newUserInfo.Password = hashObj.hashedPassword;

            const userId = await userModel.createUser(newUserInfo);
            const token = await userIdentityService.encodeToken(userId);
            const newUser = await userModel.getUserById(userId);
            const name = newUser.FullName;

            return { token, name };
        });
    }

    async login(loginInfo) {
        return errorHandlerFunc(async () => {
            const user = await userModel.getUserByEmail(loginInfo.Email);
            if (!user) {
                throw new CustomError(StatusCodes.NOT_FOUND, 'Email not found');
            }
            const check = await hashService.checkPassword(loginInfo.Password, user.Password);
            if (!check) {
                throw new CustomError(StatusCodes.UNAUTHORIZED, 'Wrong password'); //401
            }

            const userId = user.UserId;
            const token = await userIdentityService.encodeToken(userId);
            const name = user.FullName;
            const roles = await rbacModel.getRoleNameByUserId(userId);

            return { token, name, roles };
        });
    }

    //SQL INJECTION
    async loginError(loginInfo) {
        return errorHandlerFunc(async () => {
            const password = (await hashService.hashPassword(loginInfo.Password)).hashedPassword;
            const user = await userModel.getUserError(loginInfo.Email, password);
            const userId = user.UserId;
            const token = await userIdentityService.encodeToken(userId);
            const name = user.FullName;
            const roles = await rbacModel.getRoleNameByUserId(userId);

            return { token, name, roles };
        });
    }
    //SQL INJECTION

    async forgetPassword(email) {
        return errorHandlerFunc(async () => {
            const user = await userModel.getUserByEmail(email);
            if(!user){
                throw new CustomError(StatusCodes.NOT_FOUND, 'User not found');
            }

            const { resetToken, resetExpiration } = await hashService.setPasswordResetToken();
            const result = await userModel.setPasswordResetToken(resetToken, resetExpiration, email);

            if(!result){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'Unable to send the password reset email');
            }
            
            mailService.sendEmail({
                emailFrom: 'thanhthanhvava2004@gmail.com',
                emailTo: email,
                emailSubject: 'TTSHOP RESET PASSWORD',
                token: resetToken,
                user: user.FullName,
                productName: 'TTShop',
                productEmail: 'ttshop-support.example.com'
            });
            return true;
        })
    }

    async resetPassword(email, resetToken, newPassword) {
        return errorHandlerFunc(async () => {
            const user = await userModel.checkTokenPassword(email, resetToken);
            if(!user){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'Invalid token');
            }

            const hashObj = await hashService.hashPassword(newPassword);
            const result = await userModel.resetPassword(hashObj.hashedPassword, new Date(), email);

            if(!result){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'Reset password fail');
            }

            return true;
        });
    }
}

export default new AuthService();
