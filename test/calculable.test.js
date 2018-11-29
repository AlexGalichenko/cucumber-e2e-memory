const Memory = require("../src/Memory");
const AbstractCalculablesMap = require("../src/AbstractCalculablesMap");

test("get calculable", () => {
    class CalculablesMap extends AbstractCalculablesMap {
        constructor() {
            super();
            this.defineCalculable(/FUNCTION/, () => {
                return "value"
            });
        }
    }
    Memory.setCalculablesInstance(new CalculablesMap());
    expect(Memory.parseValue("#FUNCTION")).toBe("value");
});

test("get calculable with arguments", () => {
    class CalculablesMap extends AbstractCalculablesMap {
        constructor() {
            super();
            this.defineCalculable(/GET_SAME_VALUE\(.+\)/, () => {
                return "value"
            });
        }
    }
    Memory.setCalculablesInstance(new CalculablesMap());
    expect(Memory.parseValue("#GET_SAME_VALUE(value)")).toBe("value");
});

test("get not defined calculable", () => {
    Memory.setCalculablesInstance(new AbstractCalculablesMap());
    function errorHandler() {
        Memory.parseValue("#notDefinedKey")
    }
    expect(errorHandler).toThrowError("Calculable notDefinedKey doesn't exist in memory");
});

test("get calculable when instance is not defined", () => {
    Memory.calculablesInstance = undefined;
    function errorHandler() {
        Memory.parseValue("#notDefinedKey")
    }
    expect(errorHandler).toThrowError("Instance of calculables is not defined");
});
