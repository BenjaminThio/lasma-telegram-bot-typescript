import { Bot } from 'grammy';

const token = process.env.BOT_TOKEN;

if (!token) throw new Error("TOKEN is unset");

export const bot = new Bot(token);