import {StatusCodes} from 'http-status-codes';
import Joi from 'joi';
import { handlerErrorRes } from '../service/handleError.service';
import CustomError from '../service/customError.service';

class ValidateMiddleware {
    async checkRegister(req, res, next) {
        try {
            const validateInput = Joi.object({
                Email: Joi.string()
                        .email({ minDomainSegments: 2 })
                        .trim()
                        .required(),
                
                Password: Joi.string()
                            .trim()
                            .required(),
                
                ConfirmPassword: Joi.ref('Password'),
                
                FullName: Joi.string()
                            .pattern(new RegExp(/^[A-Za-zÀ-ÿ\s]+$/))
                            .trim()
                            .required(),

                PhoneNumber: Joi.string()
                                .pattern(new RegExp(/^\+?[0-9]{10,15}$/))
                                .required()
                               
            })
            .with('Password', 'ConfirmPassword');

            await validateInput.validateAsync(req.body, { abortEarly: false });
            
            next();
        } catch (error) {
            if(error.isJoi){
                const customError = new CustomError(StatusCodes.BAD_REQUEST, error.message);
                return handlerErrorRes(customError, res);
            }else{
                return handlerErrorRes(error, res);
            }
        }
    }

    async checkLogin(req, res, next) {
        try {
            const validateInput = Joi.object({
                Email: Joi.string()
                        .email({ minDomainSegments: 2 })
                        .trim()
                        .required(),
                
                Password: Joi.string()
                            .trim()
                            .required(),                
            });

            await validateInput.validateAsync(req.body, { abortEarly: false });
            
            next();
        } catch (error) {
            if(error.isJoi){
                const customError = new CustomError(StatusCodes.BAD_REQUEST, error.message);
                return handlerErrorRes(customError, res);
            }else{
                handlerErrorRes(error, res);
            }
        }
    }

    //again
    async checkUrl(req, res, next){
        res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            error: 'Invalid URL',
        })
    }
}

export default new ValidateMiddleware()