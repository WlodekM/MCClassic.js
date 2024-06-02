module.exports = {
    /**
     * 
     * @param {*} player 
     * @param {*} server 
     */
    AddCommand: function(player, server) {
        server.commands.add({
            base: 'rq',
            info: 'RAGEQUIT!!',
            usage: '/rq',
            op: true,
            action(params) {
                player.disconnect('RAGEQUIT!!!')
            }
        })
    }
};