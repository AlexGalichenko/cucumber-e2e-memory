# Memory

Memory is the module that allows to easily store and share data between steps.
To start using memory just import corresponing class into your tests.

To get element from storage call getValue() method with argument. If you pass simple string that getValue will return it as is.
```javascript
const { Memory } = require("@cucumber-e2e/memory");
Memory.setValue("YourKey", "Your Value");
Memory.getValue("$YourKey"); //"Your Value"
```

You can also parse string and replace {memoryKey} patterns with memory values via parseString() method.
```javascript
const { Memory } = require("@cucumber-e2e/memory");
Memory.setValue("YourKey", "Your Value");
Memory.getValue("String with {$YourKey}"); //"String with Your Value"
```

Moreover memory module implements several classes to define and store static constant and dynamical values

Define computed value
```javascript
const { Memory } = require("@cucumber-e2e/memory");
const { ComputedMap } = require("@cucumber-e2e/memory");

class YourComputedMap extends ComputedMap {
    constructor() {
        super();
        this.defineComputed(/^FUNCTION$/, () => {
            return "value"
        });
    }
}
Memory.setComputedInstance(new YourComputedMap()); //attach ComputedMap to Memory
Memory.getValue("#FUNCTION"); //"value"
```

Define constant
```javascript
const { Memory } = require("@cucumber-e2e/memory");
const { ConstantMap } = require("@cucumber-e2e/memory");

class YourConstantMap extends ConstantMap {
    constructor() {
        super();
        this.defineConstant("constantKey", "value");
        this.defineFileConstant("fileConstantKey", "./test/file.txt");
    }
}
Memory.setConstantsInstance(new YourConstantMap()); //attach ConstantMap to Memory
Memory.getValue("!constantKey"); //"value"
Memory.getValue("!!fileConstantKey"); // data from "./test/file.txt" file
```
