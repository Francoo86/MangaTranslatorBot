import dotenv from 'dotenv';

dotenv.config();

const {DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID} = process.env;

export const config = {
  DISCORD_BOT_TOKEN,
  DISCORD_CLIENT_ID,
};