import { Context } from 'grammy';

async function test(ctx: Context): Promise<void> {
    const date: Date = new Date();

    await ctx.reply(date.toLocaleDateString());
}

async function Time(ctx: Context): Promise<void> {
    const date: Date = new Date();

    await ctx.reply(date.toLocaleTimeString());
}

export { test, Time };