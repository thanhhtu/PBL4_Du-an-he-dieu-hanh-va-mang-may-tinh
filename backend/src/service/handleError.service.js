import { StatusCodes } from "http-status-codes";
import CustomError from "./customError.service";

let handlerErrorRes = (error, res) => {
    if(error instanceof CustomError){
        return res.status(error.status).json({
            success: false,
            error: error.message,
        });
    }else{
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: error.message,
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

export { handlerErrorRes, errorInfo };