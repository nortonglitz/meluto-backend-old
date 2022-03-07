"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var refreshTokenSchema = new mongoose_1.Schema({
    refreshToken: { type: String, required: true, unique: true },
    used: { type: Boolean, "default": false }
}, { _id: false, timestamps: { updatedAt: false } });
var clientSchema = new mongoose_1.Schema({
    type: String,
    name: String,
    version: String,
    engine: String,
    engineVersion: String
}, { _id: false });
var osSchema = new mongoose_1.Schema({
    name: String,
    version: String,
    platform: String
}, { _id: false });
var deviceSchema = new mongoose_1.Schema({
    type: String,
    brand: String,
    model: String
}, { _id: false });
var fromSchema = new mongoose_1.Schema({
    client: { type: clientSchema },
    os: { type: osSchema },
    device: { type: deviceSchema }
}, { _id: false });
var sessionSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Types.ObjectId, required: true },
    userId: { type: String, required: true },
    userAgent: { type: String, required: true },
    blocked: { type: Boolean, "default": false },
    refreshTokens: { type: [refreshTokenSchema] },
    loginTimes: { type: Number, "default": 1 },
    from: { type: fromSchema },
    createdAt: { type: Date, expires: 7776000 },
    updatedAt: { type: Date }
}, { _id: false });
// expires after 90 days
sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
exports["default"] = (0, mongoose_1.model)('Session', sessionSchema);
