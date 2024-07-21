import { config } from "../config";
import axios from "axios";
import { Attachment, CommandInteraction, SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { LANG_MAP } from "../translate_params/lang";
import { TRANSLATORS } from "../translate_params/translators";
import {loadResult, tryToGetImageUrl} from "../translate_params/api_helpers";

const URL = config.API_URL;
const RUN_ENDPOINT = "/submit";
const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB

export const data = new SlashCommandBuilder()
  .setName("translate_manga")
  .setDescription("Translate a manga panel based on a image or URL.")
  .addStringOption(option => 
    option.setName('language')
          .setDescription('The language to translate to')
          .setRequired(true)
          .addChoices(...LANG_MAP)
  )
  .addStringOption(option => 
    option.setName('translator')
    .setDescription('The translator to use')
    .setRequired(true)
    .addChoices(...TRANSLATORS)
  )
  .addAttachmentOption(option => 
    option.setName('panel')
          .setDescription('The manga panel')
          .setRequired(false)
  )
  .addStringOption(option =>
    option.setName('panel_url')
          .setDescription('Manga panel URL (if not provided as an attachment)')
          .setRequired(false)
  )
  ;

  export async function execute(interaction: CommandInteraction) {
    try {
      await interaction.deferReply();
  
      const language = interaction.options.get('language');
      const translator = interaction.options.get('translator');
  
      // Get the image URL
      const imageUrl = tryToGetImageUrl(interaction);
  
      if (!imageUrl || !language) {
        return interaction.editReply("Please provide a valid panel (image or URL).");
      }
  
      //LANGUAGE STUFF
      const lang = language.value as string;
      const langCode = lang.split(" ")[0];
  
      //TRANSLATOR CODE
      const translatorCode = (translator?.value as string) ?? "google";
      const validTranslatorCode = translatorCode.split(" ")[0];
  
      console.log(`Panel URL: ${imageUrl}, Language: ${lang}, Language Code: ${langCode}`);
      // Fetch the image as a stream
      const imageResponse = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
        //some funny guy can send a 100mb image or maybe a zip file
        maxContentLength: MAX_IMAGE_SIZE,
      });
  
      // check if the image is a jpg or png
      if (!imageResponse.headers['content-type'].includes('image')) {
        return await interaction.editReply("The provided file is not an image! Please put a valid image.");
      }
  
      const imageBlob = new Blob([imageResponse.data], { type: 'image/jpeg' });
  
      const form = new FormData();
  
      form.append('file', imageBlob, 'panel.jpg');
      form.append('target_lang', langCode);
      form.append('translator', validTranslatorCode);
      form.append('size', 'X');

      console.log(`${URL}${RUN_ENDPOINT}`);
  
      const response = await axios.post(`${URL}${RUN_ENDPOINT}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'ngrok-skip-browser-warning': 'true',
        },
        timeout: 300000,
      });
  
      if (response.status === 200) {
        console.log('Response from API:', response.data);
        return await loadResult(interaction, response.data.task_id);
      } else {
        console.log(`Failed to send panel ${response.statusText}`);
        return await interaction.editReply(`Failed to send panel: ${response.statusText}`);
      }
    } catch (error: any) {
      if (error.response) {
        console.error(`Server Error: ${error.response.data}`);
        return await interaction.editReply(`An error occurred: ${error.response.data}`);
      } else {
        console.error(`Error: ${error.message}`);
        return await interaction.editReply(`An error occurred: ${error.message}`);
      }
    }
  }
  
