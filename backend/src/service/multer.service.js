import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.config';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'ECommerce',
    },
});

const uploadStorage = multer({ storage: storage });

export default uploadStorage;