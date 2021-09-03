# 简介
这是一个用来对对象进行验证的模块，其基础思路来自Formik推荐的Yup。
由于在使用Yup时发现其会将所有验证都执行一边，即使之前已发现有不匹配的地方，这将会导致与服务器有交互的验证被频繁触发。
所以我将其整理成了串行验证的模式，即对于任意一个值，只要验证不通过，即在此停止执行，并抛出异常。

该模块使用ES6的面向对像的方式构造，其基础模块为Schema，以下内容将对其进行详细说明，以及对于如何扩展进行概述。

其核心操作分为两类

- 检查操作，不会对匹配值产生变化，一般都会需要一个匹配失败的提示文本。
- 转换操作，可以修改改匹配值。

所有方法均可以链式操作。

# example
```
import { object, string } from "serialyup";
const schema = object({
  v1: string(),
  v2: string().when("v1", {
    is: "v1",
    then: string().matches(/v\d/, "when is v1 then"),
    otherwise: string().matches(/V\d/, "when not is v1 otherwise")
  })
});
schema.validate({ v1: "v1", v2: "v2" })
.then(value=>...)
.catch(error=>...)
```
如果想将其作为Formik的validationSchema参数，你还需要使用包中提供的YupCompatible来包装一下schema;
```
new YupCompatible(schema)
```

# 组件目录
 - [Schema](./doc/Schema.md) 基础验证对象
 - [String](./doc/String.md)
 - [Number](./doc/Number.md)
 - [Boolean](./doc/Boolean.md) 
 - [Object](./doc/Object.md) 
 - [Array](./doc/Array.md)
