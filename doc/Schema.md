 
## Schema
基础验证对象
##### constructor 构造函数

参数|类型|默认值|说明
----|----|----|----
`isType`|                    function           |()=>true|判断类型是否匹配
`options`|                  object              |       {}|配置项
+ `nullAllow`|            boolean           |false|是否允许为null
+ `undefinedAllow` | boolean          |false|是否允许为 undefined

##### isType 验证对像类型
检查对像类型是否匹配

##### nullAllow 允许null
##### undefinedAllow 允许undefined

##### transform 添加类型转换器

参数|类型|默认值|说明
----|----|----|----
`convert`|async function(value)||转换函数
`prev`|boolean|false|是否前置转换器

##### test 新建检查点
参数|类型|默认值|说明
----|----|----|----
`name`|string|      |检查原因
`message`|string|   |未通过提示
`test`|async function(values,options)|检查函数
`prev`|boolean|false|是否前置检查点

##### validate 执行检查
参数|类型|默认值|说明
----|----|----|----
`values`|*|      |检查原因
`options`|object|   |未通过提示
+ `path`|string|""|路径
+ `values`|*|   |原始值
+ `preate`|*|   |父节点

##### when 联合检查
参数|类型|默认值|说明
----|----|----|----
`keys`|string<br/>array||联合检查点
`builder`|object||检查模式
+`is`|function(value)boolean<br/>array<br/>*||检查方法，<br/>如果是函数，则使用函数与匹配值，<br/>如果是数组，需要keys也是一个数组，以作为一一对应，<br/>如果是单个对象，则需要检查点的值都与之匹配
+`then`|Schema||匹配成功使用此匹配模式
+`otherwise`|Schema||匹配失败使用匹配模式

##### oneOfType 类型枚举检查
参数|类型|默认值|说明
----|----|----|----
`types`|Array<Schema>||匹配模式
`message`|String|"未知类型！"|匹配失败提示内容

##### oneOf 枚举检查
参数|类型|默认值|说明
----|----|----|----
`items`|Array< * ><br/> * || 枚举项
`message`|String|"未知值！"|匹配失败提示内容
`equals`|function(a,b)boolean|(a,b)=>a===b|比较函数
`name`|String|"oneOf"|检查原因

##### notOneOf 反向枚举检查
参数|类型|默认值|说明
----|----|----|----
`items`|Array< * ><br/> * || 枚举项
`message`|String|"禁用值！"|匹配失败提示内容
`equals`|function(a,b)boolean|(a,b)=>a===b|比较函数
`name`|String|"oneOf"|检查原因

##### required 非空判定
会按nullAllow与undefinedAllow的设置来综合判定是否这空

参数|类型|默认值|说明
----|----|----|----
`message`|String|"不可为空！"|匹配失败提示内容
`options`|Array|[]|认定为空值的对象

##### strip|remove 置空转换
会在经过此转换器时，将匹配值清空为undefined

##### default 设置默认值
会根据nullAllow与undefinedAllow的设置来决定是否使用入参数 `value`作为匹配值传递下去。
 - `value` 任意值

##### toBe 必须是某个值
要求对象必须是某个值

参数|类型|默认值|说明
----|----|----|----
`value`|*||匹配项
`message`|String|"不可为空！"|匹配失败提示内容

##### concat 级联验证
当一个对象因转换函数转为另一类型时，常会用到该方法，级联一个新的Schema进行验证。
- `schema`Schema级联的验证对象。

##### clone 克隆
由于使用的是对象化，所有的验证会使用同一个验证队列，当需要分离schea时，需要用到此方法。
