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


# Schema
基础验证对象
## constructor 构造函数

参数|类型|默认值|说明
----|----|----|----
`isType`|                    function           |()=>true|判断类型是否匹配
`options`|                  object              |       {}|配置项
+ `nullAllow`|            boolean           |false|是否允许为null
+ `undefinedAllow` | boolean          |false|是否允许为 undefined

## isType 验证对像类型
检查对像类型是否匹配

## nullAllow 允许null
## undefinedAllow 允许undefined

## transform 添加类弄转换器

参数|类型|默认值|说明
----|----|----|----
`convert`|async function(value)||转换函数
`prev`|boolean|false|是否前置转换器

## test 新建检查点
参数|类型|默认值|说明
----|----|----|----
`name`|string|      |检查原因
`message`|string|   |未通过提示
`test`|async function(values,options)|检查函数
`prev`|boolean|false|是否前置检查点

## validate 执行检查
参数|类型|默认值|说明
----|----|----|----
`values`|*|      |检查原因
`options`|object|   |未通过提示
+ `path`|string|""|路径
+ `values`|*|   |原始值
+ `preate`|*|   |父节点

## when 联合检查
参数|类型|默认值|说明
----|----|----|----
`keys`|string<br/>array||联合检查点
`builder`|object||检查模式
+`is`|function(value)boolean<br/>array<br/>*||检查方法，<br/>如果是函数，则使用函数与匹配值，<br/>如果是数组，需要keys也是一个数组，以作为一一对应，<br/>如果是单个对象，则需要检查点的值都与之匹配
+`then`|Schema||匹配成功使用此匹配模式
+`otherwise`|Schema||匹配失败使用匹配模式

## oneOfType 类型枚举检查
参数|类型|默认值|说明
----|----|----|----
`types`|Array<Schema>||匹配模式
`message`|String|"未知类型！"|匹配失败提示内容

## oneOf 枚举检查
参数|类型|默认值|说明
----|----|----|----
`items`|Array< * ><br/> * || 枚举项
`message`|String|"未知值！"|匹配失败提示内容
`equals`|function(a,b)boolean|(a,b)=>a===b|比较函数
`name`|String|"oneOf"|检查原因

## notOneOf 反向枚举检查
参数|类型|默认值|说明
----|----|----|----
`items`|Array< * ><br/> * || 枚举项
`message`|String|"禁用值！"|匹配失败提示内容
`equals`|function(a,b)boolean|(a,b)=>a===b|比较函数
`name`|String|"oneOf"|检查原因

## required 非空判定
会按nullAllow与undefinedAllow的设置来综合判定是否这空
参数|类型|默认值|说明
----|----|----|----
`message`|String|"不可为空！"|匹配失败提示内容
`options`|Array|[]|认定为空值的对象

## strip|remove 置空转换
会在经过此转换器时，将匹配值清空为undefined

## default 设置默认值
会根据nullAllow与undefinedAllow的设置来决定是否使用入参数 `value`作为匹配值传递下去。
 - `value` 任意值

## toBe 必须是某个值
要求对象必须是某个值

参数|类型|默认值|说明
----|----|----|----
`value`|*||匹配项
`message`|String|"不可为空！"|匹配失败提示内容

## concat 级联验证
当一个对象因转换函数转为另一类型时，常会用到该方法，级联一个新的Schema进行验证。
- `schema`Schema级联的验证对象。

## clone 克隆
由于使用的是对象化，所有的验证会使用同一个验证队列，当需要分离schea时，需要用到此方法。


# StringSchema
extends Schema
默认会使用空字符串作为验证value

## matches 进行正则检查

参数|类型|默认值|说明
----|----|----|----
`reg`|RegExp| |用来匹配的正则
`message`|String||匹配失败提示内容

参数|类型|默认值|说明
----|----|----|----
`reg`|RegExp| |用来匹配的正则
`options`|object||
+ message|String||匹配失败提示内容
+ excludeEmptyString|boolean|false|是否忽略空值
+ matchRule|boolean|true|匹配方向
+ name|String|"matches"|验证原因

## required 必须选项
相对基类，新增加了“”为空匹配。

## length,min,max长度检查
length，固定长度
min，最小长度
max，最大长度

参数|类型|默认值|说明
----|----|----|----
`limit`|number| |长度
`message`|String||匹配失败提示内容

## email 邮箱格式检查
参数|类型|默认值|说明
----|----|----|----
`message`|String|"邮箱验证失败！"|匹配失败提示内容

## url 网址格式检查
参数|类型|默认值|说明
----|----|----|----
`message`|String|"URL检查失败！"|匹配失败提示内容

## ensure 使用空字符串，对空值进行替换

## lowercase 执行小写变换

## uppercase 执行大写变换

## trim 对字符串进行trim

#NumberSchema
extends Schema
默认会将传入值进行数据转换

## min 最小值检查（含）
参数|类型|默认值|说明
----|----|----|----
`limit`|number| |极值
`message`|String|`小于${limit}`|匹配失败提示内容

## max 最大值检查（含）
参数|类型|默认值|说明
----|----|----|----
`limit`|number| |极值
`message`|String|`大于${limit}`|匹配失败提示内容

## positive  正数数检查
参数|类型|默认值|说明
----|----|----|----
`message`|String|"必须为正数！"|匹配失败提示内容

## negative  负数检查
参数|类型|默认值|说明
----|----|----|----
`message`|String|"必须为负数！"|匹配失败提示内容

## integer  整型验证
参数|类型|默认值|说明
----|----|----|----
`message`|String|"必须整数！"|匹配失败提示内容


##round 取整转换
取整一共分为round(四舍五入)，floor（向下取整），ceil（向上取整）
参数|类型|默认值|说明
----|----|----|----
`fn`|String|"round"|取整方式


## required 必须选项
相对于基类，新增加了对NaN的判定。

# BooleanSchema
extends Schema
会默认前置一个boolean转换

## isTrue，为true验证
参数|类型|默认值|说明
----|----|----|----
`message`|String|"必须是true"|取整方式

## isFalse, 为false验证
参数|类型|默认值|说明
----|----|----|----
`message`|String|"必须是false"|取整方式


# ObjectSchema
extends Schema
option中，新增加了exact与exactMessage项，默认exact 为false。
当exact项为true时，则需要匹配项只能包含schema中定义过的属性。如果匹配失败，则会报出exactMessage错误消息。

## shape 宽容检查
使用新的schemas来检查对象，并将检查模式设置为宽容模式。

参数|类型|默认值|说明
----|----|----|----
`schemas`|Schema||检查器

## exact 严格模式
使用新的schemas来检查对象，并将检查模式设置为严格模式。

参数|类型|默认值|说明
----|----|----|----
`schemas`|Schema||检查器
`message`|String|"含有未被允许的属性"|取整方式

## validate 执行检查
参数与基类一至。
需要注意的是，这时对每个属性是并行检查的，所以即使用了转换函数，在做when检查时，is部分得到的仍然是原始值。

# ArraySchema
extends Schema
默认会以空验证作为数组内部对像的验证逻辑
可以通过传入一个schema的方式，为数组内部对象进行检查。

## of 替换数组内部对象的校验器


## validate
参数与基类一至。
注意，这里对于数组中的每一项检查是并行的。

