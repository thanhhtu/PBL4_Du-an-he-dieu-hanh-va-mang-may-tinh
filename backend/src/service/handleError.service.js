import { StatusCodes } from "http-status-codes";
import CustomError from "./customError.service";
import Joi from "joi";

let handlerErrorRes = (error, res) => {
    if (error instanceof Joi.ValidationError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: error.message,
        });
    }else if(error instanceof CustomError){
        return res.status(error.status).json({
            success: false,
            message: error.message,
        });
    }else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message,
        });
    }
}

function errorInfo(error){
    let messageError;
    let statusError;

    if(error instanceof CustomError){
        statusError = error.status;
        messageError = error.message;
    }else{
        statusError = StatusCodes.INTERNAL_SERVER_ERROR;
        messageError = error.message;
    }

    return { statusError, messageError }
}

async function errorHandlerFunc(func) {
    try {
        return await func();
    } catch (error) {
        const { statusError, messageError } = errorInfo(error);
        throw new CustomError(statusError, messageError);
    }
}


export { handlerErrorRes, errorInfo, errorHandlerFunc };