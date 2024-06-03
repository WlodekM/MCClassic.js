import World from '../world'
import Vec3 from 'vec3'
import fs from 'fs'

export let server = async (server) => {
    server.worlds = {}
    // server.worlds.main = new World({
    //     x: 256,
    //     y: 64,
    //     z: 256
    // }, './levels/level.dat')

    let levels = fs.readdirSync("levels")

    levels.forEach((a, i) => {
        if(!a.endsWith(".dat")) return;
        console.log("found level " + a, `path: ./levels/${a}`)
        server.worlds[a.replace('.dat', '')] = new World({
            x: 256,
            y: 64,
            z: 256
        }, `./levels/${a}`)
    })


    function loadLevel(levelName) {
        server.worlds[levelName].load()
            .then(() => { })
            .catch(async () => {
                for (let x = 0; x < server.worlds[levelName].size.x; x++) {
                    for (let y = 0; y <= (server.worlds[levelName].size.y / 2); y++) {
                        for (let z = 0; z < server.worlds[levelName].size.z; z++) {
                            if (y === 0) {
                                server.worlds[levelName].setBlock(new Vec3(x, y, z), 0x07)
                            } else if (y <= (server.worlds[levelName].size.y / 2) - 4) {
                                server.worlds[levelName].setBlock(new Vec3(x, y, z), 0x01)
                            } else if (y <= (server.worlds[levelName].size.y / 2) - 1) {
                                server.worlds[levelName].setBlock(new Vec3(x, y, z), 0x03)
                            } else if (y === (server.worlds[levelName].size.y / 2)) {
                                server.worlds[levelName].setBlock(new Vec3(x, y, z), 0x02)
                            }
                        }
                    }
                }

                await server.worlds[levelName].save()
            })
    }

    loadLevel('main')
}