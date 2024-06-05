export const server = (server, settings) => {
    const methods = {
        AddCommand: function(player, server) {
            player.commands.add({
                base: 'nick',
                info: 'Allows you to change your name in chat.',
                usage: '/nick <nickname>',
                op: false,
                action(params) {
                    let message;
                    if (params.toString().split(' ')[0] !== null) message = params.toString();

                    server._writeAll('message', {
                        player_id: player.id,
                        message: `* ${player.username} ${message.split('%').join('&')}`
                    });
                }
            });
        }
    };

    // Directly use the methods if needed in the server function
    // Alternatively, you can keep the methods declaration and export it below
};

// Export methods as named export
export const methods = {
    AddCommand: function(player, server) {
        player.commands.add({
            base: 'nick',
            info: 'Allows you to change your name in chat.',
            usage: '/nick <nickname>',
            op: false,
            action(params) {
                let message;
                if (params.toString().split(' ')[0] !== null) message = params.toString();

                server._writeAll('message', {
                    player_id: player.id,
                    message: `* ${player.username} ${message.split('%').join('&')}`
                });
            }
        });
    }
};
