import sanitizeHtml from 'sanitize-html';
import CustomError from './customError.service';
import { StatusCodes } from 'http-status-codes';

class SanitizeService {
    async purifyString(str) {
        const purifyStr = sanitizeHtml(str, {
            allowedTags: [],
            allowedAttributes: {}
        });

        if (!purifyStr.trim() || purifyStr.length > 500) {
            throw new CustomError(StatusCodes.BAD_REQUEST, 'Invalid input');
        }

        return purifyStr;
    }
}

export default new SanitizeService()
