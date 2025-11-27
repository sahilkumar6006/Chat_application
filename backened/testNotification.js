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
const notificationService_1 = require("./src/services/notificationService");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const token = process.argv[2];
if (!token) {
    console.error('Please provide an FCM token as an argument.');
    console.error('Usage: npx ts-node testNotification.ts <FCM_TOKEN>');
    process.exit(1);
}
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Sending test notification to:', token);
    yield (0, notificationService_1.sendNotification)(token, {
        title: 'Test Notification',
        body: 'This is a test notification from the backend!',
        data: { type: 'test' },
    });
});
run();
