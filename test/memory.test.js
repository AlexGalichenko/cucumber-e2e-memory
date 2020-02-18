const Memory = require("../lib/Memory");
const AbstractConstantMap = require("../lib/AbstractConstantMap");

test("define memory variable", () => {
    Memory.setValue("key", 1);

    expect(Memory.memory["key"]).toBe(1);
});

test("get memory variable", () => {
    Memory.setValue("key", "value");

    expect(Memory.getValue("$key")).toBe("value");
});

test("pass simple value", () => {
    expect(Memory.getValue("simpleValue")).toBe("simpleValue");
});

test("get not defined memory variable", () => {
    Memory.setValue("key", "init");
    function errorHandler() {
        Memory.getValue("$notDefinedKey")
    }
    expect(errorHandler).toThrowError("notDefinedKey doesn't exist in memory");
});

test("get parsed string with var", () => {
    Memory.setValue("key", "value");

    expect(Memory.getValue("This is parsed string containing {$key} value"))
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
    expect(Memory.getValue("This is parsed string containing {!constantKey} value"))
        .toBe("This is parsed string containing value value");
});

test("get parsed string with multiple variable", () => {
    Memory.setValue("firstKey", "firstValue");
    Memory.setValue("secondKey", "secondValue");
    Memory.setValue("thirdKey", "thirdValue");
    expect(Memory.getValue("This string should contain three values: {$firstKey}, {$secondKey}, {$thirdKey}."))
        .toBe("This string should contain three values: firstValue, secondValue, thirdValue.");
});
