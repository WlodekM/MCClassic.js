import { Command } from '../command.js';
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { __dirname } from "../../dirname.js"

const readdir = promisify(fs.readdir);

export const player = async (player, server) => {
    console.debug("uh", path.resolve(__dirname, "src/commands/"))
    server.commands = new Command({});
    let i = 1;

    try {
        const files = await readdir(path.resolve(__dirname, "src/commands/"));
        for (const file of files) {
            if (!file.endsWith(".js")) continue;

            const commands = await import(`../commands/${file}`);
            console.log(`../commands/${file}`, commands)
            commands.AddCommand(player, server);
            let commandName = file.split(".")[0];
            i++;
        }
    } catch (err) {
        console.error(err);
    }

    server.handleCommand = (str) => {
        try {
            const res = server.commands.use(str, player.op);
            if (res) player.chat(res);
        } catch (err) {
            if (err) {
                player.chat(`${server.color.red}Error: ${err.message}`);
                console.log(`Error: ${err.stack}`);
            } else {
                setTimeout(() => {
                    throw err;
                }, 0);
            }
        }
    };
    console.log("server.handleCommand", server.handleCommand)
};

export const settings = {
    priority: -1
}