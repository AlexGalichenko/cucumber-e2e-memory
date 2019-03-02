const Memory = require("./Memory");

/**
 * Class represneting Computed Map
 * @abstract
 * @type {AbstractComputedMap}
 */
class AbstractComputedMap {

    constructor() {
        this.computed = [];
    }

    /**
     * Define calculable value
     * @param {RegExp} signature - signature of calculable
     * @param {Function} lambda - function to calculate calculable
     * @example
     * class ComputedMap extends AbstractComputedMap {
     *   constructor() {
     *     super();
     *     this.defineCalculable(/^yourCalculable\(.+\)$/, args => {
     *       console.log(args);
     *     })
     *   }
     * }
     */
    defineComputed(signature, lambda) {
        this.computed.push(new Computed(signature, lambda))
    }

    /**
     * Get calculated value of defined computed
     * @param {string} signature - signature of computed value
     * @return {any} - calculated value
     */
    getComputed(signature) {
        const computed = this.computed.find(item => item.signature.test(signature));
        if (computed) {
            return computed.lambda(...this._getArguments(signature));
        } else {
            throw new Error(`Calculable ${signature} doesn't exist in memory`)
        }
    }

    /**
     * Parse signature and get arguments
     * @param {string} signature - signature to parse
     * @return {Array<String>}
     * @private
     */
    _getArguments(signature) {
        const PARSE_REGEXP = /^.+?\((.+)\)$/;
        const SPLIT_ARGS_REGEXP = /\s*,\s*/;
        if (PARSE_REGEXP.test(signature)) {
            return signature.match(PARSE_REGEXP)[1].split(SPLIT_ARGS_REGEXP)
        } else return []
    }

    /**
     * Assign map to memory
     * @example
     * class ComputedMap extends AbstractComputedMap {
     *   constructor() {
     *     super();
     *     this.defineComputed(/^numberOne$/, () => 1);
     *   }
     *}
     *
     * new ComputedMap.init();
     */
    init() {
        Memory.setComputedInstance(this);
    }

}

/**
 * Class representing Computed
 * @type {Computed}
 */
class Computed {

    /**
     * Constructor of computed
     * @param signature {RegExp} - signature of computed
     * @param lambda {Function} - function to calculate computed
     */
    constructor (signature, lambda) {
        this.signature = signature;
        this.lambda = lambda;
    }

}

module.exports = AbstractComputedMap;
