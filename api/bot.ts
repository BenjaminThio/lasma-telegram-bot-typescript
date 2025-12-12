import { webhookCallback, GrammyError, HttpError } from 'grammy'
import { VercelRequest, VercelResponse } from "@vercel/node"
import { bot } from '@src/bot';

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;

    if (e instanceof GrammyError) {
        console.error("Error in request: ", e.description);
    } else if (e instanceof HttpError) {
        console.error("Could not contact Telegram: ", e);
    } else {
        console.error("Unknown error: ", e);
    }
})

export default async (req: VercelRequest, res: VercelResponse) => {
    console.log("Incoming Webhook Request.");

    try {
        return webhookCallback(bot, "http")(req, res);
    } catch (e) {
        console.error("Webhook processing error: ", e);
        return res.status(500).send("Error");
    }
}