import Discord from 'discord.js';
import { DISCORD_BOT_TOKEN } from "./libs/constants";


// Don't need to be env vars
const SERVER_ID: string = "801219591636254770"; // CENNZnet server id
const IDENTITY_ROLE_ID: string = "956340150982545439"; // ID for role rewarded after completing identity steps
const bot = new Discord.Client({
    partials: ["CHANNEL"],
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.DIRECT_MESSAGES
    ]
});


bot.on("ready", async () => {
    console.log(">> Discord Bot started");
});

bot.on('messageCreate', async (msg) => {
    // For testing purposes
    if (msg.channel.type === "DM") {
        if (msg.content === "!role") {
            await assignIdentityRole(`${msg.author.username}#${msg.author.discriminator}`);
        }
    }
});

// Assigns the identity role to a user in the CENNZnet Discord server
// rawName should be a string of format "KendrickLamar#0425"
export async function assignIdentityRole(rawName: string) {
    if (!bot) return;
    const [username, discriminator] = splitUsername(rawName);
    try {
        const guildCache = bot.guilds.cache.get(SERVER_ID);
        await guildCache.members.fetch();
        const user = guildCache.members.cache.find(user => {
            return user.user.username === username && user.user.discriminator === discriminator
        });
        const identity_role = guildCache.roles.cache.find(role => role.id === IDENTITY_ROLE_ID);
        await user.roles.add(identity_role);
        // Send a message to the user letting them know the verification has been successful
        await user.send(
            `***Congratulations on completing the steps for verifying your identity.*** \n\n` +
            `Thank you for supporting CENNZnet and helping to build the blockchain for the Metaverse!\n` +
            `You have been assigned the ${identity_role.name} role and can now participate in private channels\n` +
            `Please note that for your safety, we will never ask for private keys, seed phrases or send links via DM.`
        );
        console.log(`>> Role assigned for: ${username}`);
    } catch (e) {
        console.log(">> Error assigning role");
        console.log(e)
    }
}

// Split a username into it's components, name and discriminator
// KendrickLamar#0425 goes to => KendrickLamar and 0425
function splitUsername(rawName) {
    const splitName = rawName.split('#');
    const username = splitName[0];
    const discriminator = splitName[1];
    return [username, discriminator];
}

export function initialiseBot() {
    bot.login(DISCORD_BOT_TOKEN);
}
