const { config } = require('dotenv');
config();
const axios = require('axios');
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command('quit', async (ctx) => {
    await ctx.leaveChat();
});

bot.on(message('text'), async (ctx) => {
    let result = '';
    const message = ctx.update.message;
    console.log(message.chat.id, parseInt(process.env.TELEGRAM_GROUP_ID));
    if (
        message.chat.type === 'supergroup' &&
        message.chat.id === parseInt(process.env.TELEGRAM_GROUP_ID)
    ) {
        const mentionEntity =
            message.entities && message.entities.find((entity) => entity.type === 'mention');

        if (mentionEntity) {
            const username = message.text.substring(
                mentionEntity.offset + 1,
                mentionEntity.offset + mentionEntity.length
            );

            if (username === process.env.BOT_NAME) {
                const prompt = getMessageTextWithoutBotUsername(message.text, username);
                try {
                    const { data } = await axios.post(
                        `${process.env.OPEN_AI_BASE_URL}/chat/completions`,
                        {
                            model: 'gpt-3.5-turbo',
                            temperature: 0.5,
                            messages: [
                                {
                                    role: 'system',
                                    content:
                                        "You are Coders Gyan'n assistant, a large language model promoted by Coder's Gyan.",
                                },
                                { role: 'user', content: prompt },
                            ],
                        },
                        {
                            headers: {
                                Accept: 'application/json',
                                Authorization: `Bearer ${process.env.OPEN_AI_TOKEN}`,
                            },
                        }
                    );
                    if (data.choices.length) {
                        result = data.choices[0].message.content;
                    }
                } catch (err) {
                    console.log('Error', err);
                }

                return await ctx.reply(result);
            }
        }
    }
});

bot.launch({
    webhook: {
        domain: process.env.BOT_DOMAIN,
        port: process.env.BOT_PORT,
    },
});

function getMessageTextWithoutBotUsername(text, botUsername) {
    const regex = new RegExp(`^\/?[a-zA-Z@]*${botUsername}( |$)`);
    const messageTextWithoutBotUsername = text.replace(regex, '');
    return messageTextWithoutBotUsername.trim();
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
