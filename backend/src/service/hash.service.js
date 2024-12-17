import bcrypt from 'bcryptjs';

class HashService {
    async hashPassword(plainText){
        const salt = await bcrypt.genSalt(10);

        /*
        //SQL INJECTION
        const salt = '$2b$10$1234567890123456789012';
        //SQL INJECTION
        */

        const hashedPassword = await bcrypt.hash(plainText, salt);
        return { salt, hashedPassword };
    }

    async checkPassword(plainText, hash){
        return await bcrypt.compare(plainText, hash);
    }

    async setPasswordResetToken(){
        const resetToken = await bcrypt.genSalt(10);
        const resetExpiration = new Date(Date.now() + 1 * 60 * 1000); //1 min from the time sending req
        return { resetToken, resetExpiration };
    }
}

export default new HashService();
