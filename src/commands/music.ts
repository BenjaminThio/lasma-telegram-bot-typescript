import { Context, InlineKeyboard, InputFile } from 'grammy';
import ytsr from 'ytsr'; // <--- Use ytsr for searching
import ytDlp from 'yt-dlp-exec';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { bot } from '../bot';
import ffmpegPath from 'ffmpeg-static';

// OLD CODE: (Causes Error on Vercel)
// const CLIENTS_DIR = path.resolve(__dirname, 'clients');

// NEW CODE: (Works on Vercel)
// We use the system's temporary directory.
const CLIENTS_DIR = path.join(os.tmpdir(), 'music_downloads');

// Ensure the folder exists in /tmp (Vercel wipes this on every cold start)
if (!fs.existsSync(CLIENTS_DIR)) {
    fs.mkdirSync(CLIENTS_DIR, { recursive: true });
}

export async function Play(ctx: Context) {
    const query = ctx.match as string;

    if (!query) return ctx.reply("Please provide a title. Example: /play shape of you");

    const searchingMsg = await ctx.reply("🔍 Searching via ytsr..."); // Updated text

    try {
        // --- CHANGED: Using ytsr instead of yt-dlp ---
        // ytsr is pure JS, faster, and works on Vercel for listings
        const searchResults = await ytsr(query, { limit: 5 });
        
        // Filter to ensure we only get videos (remove channels/playlists)
        const items = searchResults.items.filter((item): item is ytsr.Video => item.type === 'video');

        if (!items || items.length === 0) {
            return ctx.api.editMessageText(ctx.chat?.id!, searchingMsg.message_id, "No results found.");
        }

        const keyboard = new InlineKeyboard();

        items.forEach((video) => {
            if (!video.id) return;
            const title = video.title || "Unknown Title";
            
            keyboard.url("📺 Preview", video.url);
            // Limit title length to prevent Telegram button errors
            keyboard.text(title.substring(0, 40), `MUSIC,${ctx.from?.id},${video.id}`).row();
        });
        
        keyboard.text("♻️ Cancel", `DELETE,${ctx.from?.id}`).row();

        await ctx.api.editMessageText(ctx.chat?.id!, searchingMsg.message_id, `Results for: "${query}"`, {
            reply_markup: keyboard
        });

    } catch (err) {
        console.error("Search Error:", err);
        // This ensures you actually see the error in the chat if logs fail
        await ctx.api.editMessageText(ctx.chat?.id!, searchingMsg.message_id, `⚠️ Search failed: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export function MusicCallback() {
    bot.on("callback_query:data", async (ctx: Context) => {
        if (!ctx.callbackQuery?.data) return;

        const [action, userId, videoId] = ctx.callbackQuery.data.split(",");

        if (action === "DELETE") {
            if (ctx.from?.id.toString() !== userId) return ctx.answerCallbackQuery("Not your request!");
            try {
                await ctx.deleteMessage();
            } catch (e) {
                // Ignore delete errors (msg might be too old)
            }
            return;
        }

        if (action === "MUSIC") {
            await ctx.answerCallbackQuery();
            const statusMsg = await ctx.reply("⏳ Downloading... (Converting format)");
            const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
            
            // Generate a unique filename using timestamp to avoid collisions
            const fileName = `${videoId}_${Date.now()}.m4a`;
            const outputPath = path.join(CLIENTS_DIR, fileName);

            try {
                if (!ffmpegPath) throw new Error("FFmpeg binary not found!");

                await ytDlp(videoUrl, {
                    extractAudio: true,
                    audioFormat: 'm4a',
                    output: outputPath,
                    noCheckCertificate: true,
                    noWarnings: true,
                    preferFreeFormats: true,
                    ffmpegLocation: ffmpegPath,
                    // Add this to prevent yt-dlp from trying to write cache to read-only folders
                    cacheDir: path.join(os.tmpdir(), '.cache') 
                });

                // Fetch metadata separately to be safe
                const metadata = await ytDlp(videoUrl, { dumpJson: true, noWarnings: true });
                const title = (metadata as any).title || "Audio";

                await ctx.replyWithVoice(new InputFile(outputPath), {
                    caption: `🎵 **${title}**\nRequested by: ${ctx.from?.first_name}`,
                    parse_mode: "Markdown"
                });

                // Cleanup: Delete the file after sending
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
                
                await ctx.api.deleteMessage(ctx.chat?.id!, statusMsg.message_id);

            } catch (err: any) {
                console.error("Download Error:", err);
                
                // Cleanup if error occurred
                if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);

                await ctx.api.editMessageText(
                    ctx.chat?.id!, 
                    statusMsg.message_id, 
                    `⚠️ Failed: ${err.message || "Unknown error"}`
                );
            }
        }
    });
}