const Memory = require("../lib/Memory");
const AbstractConstantMap = require("../lib/AbstractConstantMap");

test("define memory variable", () => {
    Memory.setValue("key", 1);

    expect(Memory.memory["key"]).toBe(1);
});

test("get memory variable", () => {
    Memory.setValue("key", "value");

    expect(Memory.parseValue("$key")).toBe("value");
});

test("pass simple value", () => {
    expect(Memory.parseValue("simpleValue")).toBe("simpleValue");
});

test("get not defined memory variable", () => {
    Memory.setValue("key", "init");
    function errorHandler() {
        Memory.parseValue("$notDefinedKey")
    }
    expect(errorHandler).toThrowError("notDefinedKey doesn't exist in memory");
});

test("get parsed string with var", () => {
    Memory.setValue("key", "value");

    expect(Memory.parseString("This is parsed string containing {$key} value"))
        .toBe("This is parsed string containing value value");
});

test("get parsed string with const", () => {
    class ConstantMap extends AbstractConstantMap {
        constructor() {
            super();
            this.defineConstant("constantKey", "value");
        }
    }
    Memory.setConstantsInstance(new ConstantMap());
    expect(Memory.parseString("This is parsed string containing {!constantKey} value"))
        .toBe("This is parsed string containing value value");
});
