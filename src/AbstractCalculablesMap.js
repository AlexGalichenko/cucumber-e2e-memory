const Memory = require("./Memory");

/**
 * Class represneting Calculable Map
 * @abstract 
 * @type {AbstractCalculablesMap}
 */
class AbstractCalculablesMap {

    constructor() {
        this.calculables = [];
    }

    /**
     * Define calculable value
     * @param {RegExp} signature - signature of calculable
     * @param {Function} lambda - function to calculate calculable
     * @example 
     * class CalculablesMap extends AbstractCalculablesMap {
     *   constructor() {
     *     super();
     *     this.defineCalculable(/^yourCalculable\(.+\)$/, args => {
     *       console.log(args);
     *     })
     *   }
     * }
     */
    defineCalculable(signature, lambda) {
        this.calculables.push(new Calculable(signature, lambda))
    }

    /**
     * Get calculated value of defined calculable
     * @param {string} signature - signature of calculable value
     * @return {any} - calculated value
     */
    getCalculable(signature) {
        const calculable = this.calculables.find(item => item.signature.test(signature));
        if (calculable) {
            return calculable.lambda(...this._getArguments(signature));
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
     * class CalculablesMap extends AbstractCalculablesMap {
     *   constructor() {
     *     super();
     *     this.defineCalculable(/^numberOne$/, () => 1);
     *   }
     *}
     *
     * new CalculablesMap.init();
     */
    init() {
        Memory.setCalculablesInstance(this);
    }

}

/**
 * Class representing Calculable
 * @type {Calculable}
 */
class Calculable {

    /**
     * Constructor of calculable
     * @param signature {RegExp} - signature of calculable
     * @param lambda {Function} - function to calculate calculable
     */
    constructor (signature, lambda) {
        this.signature = signature;
        this.lambda = lambda;
    }

}

module.exports = AbstractCalculablesMap;