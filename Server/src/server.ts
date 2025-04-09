import mongoose from "mongoose";
import app, { bot } from "./app";
import "dotenv/config";

async function main() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    const port = process.env.PORT || 3000;
    
    app.listen(port, async () => {
        console.log(`Server is running on port ${port}`);
        const webhookUrl = `https://${process.env.SERVER_URL}/api/bot`;
        try {
            if (process.env.TS_NODE_DEV=== 'true') {
                // await bot.launch();
                await bot.telegram.setWebhook(webhookUrl);
            }else{
                await bot.telegram.setWebhook(webhookUrl);
            }
            console.log(`Webhook set to ${webhookUrl}`);
        } catch (err) {
            console.error("Error setting webhook:", err);
        }
    });

}


main();