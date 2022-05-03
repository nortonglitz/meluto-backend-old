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
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = __importDefault(require("./logger"));
const NODE_ENV = process.env.NODE_ENV;
const MONGO_URI = process.env.MONGO_URI;
const MONGO_URI_DEV = process.env.MONGO_URI_DEV;
const startDatabaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!MONGO_URI) {
            const e = new Error('Connection to database is impaired, no production URI available. Please edit .env file.');
            e.name = 'InvalidDatabaseURI';
            throw e;
        }
        if (!MONGO_URI_DEV) {
            const e = new Error('Connection to database is impaired, no development URI available. Please edit .env file.');
            e.name = 'InvalidDatabaseURI';
            throw e;
        }
        yield mongoose_1.default.connect(NODE_ENV === 'production' ? MONGO_URI : MONGO_URI_DEV);
        mongoose_1.default.connection.on('error', err => {
            throw err;
        });
    }
    catch (err) {
        logger_1.default.error({
            message: err.message,
            label: err.name,
            stack: err.stack
        });
    }
});
startDatabaseConnection();
