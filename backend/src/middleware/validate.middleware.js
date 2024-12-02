import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { handlerErrorRes } from '../service/handleError.service';

class ValidateMiddleware {
    async checkUrl(req, res, next) {
        res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            error: 'Invalid URL',
        });
    }

    async checkNumberParam(req, res, next) {
        try{
            const validateInput = Joi.object({
                id: Joi.number().integer().required(),
            });
            await validateInput.validateAsync(req.params, { abortEarly: false });
            next();
        } catch (error) {
            return handlerErrorRes(error, res);
        }
    }

    //auth
    async checkRegister(req, res, next) {
        try {
            const validateInput = Joi.object({
                Email: Joi.string()
                        .email({ minDomainSegments: 2 })
                        .trim()
                        .required(),

                Password: Joi.string().trim().required(),

                ConfirmPassword: Joi.ref('Password'),

                FullName: Joi.string()
                            .pattern(new RegExp(/^[A-Za-zÀ-ÿ\s]+$/))
                            .trim()
                            .required(),

                PhoneNumber: Joi.string()
                                .pattern(new RegExp(/^\+?[0-9]{10,15}$/))
                                .required(),
            }).with('Password', 'ConfirmPassword');

            await validateInput.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            return handlerErrorRes(error, res);
        }
    }

    async checkLogin(req, res, next) {
        try {
            const validateInput = Joi.object({
                Email: Joi.string()
                        .email({ minDomainSegments: 2 })
                        .trim()
                        .required(),

                Password: Joi.string().trim().required(),
            });

            await validateInput.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            return handlerErrorRes(error, res);
        }
    }

    //product
    async checkProductInfo(req, res, next) {
        try {
            const validateInput = Joi.object({
                ProductName: Joi.string().trim().required(),
                
                Description: Joi.string().trim().required(),

                Price: Joi.number()
                        .precision(2)
                        .positive()
                        .min(0.01)
                        .required(),

                Quantity: Joi.number()
                            .integer()
                            .positive()
                            .min(1)
                            .required(),
            });

            await validateInput.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            return handlerErrorRes(error, res);
        }
    }
}

export default new ValidateMiddleware();
