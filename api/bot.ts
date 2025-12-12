
import { Context } from 'grammy';
import { Snake, SnakeCallback } from '@src/commands/snake';
import { TicTacToe, TicTacToeCallback } from '@src/commands/tic_tac_toe';
import { Temperature, Weather } from '@src/commands/weather';
import { ChessCallback, PlayChess } from '@src/commands/chess';
import { Sokoban, SokobanCallback } from '@src/commands/sokoban';
import { Dict } from '@src/commands/dictionary';
import { test, Time } from '@src/commands/datetime';
import { Calculator, CalculatorCallback } from '@src/commands/calculator';
import { webhookCallback, GrammyError, HttpError } from 'grammy'
import { VercelRequest, VercelResponse } from "@vercel/node"
import { bot } from '@src/bot';

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


export default async (req: VercelRequest, res: VercelResponse) => {
    console.log("Incoming Webhook Request.");

    try {
        return webhookCallback(bot, "http")(req, res);
    } catch (e) {
        console.error("Webhook processing error: ", e);
        return res.status(500).send("Error");
    }
}