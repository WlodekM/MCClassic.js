import Vec3 from 'vec3'

export let player = (player, server) => {
    player._client.on('set_block', (packet) => {
        server.worlds[player.level].save().then(() => { console.log("saved level") })
        if (packet.mode === 0x01) {
            server.setBlock(new Vec3(packet.x, packet.y, packet.z), packet.block_type, player.level ?? 'main')
        } else if (packet.mode === 0x00) {
            server.destroyBlock(new Vec3(packet.x, packet.y, packet.z), player.level ?? 'main')
        }
    })
}

export let blockData = {
    Air: {
        id: 0,
        hex: 0x00,
    },
    Stone: {
        id: 1,
        hex: 0x01,
    },
    Grass: {
        id: 2,
        hex: 0x02,
    },
    Dirt: {
        id: 3,
        hex: 0x03,
    },
    // Air: {
    //     id: 0,
    //     hex: 0x00,
    // }
}

export let server = (server) => {
    server.setBlock = (coords, blockType, levelName) => {
        server.worlds[levelName].setBlock(new Vec3(coords.x, coords.y, coords.z), blockType)

        server._writeAll('set_block', {
            x: coords.x,
            y: coords.y,
            z: coords.z,
            block_type: blockType
        })
    }

    server.destroyBlock = (coords, levelName) => {
        server.worlds[levelName].setBlock(new Vec3(coords.x, coords.y, coords.z), 0)

        server._writeAll('set_block', {
            x: coords.x,
            y: coords.y,
            z: coords.z,
            block_type: 0
        })
    }
}