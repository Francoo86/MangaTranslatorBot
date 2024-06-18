import { config } from "../config";
import axios from "axios";
import { Attachment, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { LANG_MAP } from "../translate_params/lang";

const URL = config.API_URL;
const RUN_ENDPOINT = "/run";

export const data = new SlashCommandBuilder()
  .setName("translate_manga")
  .setDescription("Translate a manga panel")
  .addAttachmentOption(option => 
    option.setName('panel')
          .setDescription('The manga panel')
          .setRequired(true)
  )
  .addStringOption(option => 
    option.setName('language')
          .setDescription('The language to translate to')
          .setRequired(true)
          .addChoices(...LANG_MAP)
  );

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();

  const panel = interaction.options.get('panel');
  const language = interaction.options.get('language');
  if (!panel || !language) {
    return interaction.editReply("Please provide a panel and a language");
  }
  
  // Get the image URL
  const image = panel.attachment as Attachment;
  const imageUrl = image.url;
  const lang = language.value as string;
  const langCode = lang.split(" ")[0];

  console.log(`Panel URL: ${imageUrl}, Language: ${lang}, Language Code: ${langCode}`);

  try {  
    // Fetch the image as a stream
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    const imageBlob = new Blob([imageResponse.data], { type: 'image/jpeg' }); 

    // Create a FormData object
    const form = new FormData();
    form.append('file', imageBlob, 'panel.jpg');
    form.append('tgt_lang', langCode);
    form.append('translator', 'deepl');

    // Send the form data to the API
    const response = await axios.post(`${URL}${RUN_ENDPOINT}`, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'ngrok-skip-browser-warning': 'true',
      }
    });

    // Handle the response from the API
    if (response.status === 200) {
      console.log('Response from API:', response.data);
      return await interaction.editReply("Image and language sent successfully!");
    } else {
      console.log(`Failed to send image and language: ${response.statusText}`);
      return await interaction.editReply(`Failed to send image and language: ${response.statusText}`);
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
