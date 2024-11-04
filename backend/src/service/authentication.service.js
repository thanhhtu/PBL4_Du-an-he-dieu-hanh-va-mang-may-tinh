import jwt from 'jsonwebtoken';
import 'dotenv/config';

class UserIdentityService {
    async encodeToken(userId) {
        return jwt.sign(
            { 
                id: userId
            }, 
            process.env.JWT_SECRET, 
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
                algorithm: 'HS256',
            }
        )
    }

    async decodeToken(token){
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

export default new UserIdentityService()
