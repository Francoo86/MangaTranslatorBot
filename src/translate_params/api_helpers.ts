import { TRANSLATORS } from "./translators";
import { config } from "../config";
import axios from "axios";
import { CommandInteraction, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { LANG_MAP } from "./lang";

const API_URL = config.API_URL;
const RESULT_ENDPOINT = "/result";

function getLanguageName(value : string) : string {
    const lang = LANG_MAP.find(t => t.value === value);
    return lang ? lang.name : "Unknown";
}

async function loadResult(interaction : CommandInteraction, taskId: string) {
    const response = await axios.get(`${API_URL}${RESULT_ENDPOINT}/${taskId}`, {
        responseType: 'arraybuffer'
    });
    
    const imageBuffer = Buffer.from(response.data, 'binary');
    const imageAttachment = new AttachmentBuilder(imageBuffer, { name: 'translated-image.png' });
    //considering response.data should be an image
    const image = response.data;
    const embed = new EmbedBuilder();
    const lang = (interaction.options.get('language')?.value as string) ?? "Unknown";
    const translator = (interaction.options.get('translator')?.value as string) ?? "Unknown";
    const langName = getLanguageName(lang);
    
    console.log(`Image URL: ${image}`)
    
    embed.setTitle("Translated Image")
        .setDescription("Translate image in the language you requested")
        .addFields(
        { name: 'Language', value: langName},
        { name: 'Translator', value: translator},
        { name: 'Task ID', value: taskId},
        )
        .setTimestamp()
        .setImage('attachment://translated-image.png');
        
    //embed it in the message
    return await interaction.editReply({
        embeds: [embed],
    });
}

export { loadResult}