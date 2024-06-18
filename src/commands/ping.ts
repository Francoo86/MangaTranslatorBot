import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with Pong!")
  .addStringOption(option => 
    option.setName('string')
          .setDescription('Enter a string')
          .setRequired(false)
  );

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("Pong!");
}