import { Context, InlineKeyboard } from 'grammy';
import { bot } from '../bot';

/*
interface ExtendedContext extends Context {
    args: string[];
}
*/

enum OPTIONS {
    ZERO,
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
    SHIFT,
    ALPHA,
    UP,
    MENU,
    ON,
    OPTION,
    CALCULATE,
    LEFT,
    RIGHT,
    ALGEBRA,
    DOWN,
    SQUARE_ROOT,
    POWER_OF_TWO,
    POWER,
    LOGARITHMS,
    NATURAL_LOGARITHM,
    NEGATIVE,
    POWER_OF_NEGATIVE_ONE,
    SINE,
    COSINE,
    TANGENT,
    LEFT_PARENTHESIS,
    RIGHT_PARENTHESIS,
    DELETE,
    ALL_CLEAR,
    MULTIPLY,
    DIVIDE,
    PLUS,
    MINUS,
    ANSWER,
    EQUAL
}

const KEYBOARD: InlineKeyboard = new InlineKeyboard()
.text('SHIFT', `cal ${OPTIONS.SHIFT}`)
.text('ALPHA', `cal ${OPTIONS.ALPHA}`)
.text('⬆️', `cal ${OPTIONS.UP}`)
.text('MENU', `cal ${OPTIONS.MENU}`)
.text('ON', `cal ${OPTIONS.ON}`)
.row()
.text('OPTN', `cal ${OPTIONS.OPTION}`)
.text('CALC', `cal ${OPTIONS.CALCULATE}`)
.text('⬅️', `cal ${OPTIONS.LEFT}`)
.text('➡️', `cal ${OPTIONS.RIGHT}`)
.text('???', 'cal -1')
.text('x', `cal ${OPTIONS.ALGEBRA}`)
.row()
.text('⬇️', `cal ${OPTIONS.DOWN}`)
.row()
.text('/', `cal ${OPTIONS.DIVIDE}`)
.text('√', `cal ${OPTIONS.SQUARE_ROOT}`)
.text('x²', `cal ${OPTIONS.POWER_OF_TWO}`)
.text('x▝', `cal ${OPTIONS.POWER}`)
.text('log▗▯', `cal ${OPTIONS.LOGARITHMS}`)
.text('ln', `cal ${OPTIONS.NATURAL_LOGARITHM}`)
.row()
.text('-', `cal ${OPTIONS.MINUS}`)
.text('°\' "', 'cal -1')
.text('x⁻¹', `cal ${OPTIONS.POWER_OF_NEGATIVE_ONE}`)
.text('sin', `cal ${OPTIONS.SINE}`)
.text('cos', `cal ${OPTIONS.COSINE}`)
.text('tan', `cal ${OPTIONS.TANGENT}`)
.row()
.text('STO', 'cal -1')
.text('ENG', 'cal -1')
.text('(', `cal ${OPTIONS.LEFT_PARENTHESIS}`)
.text(')', `cal ${OPTIONS.RIGHT_PARENTHESIS}`)
.text('S⇔D', 'cal -1')
.text('M+', 'cal -1')
.row()
.text('7', `cal ${OPTIONS.SEVEN}`)
.text('8', `cal ${OPTIONS.EIGHT}`)
.text('9', `cal ${OPTIONS.NINE}`)
.text('DEL', `cal ${OPTIONS.DELETE}`)
.text('AC', `cal ${OPTIONS.ALL_CLEAR}`)
.row()
.text('4', `cal ${OPTIONS.FOUR}`)
.text('5', `cal ${OPTIONS.FIVE}`)
.text('6', `cal ${OPTIONS.SIX}`)
.text('×', `cal ${OPTIONS.MULTIPLY}`)
.text('÷', `cal ${OPTIONS.DIVIDE}`)
.row()
.text('1', `cal ${OPTIONS.ONE}`)
.text('2', `cal ${OPTIONS.TWO}`)
.text('3', `cal ${OPTIONS.THREE}`)
.text('+', `cal ${OPTIONS.PLUS}`)
.text('-', `cal ${OPTIONS.MINUS}`)
.row()
.text('0', `cal ${OPTIONS.ZERO}`)
.text('.', `cal ${OPTIONS.SHIFT}`)
.text('×10ˣ', 'cal -1')
.text('ANS', `cal ${OPTIONS.ANSWER}`)
.text('=', `cal ${OPTIONS.EQUAL}`);

let renderer: string = '';
let answer: string = '';

async function Calculator(ctx: Context): Promise<void> {
    //const args: string[] = ctx.args;
    //eval(args.join(' '))
    await ctx.reply('test', { reply_markup: KEYBOARD });
}

function CalculatorCallback(): void {
    bot.callbackQuery(/cal (40|[1-3][0-9]|[0-9]|)/, async (ctx: Context) => {
        if (!ctx.match) return;

        const option: OPTIONS = parseInt(ctx.match[1]);

        if (option >= 0 && option <= 9) {
            renderer += option.toString();
        } else {
            const ans = eval(renderer);

            switch (option) {
                case OPTIONS.SHIFT:
                    break;
                case OPTIONS.ALPHA:
                    break;
                case OPTIONS.UP:
                    break;
                case OPTIONS.MENU:
                    break;
                case OPTIONS.ON:
                    break;
                case OPTIONS.OPTION:
                    break;
                case OPTIONS.CALCULATE:
                    break;
                case OPTIONS.LEFT:
                    break;
                case OPTIONS.RIGHT:
                    break;
                case OPTIONS.ALGEBRA:
                    break;
                case OPTIONS.DOWN:
                    break;
                case OPTIONS.SQUARE_ROOT:
                    break;
                case OPTIONS.POWER_OF_TWO:
                    break;
                case OPTIONS.POWER:
                    break;
                case OPTIONS.LOGARITHMS:
                    break;
                case OPTIONS.NATURAL_LOGARITHM:
                    break;
                case OPTIONS.NEGATIVE:
                    break;
                case OPTIONS.POWER_OF_NEGATIVE_ONE:
                    break;
                case OPTIONS.SINE:
                    break;
                case OPTIONS.COSINE:
                    break;
                case OPTIONS.TANGENT:
                    break;
                case OPTIONS.LEFT_PARENTHESIS:
                    break;
                case OPTIONS.RIGHT_PARENTHESIS:
                    break;
                case OPTIONS.DELETE:
                    break;
                case OPTIONS.ALL_CLEAR:
                    break;
                case OPTIONS.MULTIPLY:
                    renderer += '*';
                    break;
                case OPTIONS.DIVIDE:
                    renderer += '/';
                    break;
                case OPTIONS.PLUS:
                    renderer += '+';
                    break;
                case OPTIONS.MINUS:
                    renderer += '-';
                    break;
                case OPTIONS.ANSWER:
                    renderer += 'answer';
                    break;
                case OPTIONS.EQUAL:
                    if (ans !== undefined) {
                        answer = ans;
                    }
                    break;
            }
        }

        await ctx.editMessageText(`${renderer}\n${answer}`, { reply_markup: KEYBOARD });
    });
}

export { Calculator, CalculatorCallback };