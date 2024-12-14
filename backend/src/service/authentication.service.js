import jwt from 'jsonwebtoken';
import 'dotenv/config';

class IdentityService {
    async encodeToken(id) {
        return jwt.sign(
            { 
                id: id
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

export default new IdentityService()
