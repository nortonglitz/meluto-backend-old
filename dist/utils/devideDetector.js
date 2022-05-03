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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUserAgent = void 0;
const device_detector_js_1 = __importDefault(require("device-detector-js"));
const deviceDetector = new device_detector_js_1.default();
const parseUserAgent = (userAgent) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const device = deviceDetector.parse(userAgent);
        const { bot } = device;
        if (!device) {
            const e = new Error('fail to parse user agent');
            e.name = 'UserAgentParseError';
            reject(e);
        }
        if (bot) {
            const e = new Error('Bot detected');
            e.name = 'BotError';
            reject(e);
        }
        resolve(device);
    });
});
exports.parseUserAgent = parseUserAgent;
