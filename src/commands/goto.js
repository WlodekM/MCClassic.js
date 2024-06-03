import fs from "fs"
import zlib from 'zlib'

export const AddCommand = function (player, server) {
    server.commands.add({
        base: 'goto',
        info: 'go to a diffrent level',
        usage: '/goto <levelName>',
        op: true,
        action(params) {
            if (params.length === 0) return `${server.color.red}No arguments specified.`

            // console.log(JSON.stringify(params))

            if (typeof params == "string") params = [params]

            try {
                if (!fs.existsSync(`./levels/${params[0]}.dat`)) return `${server.color.red}Level ${params[0]} not found`
            } catch (error) {
                return `${server.color.red}Level not found`
            }

            player.level = params[0]
            player._client.write('level_initialize', {})
            console.log(server.worlds[player.level].dump())

            const compressedMap = zlib.gzipSync(server.worlds[player.level].dump())

            for (let i = 0; i < compressedMap.length; i += 1024) {
                console.log(i, compressedMap.length, compressedMap.slice(i, Math.min(i + 1024, compressedMap.length)))
                player._client.write('level_data_chunk', {
                    chunk_data: compressedMap.slice(i, Math.min(i + 1024, compressedMap.length)),
                    percent_complete: i === 0 ? 0 : Math.ceil(i / compressedMap.length * 100)
                })
            }

            // Send env settings to the client

            // player.sendEnvColor = function sendEnvColor(variable, r, g, b) {
            //     player._client.write('env_set_color', {
            //         variable: variable,
            //         red: r,
            //         green: g,
            //         blue: b
            //     })
            // }

            player._client.write('level_finalize', {
                x_size: server.worlds[player.level].size.x,
                y_size: server.worlds[player.level].size.y,
                z_size: server.worlds[player.level].size.z,
            })
            // player.spawn()
        }
    })
}
