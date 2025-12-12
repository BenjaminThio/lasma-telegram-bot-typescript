import { Context, InlineKeyboard } from 'grammy';
import { bot } from '../bot';
import { exists, indexOf, isEqual } from '../utils/index';

type Vector2 = [number, number];

const HEIGHT: number = 5;
const WIDTH: number = 7;
const BOX_QUANTITY: number = 3;
const BARRIER_QUANTITY: number = 3;
const BACKGROUND: string = '⬜️';
const BARRIER: string = '🟨';
const BOX: string = '📦';
const DESTINATION: string = '❎';
const PLAYER: string = '🥺';

let player: number[] = [];
let barriers: Vector2[] = [];
let boxes: Vector2[] = [];
let destinations: Vector2[] = [];

const KEYBOARD: InlineKeyboard = new InlineKeyboard()
    .text('⬆️', 'sokoban 0')
    .row()
    .text('⬅️', 'sokoban 1')
    .text('🔄', 'sokoban reshuffle')
    .text('➡️', 'sokoban 3')
    .row()
    .text('⬇️', 'sokoban 2');

function Reshuffle() {
    const coordinates: Vector2[] = [];

    barriers = [];
    boxes = [];
    destinations = [];
    player = [];

    for (let y: number = 0; y < HEIGHT; y++) {
        for (let x: number = 0; x < WIDTH; x++) {
            coordinates.push([x, y]);
        }
    }

    for (let _i: number = 0; _i < BARRIER_QUANTITY; _i++) {
        const randomIndex = Math.floor(Math.random() * coordinates.length);

        barriers.push(coordinates[randomIndex]);
        coordinates.splice(randomIndex, 1);
    }

    for (let _i: number = 0; _i < BOX_QUANTITY; _i++) {
        const randomBoxIndex: number = Math.floor(Math.random() * coordinates.length);

        boxes.push(coordinates[randomBoxIndex]);
        coordinates.splice(randomBoxIndex, 1);

        const randomDestinationIndex: number = Math.floor(Math.random() * coordinates.length);

        destinations.push(coordinates[randomDestinationIndex]);
        coordinates.splice(randomDestinationIndex, 1);
    }

    player = coordinates[Math.floor(Math.random() * coordinates.length)];

    console.log(barriers, boxes, destinations, player);
}

function RenderMap(): string {
    let renderer: string = '';

    renderer += `${BARRIER.repeat(WIDTH + 2)}\n${BARRIER}`;
    for (let y: number = 0; y < HEIGHT; y++) {
        for (let x: number = 0; x < WIDTH; x++) {
            if (isEqual(player, [x, y])) {
                renderer += PLAYER;
            } else if (exists(barriers, [x, y]) || exists(boxes, [x, y]) && exists(destinations, [x, y])) {
                renderer += BARRIER;
            } else if (exists(boxes, [x, y])) {
                renderer += BOX;
            } else if (exists(destinations, [x, y])) {
                renderer += DESTINATION;
            }
            else {
                renderer += BACKGROUND;
            }
        }
        renderer += `${BARRIER}\n${BARRIER}`;
    }
    renderer += BARRIER.repeat(WIDTH + 1);

    return renderer;
}

export async function Sokoban(ctx: Context): Promise<void> {
    Reshuffle();
    await ctx.reply(RenderMap(), { reply_markup: KEYBOARD });
}

enum DIRECTION {
    UP,
    LEFT,
    DOWN,
    RIGHT
}

export function SokobanCallback(): void {
    bot.callbackQuery(/sokoban ([0-3])/, (ctx) => {
        const direction: DIRECTION = parseInt(ctx.match[1]);

        switch (direction) {
            case DIRECTION.UP:
                MovePlayer(ctx, 0, -1);
                break;
            case DIRECTION.LEFT:
                MovePlayer(ctx, -1, 0);
                break;
            case DIRECTION.DOWN:
                MovePlayer(ctx, 0, 1);
                break;
            case DIRECTION.RIGHT:
                MovePlayer(ctx, 1, 0);
                break;
        }
    });
    bot.callbackQuery('sokoban reshuffle', async (ctx) => {
        Reshuffle();
        await ctx.editMessageText(RenderMap(), { reply_markup: KEYBOARD });
    });
}

function MovePlayer(ctx: Context, x: number, y: number): void {
    let xCoord: number = player[0];
    let yCoord: number = player[1];

    if (xCoord + x >= 0 && xCoord + x < WIDTH) {
        xCoord += x;
    } else if (xCoord + x >= 0) {
        xCoord = 0;
    } else {
        xCoord = WIDTH - 1;
    }

    if (yCoord + y >= 0 && yCoord + y < HEIGHT) {
        yCoord += y;
    } else if (yCoord + y >= 0) {
        yCoord = 0;
    } else {
        yCoord = HEIGHT - 1;
    }

    if (exists(barriers.concat(destinations), [xCoord, yCoord])) {
        return;
    } else if (exists(boxes, [xCoord, yCoord])) {
        const boxIndex: number = indexOf(boxes, [xCoord, yCoord]);
        const newPosition: Vector2 | undefined = MoveBox(boxIndex, x, y);

        if (newPosition === undefined) {
            return;
        } else {
            boxes[boxIndex] = newPosition;
        }
    }

    player = [xCoord, yCoord];
    ctx.editMessageText(RenderMap(), { reply_markup: KEYBOARD });
}

function MoveBox(boxIndex: number, x: number, y: number): Vector2 | undefined {
    let xCoord: number = boxes[boxIndex][0];
    let yCoord: number = boxes[boxIndex][1];

    if (xCoord + x >= 0 && xCoord + x < WIDTH) {
        xCoord += x;
    } else if (xCoord + x >= 0) {
        xCoord = 0;
    } else {
        xCoord = WIDTH - 1;
    }

    if (yCoord + y >= 0 && yCoord + y < HEIGHT) {
        yCoord += y;
    } else if (yCoord + y >= 0) {
        yCoord = 0;
    } else {
        yCoord = HEIGHT - 1;
    }

    if (exists(barriers, [xCoord, yCoord])) {
        return;
    } else {
        return [xCoord, yCoord];
    }
}