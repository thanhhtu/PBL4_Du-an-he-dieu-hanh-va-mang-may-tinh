import userModel from '../../models/user.model'
import hashService from '../../service/hash.service'
import CustomError from '../../service/customError.service'
import { StatusCodes } from 'http-status-codes'
import userIdentityService from '../../service/authentication.service'
import { errorHandlerFunc, errorInfo } from '../../service/handleError.service'
import rbacModel from '../../models/rbac.model'

class AuthService {
    async register(user) {
        return errorHandlerFunc(async () => {
            const newUser = await userModel.getUserByEmail(user.Email)
            if (newUser) {
                throw new CustomError(
                    StatusCodes.CONFLICT,
                    'Email already exists'
                )
            }

            const hashObj = await hashService.hashPassword(user.Password)
            user.Password = hashObj.hashedPassword

            const result = await userModel.createUser(user)

            //set token
            const token = await userIdentityService.encodeToken(result)
            return token
        })
    }

    async login(loginInfo) {
        return errorHandlerFunc(async () => {
            const user = await userModel.getUserByEmail(loginInfo.Email)
            if (!user) {
                throw new CustomError(StatusCodes.NOT_FOUND, 'Email not found')
            }
            const check = await hashService.checkPassword(
                loginInfo.Password,
                user.Password
            )
            if (!check) {
                throw new CustomError(
                    StatusCodes.UNAUTHORIZED,
                    'Wrong password'
                ) //401
            }

            const userId = user.UserId
            const token = await userIdentityService.encodeToken(userId)
            const name = user.FullName
            const roles = await rbacModel.getRoleNameByUserId(userId)

            return { token, name, roles }
        })
    }

    //SQL INJECTION
    async loginError(loginInfo) {
        return errorHandlerFunc(async () => {
            const password = (
                await hashService.hashPassword(loginInfo.Password)
            ).hashedPassword
            const user = await userModel.getUserError(loginInfo.Email, password)
            const userId = user.UserId
            const token = await userIdentityService.encodeToken(userId)
            const name = user.FullName
            const roles = await rbacModel.getRoleNameByUserId(userId)

            return { token, name, roles }
        })
    }
    //SQL INJECTION
}

export default new AuthService()
