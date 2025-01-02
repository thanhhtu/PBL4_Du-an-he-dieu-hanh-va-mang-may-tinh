import shippingModel from '../../models/shipping.model';
import { errorHandlerFunc } from '../../service/handleError.service';
import CustomError from '../../service/customError.service';
import { StatusCodes } from 'http-status-codes';

class ShippingService{
    async shippingInfo(shipping){
        let shippingInfo = {
            ShippingId: Number(shipping.ShippingId),
            Name: shipping.Name,
            PhoneNumber: shipping.PhoneNumber,
            Address: shipping.Address,
            IsDefault: shipping.IsDefault === 1
        };
        return shippingInfo;
    }

    async getDetailUserShipping(userId, shippingId){
        return errorHandlerFunc(async () => {
            const shipping = await shippingModel.getUserShippingById(userId, shippingId);
            if(!shipping){
                throw new CustomError(StatusCodes.NOT_FOUND, 'You are not authorized to access this shipping information');
            }
            const shippingInfo = await this.shippingInfo(shipping);
            return shippingInfo;
        });
    }

    async getAllUserShipping(userId){
        return errorHandlerFunc(async () => {
            const shippings = await shippingModel.getAllUserShipping(userId);
            let allShippingInfo = [];
            for(let shipping of shippings){
                const shippingInfo = await this.shippingInfo(shipping);
                allShippingInfo.push(shippingInfo);
            }
            return allShippingInfo;
        });
    }

    async getDefaultUserShipping(userId){
        return errorHandlerFunc(async () => {
            const shipping = await shippingModel.getDefaultUserShipping(userId);
            if(!shipping){
                throw new CustomError(StatusCodes.NOT_FOUND, 'Not found any shipping information');
            }
            const shippingInfo = await this.shippingInfo(shipping);
            return shippingInfo;
        });
    }

    async addShipping(userId, detailShipping){
        return errorHandlerFunc(async () => {
            const shippings = await shippingModel.getAllUserShipping(userId);
            let isDefault = false;
            if(!shippings.length){
                isDefault = true;
            }
            const result = await shippingModel.addShipping(userId, detailShipping, isDefault);
            return result;
        });
    }

    async updateShipping(userId, shippingId, detailShipping){
        return errorHandlerFunc(async () => {
            const shipping = await shippingModel.getUserShippingById(userId, shippingId);
            if(!shipping){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'You are not authorized to access this shipping information');
            }
            const result = await shippingModel.updateShipping(shippingId, detailShipping);
            return result;
        });
    }

    async deleteShipping(userId, shippingId){
        return errorHandlerFunc(async () => {
            const shippings = await shippingModel.getAllUserShipping(userId);
            if(shippings.length <= 1){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'This is the only shipping information available. Deletion is not allowed!');
            }

            const shipping = await shippingModel.getUserShippingById(userId, shippingId);
            if(!shipping){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'You are not authorized to access this shipping information');
            }

            //update new default shipping information
            if(shipping.IsDefault){
                const newDefaultShipping = shippings.find(item => item.ShippingId !== shippingId);
                await shippingModel.updateUserDefaultShipping(newDefaultShipping.ShippingId, true);
            }

            const result = await shippingModel.deleteShipping(shippingId);
            
            return result;
        });
    }

    async changDefaultShipping(userId, shippingId){
        return errorHandlerFunc(async () => {
            const shipping = await shippingModel.getUserShippingById(userId, shippingId);
            if(!shipping){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'You are not authorized to access this shipping information');
            }

            //check present shipping information is default or not
            const shippingInfo = await this.shippingInfo(shipping);
            if(shippingInfo.IsDefault){
                throw new CustomError(StatusCodes.BAD_REQUEST, 'This is already the default shipping information'); 
            }

            //if not, update new default shipping information
            const shippings = await shippingModel.getAllUserShipping(userId);
            const oldDefaultShipping = shippings.find(item => item.IsDefault === 1);
            if(oldDefaultShipping){
                await shippingModel.updateUserDefaultShipping(oldDefaultShipping.ShippingId, false);
            }
            await shippingModel.updateUserDefaultShipping(shippingId, true);
        });
    }
}

export default new ShippingService()
