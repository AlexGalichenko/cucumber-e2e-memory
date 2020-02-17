/**
 * Class representing Memory
 * @type {Memory}
 */
class Memory {

    /**
     * Set calculable instance
     * @example Memory.setComputedInstance(new yourComputedInstance())
     * @param {AbstractComputedMap} computedInstance - instance of computed map
     */
    static setComputedInstance(computedInstance) {
        this.computedInstance = computedInstance;
    }

    /**
     * Set constant instance
     * @example Memory.setConstantsInstance(new yourConstantsInstance())
     * @param {AbstractConstantMap} constantsInstance - instance of constants map
     */
    static setConstantsInstance(constantsInstance) {
        this.constantsInstance = constantsInstance;
    }

    /**
     * Bind value to memory class
     * @param {string} key - key
     * @param {*} value - value
     * @example Memory.setValue("key", 1)
     */
    static setValue(key, value) {
        if (!this.memory) {
            this.memory = {}
        }

        this.memory[key] = value;
    }

    /**
     * Returns value if exists in memory
     * @private
     * @param {string} key - key
     * @return {string|number|Object} - parsed value
     * @throws {Error}
     * @example Memory.parseValue("$key")
     */
    static parseValue(key) {
        const MEMORY_REGEXP = /^(\$|#|!{1,2})?([^$#!]?.+)$/;

        if (MEMORY_REGEXP.test(key)) {
            const [_, prefix, parsedKey] = key.match(MEMORY_REGEXP);
            switch (prefix) {
                case "$": return this._getMemoryValue(parsedKey);
                case "#": return this._getComputedValue(parsedKey);
                case "!": return this._getConstantValue(parsedKey);
                case "!!": return this._getFileConstantValue(parsedKey);
                case undefined: return parsedKey;
                default: throw new Error(`${parsedKey} is not defined`)
            }
        } else {
            return key
        }
    }

    /**
     * Replace param templates withing string with their values
     * @param {string} str - string to parse
     * @return {string|Promise<string>} - parsed
     */
    static parseString(str) {
        const MEMORY_REGEXP = /^(\$|#|!{1,2})?([^$#!]?.+)$/;
        const PARSE_STRING_REGEXP = /{((?:\$|#|!{1,2})?(?:[^$#!]?.+?))}/g;
        if (MEMORY_REGEXP.test(str)) {
            return this.parseValue(str)
        } 
        else if (PARSE_STRING_REGEXP.test(str)) {
            const matches = str.match(PARSE_STRING_REGEXP).map(match => match.replace(/{|}/g, ``));
            if (matches.some(alias => this.parseValue(alias) instanceof Promise)) {
                const promises = matches.map(alias => this.parseValue(alias));
                return Promise
                    .all(promises)
                    .then(pmatches => pmatches
                        .map((match, i) => ({
                            alias: matches[i],
                            value: match
                        }))
                        .reduce((string, variable) => string.replace(`{${variable.alias}}`, variable.value), str))
                    .catch(e => {
                        throw e
                    })
            } 
            else return matches.reduce((string, variable) => string.replace(`{${variable}}`, this.parseValue(variable)), str);
        }
        else return str
    }

    /**
     * Return value from memory
     * @param {string} alias - key
     * @return {string|number|Object} - value by key
     * @private
     */
    static _getMemoryValue(alias) {
        if (this.memory[alias] !== undefined) {
            return this.memory[alias];
        } else {
            throw new Error(`Value ${alias} doesn't exist in memory`)
        }
    }

    /**
     * Return calculated value
     * @param {string} alias - key
     * @return {string|number|Object} - value by key
     * @private
     */
    static _getComputedValue(alias) {
        if (this.computedInstance) {
            return this.computedInstance.getComputed(alias)
        }
        else throw new Error(`Instance of computed is not defined`)
    }

    /**
     * Return constant value
     * @param {string} key - key
     * @return {string|number|Object} - value by key
     * @private
     */
    static _getConstantValue(key) {
        if (this.constantsInstance) {
            return this.constantsInstance.getConstant(key)
        }
        else throw new Error(`Instance of constants is not defined`)
    }

    /**
     * Return file constant value
     * @param {string} key - key
     * @return {string|Buffer} - value by key
     * @private
     */
    static _getFileConstantValue(key) {
        if (this.constantsInstance) {
            return this.constantsInstance.getFileConstant(key)
        }
        else throw new Error(`Instance of constants is not defined`)
    }

}

module.exports = Memory;
