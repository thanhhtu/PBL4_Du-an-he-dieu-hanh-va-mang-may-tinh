import { StatusCodes } from "http-status-codes";

const errorHandler = (err, req, res, next) => {
    const messageError = err.messageObject || err.message;

    const error = {
        status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
        error: messageError
    };
    const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  
    return res.status(status).json(error);
};
export default errorHandler;