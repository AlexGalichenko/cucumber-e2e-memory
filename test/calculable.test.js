const Memory = require("../lib/Memory");
const AbstractComputedMap = require("../lib/AbstractComputedMap");

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
    expect(Memory.parseString("#FUNCTION")).toBe("value");
});

test("get calculable with 1 arguments", () => {
    class CalculablesMap extends AbstractComputedMap {
        constructor() {
            super();
            this.defineComputed(/GET_SAME_VALUE\(.+\)/, (a) => a);
        }
    }
    Memory.setComputedInstance(new CalculablesMap());
    expect(Memory.parseString("#GET_SAME_VALUE(value)")).toBe("value");
});

test("get calculable with 2 arguments", () => {
    class CalculablesMap extends AbstractComputedMap {
        constructor() {
            super();
            this.defineComputed(/CONCAT\(.+\)/, (a, b) => a + b);
        }
    }
    Memory.setComputedInstance(new CalculablesMap());
    expect(Memory.parseString("#CONCAT(str, ing)")).toBe("string");
});

test("parse string", () => {
    class CalculablesMap extends AbstractComputedMap {
        constructor() {
            super();
            this.defineComputed(/CONCAT\(.+\)/, (a, b) => a + b);
        }
    }
    Memory.setComputedInstance(new CalculablesMap());
    expect(Memory.parseString("string {#CONCAT(str, ing)} string")).toBe("string string string");
});

test("promise parse string", async () => {
    class CalculablesMap extends AbstractComputedMap {
        constructor() {
            super();
            this.defineComputed(/CONCAT\(.+\)/, (a, b) => Promise.resolve(a + b));
        }
    }
    Memory.setComputedInstance(new CalculablesMap());
    expect(await Memory.parseString("string {#CONCAT(str, ing)} string")).toBe("string string string");
});

test("get not defined calculable", () => {
    Memory.setComputedInstance(new AbstractComputedMap());
    function errorHandler() {
        Memory.parseString("#notDefinedKey")
    }
    expect(errorHandler).toThrowError("Computed notDefinedKey doesn't exist in memory");
});

test("get calculable when instance is not defined", () => {
    Memory.computedInstance = undefined;
    function errorHandler() {
        Memory.parseString("#notDefinedKey")
    }
    expect(errorHandler).toThrowError("Instance of computed is not defined");
});
