//import config
import { config } from "../config";
import axios from "axios";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const URL = config.API_URL;
const RUN_ENDPOINT = "/run";

export const data = new SlashCommandBuilder()
  .setName("translate_manga")
  .setDescription("Translate a manga panel")
  .addAttachmentOption(option => 
    option.setName('panel')
          .setDescription('The manga panel')
          .setRequired(true)
  );

  //add image option


