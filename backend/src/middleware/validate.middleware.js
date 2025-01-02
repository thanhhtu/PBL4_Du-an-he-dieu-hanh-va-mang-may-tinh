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

    shippingId = this.checkParams(
        Joi.object({
            shippingId: Joi.number().integer().optional(),
        })
    );

    orderId = this.checkParams(
        Joi.object({
            orderId: Joi.number().integer().optional(),
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

    //shipping information
    async checkShipping(req, res, next) {
        try {
            const validateInput = Joi.object({
                Name: Joi.string().trim().required(),

                PhoneNumber: Joi.string()
                                .pattern(new RegExp(/^(0|\+84)([0-9]{9,10})$/)) 
                                .required(),

                Address: Joi.string().trim().required(),
            });

            await validateInput.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            return handlerErrorRes(error, res);
        }
    }

    //order
    async checkOrder(req, res, next) {
        try {
            const uniqueProductIds = (value, helpers) => {
                const productIds = value.map(item => item.ProductId);
                const uniqueProductIds = new Set(productIds);
            
                if (productIds.length !== uniqueProductIds.size) {
                    return helpers.message('ProductId must be unique');
                }
            
                return value;
            };

            const validateOrderProduct = Joi.object({
                ProductId: Joi.number()
                    .integer()
                    .positive()
                    .required(),
                
                Quantity: Joi.number()
                    .integer()
                    .min(1)
                    .required(),

                PriceAtOrder: Joi.number()
                    .precision(2)
                    .positive()
                    .min(0.01)
                    .required(),
            });

            const validateInput = Joi.object({
                ShippingId: Joi.number().integer().required(),

                PaymentMethod: Joi.string()
                                    .trim()
                                    .valid('E-Wallet', 'Cash on Delivery')
                                    .required(),   

                OrderProducts: Joi.array()
                            .items(validateOrderProduct)
                            .min(1)
                            .required()
                            .custom(uniqueProductIds, 'Unique ProductIds validation')
            });

            await validateInput.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            return handlerErrorRes(error, res);
        }
    }
}

export default new ValidateMiddleware();
