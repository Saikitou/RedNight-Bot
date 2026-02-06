require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember
    ]
});

client.commands = new Collection();
client.prefixCommands = new Collection();

const configFile = fs.readFileSync('./config/config.yml', 'utf8');
client.config = yaml.load(configFile);

const loadCommands = (dir) => {
    const folders = fs.readdirSync(dir);
    
    for (const folder of folders) {
        const folderPath = path.join(dir, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;
        
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
        
        for (const file of files) {
            const command = require(path.join(folderPath, file));
            
            if (command.data) {
                client.commands.set(command.data.name, command);
                console.log(`✅ Slash command loaded: ${command.data.name}`);
            }
            
            if (command.name) {
                client.prefixCommands.set(command.name, command);
                console.log(`✅ Prefix command loaded: ${command.name}`);
            }
        }
    }
};

const loadEvents = (dir) => {
    const files = fs.readdirSync(dir).filter(file => file.endsWith('.js'));
    
    for (const file of files) {
        const event = require(path.join(dir, file));
        
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        
        console.log(`📡 Event loaded: ${event.name}`);
    }
};

loadCommands('./src/commands');
loadEvents('./src/events');

client.login(process.env.DISCORD_TOKEN);