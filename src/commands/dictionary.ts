import { search, type Word, type Definition } from '../dictionary/utils/index';
import { Context } from 'grammy';

async function Dict(ctx: Context): Promise<void> {
    const args = ctx.match;

    if (args) {
        const word: Word | undefined = search((args as string).split(' ')[0]);

        if (word !== undefined) {
            const definitions: Definition[] = word.definitions;

            console.log(definitions);
            await ctx.reply(definitions.map((value: Definition) => value.meaning).join('\n'));
        }
    }
}

export { Dict };