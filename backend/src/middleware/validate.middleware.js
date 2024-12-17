import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { handlerErrorRes } from '../service/handleError.service';

class ValidateMiddleware {
    //url
    async checkUrl(req, res, next) {
        res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            error: 'Invalid URL',
        });
    }

    //params
    checkParams(schema) {
        return async (req, res, next) => {
            try {
                await schema.validateAsync(req.params, { abortEarly: false });
                next();
            } catch (error) {
                handlerErrorRes(error, res);
            }
        };
    }

    userId = this.checkParams(
        Joi.object({
            userId: Joi.number().integer().optional()
        })
    );

    productId = this.checkParams(
        Joi.object({
            productId: Joi.number().integer().optional()
        })
    );

    reviewId = this.checkParams(
        Joi.object({
            reviewId: Joi.number().integer().optional(),
        })
    );

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
                                .pattern(new RegExp(/^(0|\+84)([0-9]{9,10})$/)) 
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
                        .email({ minDomainSegments: 2 }) //SQL INJECTION IF BE COMMENTED
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

    async checkForgetPassword(req, res, next) {
        try {
            const validateInput = Joi.object({
                Email: Joi.string()
                        .email({ minDomainSegments: 2 }) //SQL INJECTION IF BE COMMENTED
                        .trim()
                        .required(),
            });

            await validateInput.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            return handlerErrorRes(error, res);
        }
    }

    async checkResetPassword(req, res, next) {
        try {
            const validateInput = Joi.object({
                Email: Joi.string()
                        .email({ minDomainSegments: 2 }) //SQL INJECTION IF BE COMMENTED
                        .trim()
                        .required(),

                PasswordResetToken: Joi.string().trim().required(),
                NewPassword: Joi.string().trim().required(),
                ConfirmNewPassword: Joi.ref('NewPassword'),
            }).with('NewPassword', 'ConfirmNewPassword');

            await validateInput.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            return handlerErrorRes(error, res);
        }
    }

    //user
    async checkUserInfo(req, res, next) {
        try {
            const validateInput = Joi.object({
                FullName: Joi.string()
                            .pattern(new RegExp(/^[A-Za-zÀ-ÿ\s]+$/))
                            .trim()
                            .required(),

                PhoneNumber: Joi.string()
                                .pattern(new RegExp(/^\+?[0-9]{10,15}$/))
                                .required(),
            })

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

    //review
    async checkReviewInfo(req, res, next) {
        try {
            const validateInput = Joi.object({
                Rating: Joi.number()
                            .integer()
                            .positive()
                            .min(0)
                            .max(5)
                            .required(),

                Content: Joi.string()
                            .max(500)
                            .trim()
                            .required(),
            });

            await validateInput.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            return handlerErrorRes(error, res);
        }
    }

    //cart
    async checkProductCartQuantity(req, res, next) {
        try {
            const validateInput = Joi.object({
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
