import { Context, Bot } from 'grammy';
import { Snake, SnakeCallback } from './commands/snake';
import { TicTacToe, TicTacToeCallback } from './commands/tic_tac_toe';
import { Temperature, Weather } from './commands/weather';
import { ChessCallback, PlayChess } from './commands/chess';
import { Sokoban, SokobanCallback } from './commands/sokoban';
import { Dict } from './commands/dictionary';
import { test, Time } from './commands/datetime';
import { Calculator, CalculatorCallback } from './commands/calculator';

const token = process.env.BOT_TOKEN;

if (!token) throw new Error("TOKEN is unset");

export const bot = new Bot(token);

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
