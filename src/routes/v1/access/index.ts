import { Router } from "express"
import { authentication } from "~/auth/auth.utils"
import accessController from "~/controllers/access.controller"
import { asyncHandler } from "~/middleware/error.middleware"
import { loginValidation, signUpValidation } from "~/validations/access.validation"

const accessRouter = Router()

/**
 * @openapi
 * '/v1/api/auth/signup':
 *  post:
 *     tags:
 *     - User
 *     summary: Register
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
accessRouter.post("/signup", signUpValidation, asyncHandler(accessController.signUp))

/**
 * @openapi
 * '/v1/api/auth/login':
 *  post:
 *     tags:
 *     - User
 *     summary: User login to my app
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
accessRouter.post("/login", loginValidation, asyncHandler(accessController.login))

// z: Authentication Middleware
accessRouter.use(authentication)

/**
 * @openapi
 * '/v1/api/auth/logout':
 *  post:
 *     tags:
 *     - User
 *     summary: User logout to my app
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
accessRouter.post("/logout", asyncHandler(accessController.logout))

/**
 * @openapi
 * '/v1/api/auth/renew-token':
 *  post:
 *     tags:
 *     - User
 *     summary: get new token based on refresh token
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
accessRouter.post("/renew-token", asyncHandler(accessController.renewToken))

export default accessRouter
