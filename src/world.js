import {
    readFile,
    writeFile,
    fstat,
    existsSync,
    writeFileSync,
    readFileSync,
} from 'fs'
import {
    gunzip,
    gzip
} from 'zlib'
import {
    promisify
} from 'util'

const [
    readFileAsync,
    writeFileAsync,
    gunzipAsync,
    gzipAsync
] = [
        promisify(readFile),
        promisify(writeFile),
        promisify(gunzip),
        promisify(gzip)
    ]

module.exports = class World {
    constructor(size, path = './levels/level.dat') {
        if(!existsSync(path.split(".dat").join(".json"))) writeFileSync(path.split(".dat").join(".json"), JSON.stringify({
            size: size ?? {
                x: 256,
                y: 64,
                z: 256
            },
            localChat: false,
        }))
        let config = JSON.parse(readFileSync(path.split(".dat").join(".json")))
        for (const key in config) {
            this[key] = config[key];
        }
        this.path = path
        this.data = Buffer.alloc(4 + size.x * size.y * size.z)
        this.data.fill(0)
        this.data.writeInt32BE(this.size.x * this.size.y * this.size.z, 0)
    }

    setBlock(pos, block) {
        this.data.writeUInt8(block, 4 + pos.x + this.size.z * (pos.z + this.size.x * pos.y))
    }

    getBlock(pos) {
        return this.data.readUInt8(4 + pos.x + this.size.z * (pos.z + this.size.x * pos.y))
    }

    dump() {
        return this.data
    }

    async load() {
        this.data = await gunzipAsync(await readFileAsync(this.path))
    }

    async save() {
        await writeFileAsync(this.path, await gzipAsync(this.data))
    }
}