
/*
import { Context } from 'grammy';
import { Snake, SnakeCallback } from '@src/commands/snake.js';
import { TicTacToe, TicTacToeCallback } from '@src/commands/tic_tac_toe.js';
import { Temperature, Weather } from '@src/commands/weather.js';
import { ChessCallback, PlayChess } from '@src/commands/chess.js';
import { Sokoban, SokobanCallback } from '@src/commands/sokoban.js';
import { Dict } from '@src/commands/dictionary.js';
import { test, Time } from '@src/commands/datetime';
import { Calculator, CalculatorCallback } from '@src/commands/calculator.js';
*/

import { Bot } from 'grammy';
import { webhookCallback, GrammyError, HttpError } from 'grammy'
import { VercelRequest, VercelResponse } from "@vercel/node"
import { test, Time } from '@src/commands/datetime';
// import { bot } from '@src/bot.js';

const token = process.env.BOT_TOKEN;

if (!token) throw new Error("TOKEN is unset");

export const bot = new Bot(token);

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request: ", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram: ", e);
    } else {
        console.error("Unknown error: ", e);
    }
})

/*
bot.command('calc', (ctx) => {
	Calculator(ctx);
});
bot.command('date', (ctx) => {
	test(ctx);
});
bot.command('time', (ctx) => {
	Time(ctx);
});
bot.command('d', (ctx) => {
	Dict(ctx);
});
bot.command('sokoban', (ctx: Context) => {
	Sokoban(ctx);
});
bot.command('chess', (ctx: Context) => {
	PlayChess(ctx);
});
bot.command('snake', (ctx: Context) => {
	Snake(ctx);
});
bot.command('tic_tac_toe', (ctx: Context) => {
	TicTacToe(ctx);
});
bot.command('weather', (ctx: Context) => {
	Weather(ctx);
});
bot.command('temp', (ctx: Context) => {
	Temperature(ctx);
});
bot.command('test', async (ctx) => {
	await ctx.reply('Testing123');
});

SnakeCallback();
TicTacToeCallback();
ChessCallback();
SokobanCallback();
CalculatorCallback();
*/

bot.command('date', (ctx) => {
	test(ctx);
});

bot.command('time', (ctx) => {
	Time(ctx);
});

bot.command('test', async (ctx) => {
	await ctx.reply('Testing123');
});

export default async (req: VercelRequest, res: VercelResponse) => {
    console.log("Incoming Webhook Request.");

    try {
        return webhookCallback(bot, "http")(req, res);
    } catch (e) {
        console.error("Webhook processing error: ", e);
        return res.status(500).send("Error");
    }
}