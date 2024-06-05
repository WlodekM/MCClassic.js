import readline from "readline"

export let server = (server) => {
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    readlineInterface.on('line', (input) => {
        console.log("[Console] " + input.split('%').join('&'))
        server._writeAll('message', {
            player_id: 0,
            message: `&e[Console] &f${input.split('%').join('&')}`
        })
    });
}