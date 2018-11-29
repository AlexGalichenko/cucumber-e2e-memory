const Memory = require("../src/Memory");

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