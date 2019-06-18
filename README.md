# Memory

Memory is the module that allows to easily store and share data between steps.
To start using memory just import corresponing class into your tests.

To get element from storage call parseValue() method with argument. If you pass simple string that parseValue reuturns it as is.
```javascript
const Memory = require("@cucumber-e2e/memory").Memory;
Memory.setValue("YourKey", "Your Value");
Memort.parseValue("$YourKey"); //"Your Value"
```

Moreover memory module implements several classes to define and store static constant and dynamical values

Define computed value
```javascript
const Memory = require("@cucumber-e2e/memory").Memory;
const AbstractComputedMap = require("@cucumber-e2e/memory").AbstractComputedMap;

class ComputedMap extends AbstractComputedMap {
    constructor() {
        super();
        this.defineComputed(/^FUNCTION$/, () => {
            return "value"
        });
    }
}
Memory.setComputedInstance(new ComputedMap()); //attach ComputedMap to Memory
Memory.parseValue("#FUNCTION"); //"value"
```

Define constant
```javascript
const Memory = require("@cucumber-e2e/memory").Memory;
const AbstractConstantMap = require("@cucumber-e2e/memory").AbstractConstantMap;

class ConstantMap extends AbstractConstantMap {
    constructor() {
        super();
        this.defineConstant("constantKey", "value");
        this.defineFileConstant("fileConstantKey", "./test/file.txt");
    }
}
Memory.setConstantsInstance(new ConstantMap()); attach ConstantMap to Memory
Memory.parseValue("!constantKey"); //"value"
Memory.parseValue("!!fileConstantKey"); // data from "./test/file.txt" file
```
