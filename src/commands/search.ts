import { chromium } from "playwright";
import fs from "fs-extra";
import { InlineKeyboard } from "grammy";
import { Context } from "grammy";
import { bot } from '../bot';

export async function searchImages(
  query: string,
  limit = 10
): Promise<string[]> {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(
    `https://www.bing.com/images/search?q=${encodeURIComponent(query)}`,
    { waitUntil: "networkidle" }
  );

  const images = await page.$$eval(
    "img.mimg",
    (imgs, limit) =>
      imgs
        .map(img => (img as HTMLImageElement).src)
        .filter(src => src.startsWith("http"))
        .slice(0, limit),
    limit // 👈 explicitly passed into browser context
  );

  await browser.close();
  return images;
}

const FILE = "./image.json";

export function load(): Record<string, string[]> {
  if (!fs.existsSync(FILE)) {
    console.log('IN');
    return {}
  };
  return fs.readJsonSync(FILE);
}

export function save(data: Record<string, string[]>) {
  fs.writeJsonSync(FILE, data);
}

export function keyboard(
  userId: number,
  msgId: number,
  imageIndex: number
) {
  return new InlineKeyboard()
    .text("⬅️", "test")
    .text("⬅️", `IMAGE:${userId}:${msgId}:${imageIndex}:left`)
    .text("♻️", `DELETE:${userId}`)
    .text("➡️", `IMAGE:${userId}:${msgId}:${imageIndex}:right`);
}

export async function Search(ctx: Context) {
  const query = ctx.message?.text?.split(" ").slice(1).join(" ");
  if (!query) {
    await ctx.reply("/search [query]");
    return;
  }

  const msgId = ctx.message!.message_id;
  const data = load();

  if (!data[`${msgId}_image`]) {
    const images = await searchImages(query);
    data[`${msgId}_image`] = images;
    save(data);
  }

  const images = data[`${msgId}_image`];
  if (!images.length) {
    await ctx.reply(`No result for "${query}"`);
    return;
  }

  await ctx.reply(
    `Image [1](${images[0]})`,
    {
      parse_mode: "Markdown",
      reply_markup: keyboard(ctx.from!.id, msgId, 0),
    }
  );
}

export function ImageCallback() {
  console.log('IN2');
  bot.callbackQuery("test", async ctx => {
    console.log('test');
  });
  bot.callbackQuery(/^IMAGE:(\d+):(\d+):(\d+):(left|right)$/, async ctx => {
    const [, userId, msgId, imageIndex, command] =
      ctx.callbackQuery.data.split(":");

    const data = load();
    const key = `${msgId}_image`;

    console.log('IN3')

    if (!data[key]) {
      await ctx.answerCallbackQuery();
      return;
    }

    let index = Number(imageIndex);
    const images = data[key];

    if (command === "left") {
      index = index - 1 >= 0 ? index - 1 : images.length - 1;
    } else {
      index = index + 1 < images.length ? index + 1 : 0;
    }

    await ctx.editMessageText(
      `Image [${index + 1}](${images[index]})`,
      {
        parse_mode: "Markdown",
        reply_markup: keyboard(Number(userId), Number(msgId), index),
      }
    );

    await ctx.answerCallbackQuery();
  });
}