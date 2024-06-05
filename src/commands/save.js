export const AddCommand = function (player, server) {
    server.commands.add({
        base: 'save',
        info: 'save the world',
        usage: '/save',
        op: true,
        action() {
            player.chat('Saving...')
            server.worlds[player.level].save()
                .then(() => player.chat('Saved the world'))
                .catch(() => player.chat('Failed to save the world'))
        }
    })
}