import { Context, InlineKeyboard } from 'grammy';
import { bot } from '@src/bot';

type Vector2 = [number, number];
type AlgebraicNotation = `${string}${number}`;
type Color = 'white' | 'black';
type PieceName = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';
type Chess = {
    [color in Color]: Record<PieceName, string>
};

interface BasePiece {
    color: Color;
}

interface NonPawnPiece extends BasePiece {
    name: Exclude<PieceName, 'pawn'>;
}

interface Pawn extends BasePiece {
    name: 'pawn';
    movedOnce: boolean;
}

type Piece = Pawn | NonPawnPiece;

interface PieceMap {
    [algebraicNotation: AlgebraicNotation]: Piece;
}

const WIDTH: number = 8;
const HEIGHT: number = 8;
const WHITE: string = '⬜️';
const BLACK: string = '⬛️';
const GREEN: string = '🟩';
const CHESS: Chess = {
    white: {
        pawn: '♙',
        rook: '♖',
        knight: '♘',
        bishop: '♗',
        queen: '♕',
        king: '♔'
    },
    black: {
        pawn: '♟',
        rook: '♜',
        knight: '♞',
        bishop: '♝',
        queen: '♛',
        king: '♚'
    }
};

let pieces: PieceMap = {};
let validMoves: AlgebraicNotation[] = [];
let selected: '' | AlgebraicNotation = '';
const player: boolean = false;

function MovePawn(color: Color, position: AlgebraicNotation, movedOnce: boolean): AlgebraicNotation[] {
    const direction: number = color === 'black' ? -1 : 1;
    const possibleMoves: AlgebraicNotation[] = [];
    const coordinates: Vector2 = AlgebraicNotationToVector2(position);
    const x_coordinate: number = coordinates[0];
    const y_coordinate: number = coordinates[1];

    for (let move: number = 1; move <= (movedOnce ? 1 : 2); move++) {
        if (y_coordinate + (move * direction) >= 1 && y_coordinate + (move * direction) <= HEIGHT && !Object.keys(pieces).includes(Vector2ToAlgebraicNotation([x_coordinate, y_coordinate + (move * direction)]))) {
            possibleMoves.push(
                Vector2ToAlgebraicNotation([x_coordinate, y_coordinate + (move * direction)])
            );
        } else {
            break;
        }
    }

    if (x_coordinate - 1 >= 1 && y_coordinate + direction >= 1 && y_coordinate + direction <= HEIGHT && 
        Object.keys(pieces).includes(Vector2ToAlgebraicNotation([x_coordinate - 1, y_coordinate + direction]))
    ) {
        possibleMoves.push(
            Vector2ToAlgebraicNotation([x_coordinate - 1, y_coordinate + direction])
        );
    }
    if (x_coordinate + 1 >= 1 && y_coordinate + direction >= 1 && y_coordinate + direction <= HEIGHT && Object.keys(pieces).includes(Vector2ToAlgebraicNotation([x_coordinate + 1, y_coordinate + direction]))) {
        possibleMoves.push(Vector2ToAlgebraicNotation([x_coordinate + 1, y_coordinate + direction]));
    }
    return possibleMoves;
}

function MoveRook(position: AlgebraicNotation) {
    const coordinates: Vector2 = AlgebraicNotationToVector2(position);
    const x_coordinate: number = coordinates[0];
    const y_coordinate: number = coordinates[1];
    let counter: number = 1;

    while (coordinates[0] - counter >= 1) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - counter, y_coordinate]));
        counter++;
    }

    console.log(counter);
    counter = 0;

    while (coordinates[0] + counter <= WIDTH) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + counter, y_coordinate]));
        counter++;
    }

    console.log(counter);
    counter = 0;

    while (coordinates[1] - counter >= 1) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate, y_coordinate - counter]));
        counter++;
    }

    console.log(counter);
    counter = 0;

    while (coordinates[1] + counter <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate, y_coordinate + counter]));
        counter++;
    }

    console.log(counter);
    counter = 0;
}

function MoveKnight(position: AlgebraicNotation) {
    const coordinates: Vector2 = AlgebraicNotationToVector2(position);
    const x_coordinate: number = coordinates[0];
    const y_coordinate: number = coordinates[1];

    if (x_coordinate - 2 >= 1 && y_coordinate + 1 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - 2, y_coordinate + 1]));
    }
    if (x_coordinate + 2 <= WIDTH && y_coordinate + 1 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + 2, y_coordinate + 1]));
    }
    if (x_coordinate - 2 >= 1 && y_coordinate - 1 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - 2, y_coordinate - 1]));
    }
    if (x_coordinate + 2 <= WIDTH && y_coordinate - 1 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + 2, y_coordinate - 1]));
    }
    if (x_coordinate - 1 >= 1 && y_coordinate + 2 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - 1, y_coordinate + 2]));
    }
    if (x_coordinate + 1 <= WIDTH && y_coordinate + 2 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + 1, y_coordinate + 2]));
    }
    if (x_coordinate - 1 >= 1 && y_coordinate - 2 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - 1, y_coordinate - 2]));
    }
    if (x_coordinate + 1 <= WIDTH && y_coordinate - 2 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + 1, y_coordinate - 2]));
    }
}

function MoveQueen(position: AlgebraicNotation) {
    MoveBishop(position);
    MoveRook(position);
}

function MoveKing(position: AlgebraicNotation) {
    const coordinates: Vector2 = AlgebraicNotationToVector2(position);
    const x_coordinate: number = coordinates[0];
    const y_coordinate: number = coordinates[1];

    if (coordinates[0] - 1 >= 1 && coordinates[1] - 1 >= 1)
    {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - 1, y_coordinate - 1]));
    }
    if (coordinates[0] + 1 <= WIDTH && coordinates[1] + 1 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + 1, y_coordinate + 1]));
    }
    if (coordinates[0] + 1 <= WIDTH && coordinates[1] - 1 >= 1) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + 1, y_coordinate - 1]));
    }
    if (coordinates[0] - 1 >= 1 && coordinates[1] + 1 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - 1, y_coordinate + 1]));
    }
    if (coordinates[0] - 1 >= 1) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - 1, y_coordinate]));
    }
    if (coordinates[0] + 1 <= WIDTH) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + 1, y_coordinate]));
    }
    if (coordinates[1] - 1 >= 1) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate, y_coordinate - 1]));
    }
    if (coordinates[1] + 1 <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate, y_coordinate + 1]));
    }
}

function MoveBishop(position: AlgebraicNotation) {
    const coordinates: Vector2 = AlgebraicNotationToVector2(position);
    const x_coordinate: number = coordinates[0];
    const y_coordinate: number = coordinates[1];
    let counter: number = 1;

    while (coordinates[0] - counter >= 1 && coordinates[1] - counter >= 1) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - counter, y_coordinate - counter]));
        counter++;
    }

    console.log(counter);
    counter = 0;

    while (coordinates[0] + counter <= WIDTH && coordinates[1] + counter <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + counter, y_coordinate + counter]));
        counter++;
    }

    console.log(counter);
    counter = 0;

    while (coordinates[0] + counter <= WIDTH && coordinates[1] - counter >= 1) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate + counter, y_coordinate - counter]));
        counter++;
    }

    console.log(counter);
    counter = 0;

    while (coordinates[0] - counter >= 1 && coordinates[1] + counter <= HEIGHT) {
        validMoves.push(Vector2ToAlgebraicNotation([x_coordinate - counter, y_coordinate + counter]));
        counter++;
    }

    console.log(counter);
    counter = 0;
}

function RenderKeyboard(): InlineKeyboard {
    const keyboard: InlineKeyboard = new InlineKeyboard();

    for (let y: number = HEIGHT; y >= 1; y--) {
        keyboard.row();

        for (let x: number = 1; x <= WIDTH; x++) {
            const coord: AlgebraicNotation = Vector2ToAlgebraicNotation([x, y]);

            if (validMoves.includes(coord)) {
                keyboard.text(GREEN, `chess ${coord}`);
            }
            else if (Object.keys(pieces).includes(coord)) {
                const piece = pieces[coord];

                keyboard.text(CHESS[piece.color][piece.name], `chess ${coord}`);
            } else if ((x + y) % 2 === 0) {
                keyboard.text(BLACK, `chess ${coord}`);
            } else {
                keyboard.text(WHITE, `chess ${coord}`);
            }
        };
    };

    return keyboard;
}

export function ChessCallback(): void {
    bot.callbackQuery(/chess ([a-h][1-8])/, async (ctx) => {
        const selected_coord: AlgebraicNotation = ctx.match[1] as AlgebraicNotation;

        if (Object.keys(pieces).includes(selected_coord)) {
            const piece: Piece =  pieces[selected_coord];

            if (piece.color === (player ? 'white' : 'black'))  {
                return;
            }
            else if (piece.name === 'pawn') {
                selected = selected_coord;
                validMoves = MovePawn(pieces[selected_coord].color, selected_coord, piece.movedOnce);
            }
            else if (piece.name === 'rook') {
                selected = selected_coord;
                MoveRook(selected_coord);
            } else if (piece.name === 'bishop') {
                selected = selected_coord;
                MoveBishop(selected_coord);
            } else if (piece.name === 'queen') {
                selected = selected_coord;
                MoveQueen(selected_coord);
            } else if (piece.name === 'knight') {
                selected = selected_coord;
                MoveKnight(selected_coord);
            } else if (piece.name === 'king') {
                selected = selected_coord;
                MoveKing(selected_coord);
            }
        } else if (validMoves.includes(selected_coord)) {
            pieces[selected_coord] = pieces[selected as AlgebraicNotation];
            delete pieces[selected as AlgebraicNotation];
            selected = '';
            validMoves = [];
        }

        await ctx.editMessageText(RenderBoard(), { reply_markup: RenderKeyboard() });
    });
}

function Vector2ToAlgebraicNotation(vector2: Vector2): AlgebraicNotation {
    return `${IntToAlpha(vector2[0])}${vector2[1]}`;
}

function AlgebraicNotationToVector2(algebraicNotation: AlgebraicNotation): Vector2 {
    const splitAlgebraicNotation: string[] = algebraicNotation.split('');
    const x: number = AlphaToInt(splitAlgebraicNotation[0]);
    const y: number = parseInt(splitAlgebraicNotation[1]);

    return [x, y];
}

function IntToAlpha(int: number, isUpper = false): string {
    const offset = isUpper ? 64 : 96;

    return String.fromCharCode(int + offset);
}

function AlphaToInt(char: string): number {
    const ascii = char.charCodeAt(0);

    if (ascii >= 97 && ascii <= 122) {
        return ascii - 96;
    } else if (ascii >= 65 && ascii <= 90) {
        return ascii - 64;
    }
    return NaN;
}

function GeneratePieces(): void {
    pieces = {};

    for (const [color, yAxis] of [['white', 1], ['black', 8]] as [Color, number][]) {
        pieces[`a${yAxis}`] = {color: color, name: 'rook'};
        pieces[`b${yAxis}`] = {color: color, name: 'knight'};
        pieces[`c${yAxis}`] = {color: color, name: 'bishop'};
        pieces[`d${yAxis}`] = {color: color, name: 'queen'};
        pieces[`e${yAxis}`] = {color: color, name: 'king'};
        pieces[`f${yAxis}`] = {color: color, name: 'bishop'};
        pieces[`g${yAxis}`] = {color: color, name: 'knight'};
        pieces[`h${yAxis}`] = {color: color, name: 'rook'};
    };

    for (let x: number = 1; x <= WIDTH; x++) {
        //pieces[`${IntToAlpha(x)}7`] = {color: 'black', name: 'pawn', movedOnce: false};
        //pieces[`${IntToAlpha(x)}2`] = {color: 'white', name: 'pawn', movedOnce: false};
    };
}

function RenderBoard(): string {
    let renderer: string = '';

    for (let y: number = HEIGHT; y >= 1; y--) {
        for (let x: number = 1; x <= WIDTH; x++) {
            const coord: AlgebraicNotation = Vector2ToAlgebraicNotation([x, y]);

            if (Object.keys(pieces).includes(coord)) {
                const piece = pieces[coord];

                renderer += CHESS[piece.color][piece.name];
            } else if ((x + y) % 2 === 0) {
                renderer += BLACK;
            } else {
                renderer += WHITE;
            }
        };
        renderer += '\n';
    };

    return renderer;
}

export async function PlayChess(ctx: Context) {
    GeneratePieces();
    await ctx.reply(RenderBoard(), { reply_markup: RenderKeyboard() });
}