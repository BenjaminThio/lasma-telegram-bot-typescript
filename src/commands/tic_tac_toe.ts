import { Context, InlineKeyboard } from 'grammy';
import { bot } from '../bot';

const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
const board = ['#', '#', '#', '#', '#', '#', '#', '#', '#'];
const X: string = '❌';
const O: string = '⭕️';
const ROW: number = 3;
let player: boolean = false;

export async function TicTacToe(ctx: Context): Promise<void> {
	await ctx.reply(RenderPlayer(), { reply_markup: RenderKeyboard() });
}

function RenderKeyboard(): InlineKeyboard {
	const keyboard: InlineKeyboard = new InlineKeyboard();

	for (let j: number = 0; j < board.length / ROW; j++) {
		for (let i: number = 0; i < ROW; i++) {
			if (board[i] === '#') {
				keyboard.text(numbers[i], i.toString())
			} else {
				keyboard.text(board[i], i.toString())
			}
		}

		keyboard.row();
	}

	return keyboard;
}

function RenderPlayer(): string {
	return `Player ${player ? 2 : 1}`;
}

function GameOver(ctx: Context): void {
	ctx.editMessageText(`Game Over! ${RenderPlayer()} wins.`);
}

function GameCheck(ctx: Context): void {
	const symbol: string = player ? O : X;

	if (
		(board[0] === symbol && board[1] === symbol && board[2] === symbol) ||
		(board[3] === symbol && board[4] === symbol && board[5] === symbol) ||
		(board[6] === symbol && board[7] === symbol && board[8] === symbol) ||
		(board[0] === symbol && board[3] === symbol && board[6] === symbol) ||
		(board[1] === symbol && board[4] === symbol && board[7] === symbol) ||
		(board[2] === symbol && board[5] === symbol && board[8] === symbol) ||
		(board[0] === symbol && board[4] === symbol && board[8] === symbol) ||
		(board[2] === symbol && board[4] === symbol && board[6] === symbol)
	) {
		GameOver(ctx);
	} else if (!board.includes('#')) {
		ctx.editMessageText(`Game Over! Draw.`, { reply_markup: RenderKeyboard() });
	}
}

export function TicTacToeCallback(): void {
	for (let i: number = 0; i < board.length; i++) {
		bot.callbackQuery(i.toString(), async (ctx) => {
			board[i] = player ? O : X;
			await ctx.editMessageText(RenderPlayer(), { reply_markup: RenderKeyboard() });

			GameCheck(ctx);
			player = !player;
		});
	}
}
