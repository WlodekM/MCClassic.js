export class Command {
    constructor(params, parent) {
        this.params = params
        this.parent = parent
        this.hash = parent ? parent.hash : {}
        this.uniqueHash = parent ? parent.uniqueHash : {}
        this.parentBase = (this.parent && this.parent.base && this.parent.base + ' ') || ''
        this.base = this.parentBase + (this.params.base || '')

        if (this.params.base) this.updateHistory()
    }

    find(command) {
        command = command.split('').splice(1).join('')

        const parts = command.split(' ')
        const c = parts.shift()
        const pars = parts.join(' ')

        if (this.hash[c]) return [this.hash[c], pars]
        return undefined
    }

    use(command) {
        const op = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1]
        let res = this.find(command)

        if (res) {
            let command = res[0]
            let pars = res[1]

            if (command.params.op && !op) return '&cYou do not have permission to use this command'
            const parse = command.params.parse

            if (parse) {
                if (typeof parse === 'function') {
                    pars = parse(pars)
                    if (pars === false) return `&cUsage: ${command.params.usage}`
                } else {
                    pars = pars.match(parse)
                }
            }

            res = command.params.action(pars)
            if (res) return `${res}`
        } else {
            return '&cUnknown command. Try /help for a list of commands'
        }
    }

    updateHistory() {
        const all = '(.+?)'
        const list = [this.base]
        if (this.params.aliases && this.params.aliases.length) this.params.aliases.forEach(al => list.unshift(this.parentBase + al))

        list.forEach((command) => {
            const parentBase = this.parent ? (this.parent.path || '') : ''
            this.path = parentBase + this.space() + (command || all)
            if (this.path === all && !this.parent) this.path = ''
            if (this.path) this.hash[this.path] = this
        })

        this.uniqueHash[this.base] = this
    }

    space(end) {
        const first = !(this.parent && this.parent.parent)
        return this.params.merged || (!end && first) ? '' : ' '
    }

    add(params) {
        return new Command(params, this)
    }

    setOp(op) {
        this.params.op = op
    }
}