
## <span id=string>StringSchema</span>
extends Schema
默认会使用空字符串作为验证value

##### matches 进行正则检查

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

##### required 必须选项
相对基类，新增加了“”为空匹配。

##### length,min,max长度检查
length，固定长度
min，最小长度
max，最大长度

参数|类型|默认值|说明
----|----|----|----
`limit`|number| |长度
`message`|String||匹配失败提示内容

##### email 邮箱格式检查
参数|类型|默认值|说明
----|----|----|----
`message`|String|"邮箱验证失败！"|匹配失败提示内容

##### url 网址格式检查
参数|类型|默认值|说明
----|----|----|----
`message`|String|"URL检查失败！"|匹配失败提示内容

##### ensure 使用空字符串，对空值进行替换

##### lowercase 执行小写变换

##### uppercase 执行大写变换

##### trim 对字符串进行trim
