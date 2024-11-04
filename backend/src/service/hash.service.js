import bcrypt from 'bcryptjs';

class HashService {
    async hashPassword(plainText){
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainText, salt);
        return { salt, hashedPassword };
    }

    async checkPassword(plainText, hash){
        return await bcrypt.compare(plainText, hash);
    }
}

export default new HashService();
