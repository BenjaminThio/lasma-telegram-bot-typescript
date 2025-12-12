import { Context, InlineKeyboard } from 'grammy';
import { bot } from '@src/bot';
import { exists, isEqual } from '@src/utils/index';

enum DIRECTION {
	UP,
	LEFT,
	DOWN,
	RIGHT,
}
const MAX_HEIGHT: number = 5;
const MAX_WIDTH: number = 5;
const WALL: string = '⬛️';
const BACKGROUND: string = '⬜️';
const HEAD: string = '🤢';
const BODY: string = '🟢';
const FOOD: string = '🍎';
const KEYBOARD: InlineKeyboard = new InlineKeyboard()
.text('⬆️', 'up')
.row()
.text('⬅️', 'left')
.text('➡️', 'right')
.row()
.text('⬇️', 'down');

const snake_parts: number[][] = [];
let food_coord: number[] = [];

function RenderMap(): string {
	let renderer: string = '';

	renderer += `${WALL.repeat(MAX_WIDTH + 2)}\n${WALL}`;
	for (let y: number = 0; y < MAX_HEIGHT; y++) {
		for (let x: number = 0; x < MAX_WIDTH; x++) {
			if (isEqual(snake_parts[0], [x, y])) {
				renderer += HEAD;
			} else if (exists(snake_parts, [x, y])) {
				renderer += BODY;
			} else if (isEqual([x, y], food_coord)) {
				renderer += FOOD;
			} else {
				renderer += BACKGROUND;
			}
		}
		renderer += `${WALL}\n${WALL}`;
	}
	renderer += `${WALL.repeat(MAX_WIDTH + 1)}`;

	return renderer;
}

function GenerateSnake(): void {
	const random_x: number = Math.floor(Math.random() * MAX_WIDTH);
	const random_y: number = Math.floor(Math.random() * MAX_HEIGHT);
	const random_coord: number[] = [random_x, random_y];

	snake_parts.push(random_coord);
}

function GenerateFood(): void {
	const random_x: number = Math.floor(Math.random() * MAX_WIDTH);
	const random_y: number = Math.floor(Math.random() * MAX_HEIGHT);
	const random_coord: number[] = [random_x, random_y];

	if (!exists(snake_parts, random_coord)) {
		food_coord = random_coord;
	} else {
		GenerateFood();
	}
}

async function Move(ctx: Context, direction: DIRECTION): Promise<void> {
	switch (direction) {
		case DIRECTION.UP:
			if (snake_parts[0][1] - 1 >= 0)
				snake_parts.splice(0, 0, [
					snake_parts[0][0],
					snake_parts[0][1] - 1,
				]);
			else snake_parts.splice(0, 0, [snake_parts[0][0], MAX_HEIGHT - 1]);
			break;
		case DIRECTION.LEFT:
			if (snake_parts[0][0] - 1 >= 0)
				snake_parts.splice(0, 0, [
					snake_parts[0][0] - 1,
					snake_parts[0][1],
				]);
			else snake_parts.splice(0, 0, [MAX_WIDTH - 1, snake_parts[0][1]]);
			break;
		case DIRECTION.DOWN:
			if (snake_parts[0][1] + 1 < MAX_HEIGHT)
				snake_parts.splice(0, 0, [
					snake_parts[0][0],
					snake_parts[0][1] + 1,
				]);
			else snake_parts.splice(0, 0, [snake_parts[0][0], 0]);
			break;
		case DIRECTION.RIGHT:
			if (snake_parts[0][0] + 1 < MAX_WIDTH)
				snake_parts.splice(0, 0, [
					snake_parts[0][0] + 1,
					snake_parts[0][1],
				]);
			else snake_parts.splice(0, 0, [0, snake_parts[0][1]]);
			break;
	}

	if (isEqual(snake_parts[0], food_coord)) {
		GenerateFood();
	} else {
		snake_parts.pop();
	}

	await ctx.editMessageText(RenderMap(), { reply_markup: KEYBOARD });
}

export async function Snake(ctx: Context): Promise<void> {
	GenerateSnake();
	GenerateFood();
	await ctx.reply(RenderMap(), { reply_markup: KEYBOARD });
}

export function SnakeCallback(): void {
	bot.callbackQuery('up', async (ctx: Context) => {
		await Move(ctx, DIRECTION.UP);
	});

	bot.callbackQuery('left', async (ctx: Context) => {
		await Move(ctx, DIRECTION.LEFT);
	});

	bot.callbackQuery('down', async (ctx: Context) => {
		await Move(ctx, DIRECTION.DOWN);
	});

	bot.callbackQuery('right', async (ctx: Context) => {
		await Move(ctx, DIRECTION.RIGHT);
	});
}
