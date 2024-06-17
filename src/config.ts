import dotenv from 'dotenv';

dotenv.config();

const {DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID} = process.env;

if(!DISCORD_BOT_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error('Discord bot token and client ID must be provided in the environment variables DISCORD_BOT_TOKEN and DISCORD_CLIENT_ID');
}

export const config = {
  DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID,
};