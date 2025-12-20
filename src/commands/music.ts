import { Context, InlineKeyboard, InputFile } from 'grammy';
import ytDlp from 'yt-dlp-exec';
import * as fs from 'fs';
import * as path from 'path';
import { bot } from '../bot';
import ffmpegPath from 'ffmpeg-static';

const CLIENTS_DIR = path.resolve(__dirname, 'clients');
if (!fs.existsSync(CLIENTS_DIR)) {
    fs.mkdirSync(CLIENTS_DIR, { recursive: true });
}

export async function Play(ctx: Context) {
    const query = ctx.match as string;

    if (!query) return ctx.reply("Please provide a title. Example: /play shape of you");

    const searchingMsg = await ctx.reply("🔍 Searching via yt-dlp...");

    try {
        const searchResult = await ytDlp(`ytsearch5:${query}`, {
            dumpSingleJson: true,
            noWarnings: true,
            flatPlaylist: true
        });

        const items = (searchResult as any).entries;

        if (!items || items.length === 0) {
            return ctx.api.editMessageText(ctx.chat?.id!, searchingMsg.message_id, "No results found.");
        }

        const keyboard = new InlineKeyboard();

        items.forEach((video: any) => {
            if (!video.id) return;
            const title = video.title || "Unknown Title";
            keyboard.url("📺 Preview", `https://youtu.be/${video.id}`);
            keyboard.text(title.substring(0, 30), `MUSIC,${ctx.from?.id},${video.id}`).row();
        });
        keyboard.text("♻️ Cancel", `DELETE,${ctx.from?.id}`).row();

        await ctx.api.editMessageText(ctx.chat?.id!, searchingMsg.message_id, `Results for: "${query}"`, {
            reply_markup: keyboard
        });

    } catch (err) {
        console.error("Search Error:", err);
        await ctx.api.editMessageText(ctx.chat?.id!, searchingMsg.message_id, "⚠️ Search failed. Try again later.");
    }
}

export function MusicCallback() {
    bot.on("callback_query:data", async (ctx: Context) => {
        if (!ctx.callbackQuery?.data) return;

        const [action, userId, videoId] = ctx.callbackQuery.data.split(",");

        if (action === "DELETE") {
            if (ctx.from?.id.toString() !== userId) return ctx.answerCallbackQuery("Not your request!");
            await ctx.deleteMessage();
            return;
        }

        if (action === "MUSIC") {
            await ctx.answerCallbackQuery();
            const statusMsg = await ctx.reply("⏳ Downloading... (Converting format)");
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            const outputPath = path.join(CLIENTS_DIR, `${videoId}.m4a`);

            try {
                if (!ffmpegPath) throw new Error("FFmpeg binary not found!");

                await ytDlp(videoUrl, {
                    extractAudio: true,
                    audioFormat: 'm4a',
                    output: outputPath,
                    noCheckCertificate: true,
                    noWarnings: true,
                    preferFreeFormats: true,
                    ffmpegLocation: ffmpegPath
                });

                const metadata = await ytDlp(videoUrl, { dumpJson: true, noWarnings: true });
                const title = (metadata as any).title || "Audio";

                await ctx.replyWithVoice(new InputFile(outputPath), {
                    caption: `🎵 **${title}**\nRequested by: ${ctx.from?.first_name}`,
                    parse_mode: "Markdown"
                });

                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                await ctx.api.deleteMessage(ctx.chat?.id!, statusMsg.message_id);

            } catch (err: any) {
                console.error("Download Error:", err);
                await ctx.api.editMessageText(
                    ctx.chat?.id!, 
                    statusMsg.message_id, 
                    `⚠️ Failed: ${err.message}`
                );
            }
        }
    });
}