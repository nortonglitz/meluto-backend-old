"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSession = void 0;
const mongoose_1 = require("mongoose");
const devideDetector_1 = require("utils/devideDetector");
const jwt_1 = require("utils/jwt");
const models_1 = require("models");
const cookie_1 = require("config/cookie");
const createSession = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const userAgent = req.headers['user-agent'];
    const user = req.user;
    try {
        if (!userId || !(0, mongoose_1.isValidObjectId)(userId)) {
            return res.status(400).json({
                error: 'InvalidIdError',
                message: 'can not use this id'
            });
        }
        /* if (user.id !== req.params.userId) {
          return res.status(401).json({
            error: 'AuthenticationError',
            message: 'can not create session'
          })
        } */
        if (!userAgent) {
            return res.status(401).json({
                error: 'InvalidDeviceError',
                message: 'can not recognize device'
            });
        }
        const accessToken = yield (0, jwt_1.issueJwt)(userId, 'accessToken');
        const { device, client, os } = yield (0, devideDetector_1.parseUserAgent)(userAgent);
        const sessionId = new mongoose_1.Types.ObjectId();
        const refreshToken = yield (0, jwt_1.issueJwt)(sessionId.toString(), 'refreshToken');
        models_1.Session.create({
            _id: sessionId,
            userId,
            userAgent,
            refreshTokens: [{
                    refreshToken
                }],
            from: { device, client, os }
        });
        return res
            .status(201)
            .cookie('at', accessToken, {
            sameSite: cookie_1.sessionCookie.sameSite,
            maxAge: cookie_1.sessionCookie.maxAge,
            httpOnly: cookie_1.sessionCookie.httpOnly
        })
            .cookie('rt', refreshToken, {
            sameSite: cookie_1.sessionCookie.sameSite,
            maxAge: cookie_1.sessionCookie.maxAge,
            httpOnly: cookie_1.sessionCookie.httpOnly
        })
            .json({
            message: 'session created'
        });
    }
    catch (err) {
        next(err);
    }
});
exports.createSession = createSession;
