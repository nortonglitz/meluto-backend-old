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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.createSession = void 0;
var mongoose_1 = require("mongoose");
var devideDetector_1 = require("utils/devideDetector");
var jwt_1 = require("utils/jwt");
var models_1 = require("models");
var cookie_1 = require("config/cookie");
var createSession = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userAgent, user, accessToken, _a, device, client, os, sessionId, refreshToken, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                userId = req.params.userId;
                userAgent = req.headers['user-agent'];
                user = req.user;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 5, , 6]);
                if (!userId || !(0, mongoose_1.isValidObjectId)(userId)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'InvalidIdError',
                            message: 'can not use this id'
                        })];
                }
                /* if (user.id !== req.params.userId) {
                  return res.status(401).json({
                    error: 'AuthenticationError',
                    message: 'can not create session'
                  })
                } */
                if (!userAgent) {
                    return [2 /*return*/, res.status(401).json({
                            error: 'InvalidDeviceError',
                            message: 'can not recognize device'
                        })];
                }
                return [4 /*yield*/, (0, jwt_1.issueJwt)(userId, 'accessToken')];
            case 2:
                accessToken = _b.sent();
                return [4 /*yield*/, (0, devideDetector_1.parseUserAgent)(userAgent)];
            case 3:
                _a = _b.sent(), device = _a.device, client = _a.client, os = _a.os;
                sessionId = new mongoose_1.Types.ObjectId();
                return [4 /*yield*/, (0, jwt_1.issueJwt)(sessionId.toString(), 'refreshToken')];
            case 4:
                refreshToken = _b.sent();
                models_1.Session.create({
                    _id: sessionId,
                    userId: userId,
                    userAgent: userAgent,
                    refreshTokens: [{
                            refreshToken: refreshToken
                        }],
                    from: { device: device, client: client, os: os }
                });
                return [2 /*return*/, res
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
                    })];
            case 5:
                err_1 = _b.sent();
                next(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.createSession = createSession;
