const Memory = require("../src/Memory");
const AbstractConstantMap = require("../src/AbstractConstantMap");

test("get constant variable", () => {
    class ConstantMap extends AbstractConstantMap {
        constructor() {
            super();
            this.defineConstant("constantKey", "value");
        }
    }
    Memory.setConstantsInstance(new ConstantMap());
    expect(Memory.parseValue("!constantKey")).toBe("value");
});

test("get file constant variable", () => {
    class ConstantMap extends AbstractConstantMap {
        constructor() {
            super();
            this.defineFileConstant("fileConstantKey", "./test/file.txt");
        }
    }
    Memory.setConstantsInstance(new ConstantMap());
    expect(Memory.parseValue("!!fileConstantKey")).toBe("file constant");
});

test("get not defined constant", () => {
    Memory.setConstantsInstance(new AbstractConstantMap());
    function errorHandler() {
        Memory.parseValue("!notDefinedKey")
    }
    expect(errorHandler).toThrowError("Constant notDefinedKey doesn't exist in memory");
});

test("get not defined constant", () => {
    Memory.setConstantsInstance(new AbstractConstantMap());
    function errorHandler() {
        Memory.parseValue("!!notDefinedKey")
    }
    expect(errorHandler).toThrowError("File constant notDefinedKey doesn't exist in memory");
});

test("get constant when instance is not defined", () => {
    Memory.constantsInstance = undefined;
    function errorHandler() {
        Memory.parseValue("!notDefinedKey")
    }
    expect(errorHandler).toThrowError("Instance of constants is not defined");
});

test("get file constant when instance is not defined", () => {
    Memory.constantsInstance = undefined;
    function errorHandler() {
        Memory.parseValue("!!notDefinedKey")
    }
    expect(errorHandler).toThrowError("Instance of constants is not defined");
});