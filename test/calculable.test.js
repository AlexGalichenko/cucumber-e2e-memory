const Memory = require("../src/Memory");
const AbstractComputedMap = require("../src/AbstractComputedMap");

test("get calculable", () => {
    class ComputedMap extends AbstractComputedMap {
        constructor() {
            super();
            this.defineComputed(/FUNCTION/, () => {
                return "value"
            });
        }
    }
    Memory.setComputedInstance(new ComputedMap());
    expect(Memory.parseValue("#FUNCTION")).toBe("value");
});

test("get calculable with 1 arguments", () => {
    class CalculablesMap extends AbstractComputedMap {
        constructor() {
            super();
            this.defineComputed(/GET_SAME_VALUE\(.+\)/, (a) => a);
        }
    }
    Memory.setComputedInstance(new CalculablesMap());
    expect(Memory.parseValue("#GET_SAME_VALUE(value)")).toBe("value");
});

test("get calculable with 2 arguments", () => {
    class CalculablesMap extends AbstractComputedMap {
        constructor() {
            super();
            this.defineComputed(/CONCAT\(.+\)/, (a, b) => a + b);
        }
    }
    Memory.setComputedInstance(new CalculablesMap());
    expect(Memory.parseValue("#CONCAT(str, ing)")).toBe("string");
});

test("get not defined calculable", () => {
    Memory.setComputedInstance(new AbstractComputedMap());
    function errorHandler() {
        Memory.parseValue("#notDefinedKey")
    }
    expect(errorHandler).toThrowError("Calculable notDefinedKey doesn't exist in memory");
});

test("get calculable when instance is not defined", () => {
    Memory.computedInstance = undefined;
    function errorHandler() {
        Memory.parseValue("#notDefinedKey")
    }
    expect(errorHandler).toThrowError("Instance of calculables is not defined");
});
