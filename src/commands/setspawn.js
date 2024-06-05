import Database from 'better-sqlite3';
export const AddCommand = function (player, server) {
    server.commands.add({
        base: 'setspawn',
        info: 'Sets the spawnpoint of the current map.',
        usage: '/setspawn',
        action() {
            const db = new Database('MCScript.db', {
                verbose: console.log
            });

            const statement = db.prepare('UPDATE levels SET spawn = ? WHERE name = ?');
            var spawn = player.pos.x + " " + player.pos.y + " " + player.pos.z + " " + player.yaw + " " + player.pitch
            const updates = statement.run(spawn, "level")
        }
    })
}