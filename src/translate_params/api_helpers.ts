import { TRANSLATORS } from "./translators";
import { config } from "../config";
import axios from "axios";
import { CommandInteraction, EmbedBuilder, AttachmentBuilder, Attachment } from "discord.js";
import { LANG_MAP } from "./lang";

const API_URL = config.API_URL;
const RESULT_ENDPOINT = "/result";

const ARONA_COLOR = 0x33ADFF;

function isValidURL(url : string) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

function getNameBasedOnValue(value : string, map : { value: string, name: string }[]) : string {
    const item = map.find(t => t.value === value);
    return item ? item.name : "Unknown";
}

function tryToGetImageUrl(interaction: CommandInteraction): string | null {
  const panel = interaction.options.get('panel')?.attachment as Attachment;
  if (panel) {
      return panel.url;
  }

  const panel_url = interaction.options.get('panel_url')?.value as string;
  if (panel_url && isValidURL(panel_url)) {
      return panel_url.split(" ")[0];
  }

  return null;
}

function getLanguageName(value : string) : string {
    return getNameBasedOnValue(value, LANG_MAP);
}

function getTranslatorName(value : string) : string {
    return getNameBasedOnValue(value, TRANSLATORS);
}

const STATUS_ENDPOINT = "/task-state";

async function loadResult(interaction: CommandInteraction, taskId: string) {
  try {
    let finishedTask : boolean = false;
    let response;

    console.log(`Checking status of task ${taskId}`);
    
    // Polling loop
    while (finishedTask === false) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log(`Checking status of task ${taskId}`);

      response = await axios.get(`${API_URL}${STATUS_ENDPOINT}?taskid=${taskId}`);
      const {state, finished, waiting } = response.data;

      console.log(`Task state: ${state}, finished: ${finished}, queued tasks: ${waiting}`);

      finishedTask = finished;
    }

    if (finishedTask === true) {
      // Fetch the result
      response = await axios.get(`${API_URL}${RESULT_ENDPOINT}/${taskId}`, {
        responseType: 'arraybuffer'
      });

      const imageBuffer = Buffer.from(response.data, 'binary');
      const imageAttachment = new AttachmentBuilder(imageBuffer, { name: 'translated-image.png' });

      const lang = (interaction.options.get('language')?.value as string) ?? "Unknown";
      const translator = (interaction.options.get('translator')?.value as string) ?? "Unknown";

      const langName = getLanguageName(lang);
      const translatorName = getTranslatorName(translator);

      const embed = new EmbedBuilder()
        .setColor(ARONA_COLOR)
        .setTitle("AronaTranslator")
        .setDescription("Translation complete! Check out the translated panel below.")
        .addFields(
          { name: 'Language', value: langName, inline: true },
          { name: 'Translator', value: translatorName, inline: true },
          { name: 'Task ID', value: taskId }
        )
        .setTimestamp()
        .setImage('attachment://translated-image.png');

      // Embed it in the message
      return await interaction.editReply({
        embeds: [embed],
        files: [imageAttachment]
      });
    } else {
      console.log(`Task failed with finished: ${finishedTask}`);
      return await interaction.editReply(`Task failed with finished: ${finishedTask}`);
    }
  } catch (error) {
    console.error('Error fetching the image:', error);
    return await interaction.editReply({
      content: 'There was an error fetching the image. Please try again later. :(',
    });
  }
}

export { loadResult, tryToGetImageUrl}