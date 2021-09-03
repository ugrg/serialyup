## <span id=objecg>ObjectSchema</span>
extends Schema
option中，新增加了exact与exactMessage项，默认exact 为false。
当exact项为true时，则需要匹配项只能包含schema中定义过的属性。如果匹配失败，则会报出exactMessage错误消息。

##### shape 宽容检查
使用新的schemas来检查对象，并将检查模式设置为宽容模式。

参数|类型|默认值|说明
----|----|----|----
`schemas`|Schema||检查器

##### exact 严格模式
使用新的schemas来检查对象，并将检查模式设置为严格模式。

参数|类型|默认值|说明
----|----|----|----
`schemas`|Schema||检查器
`message`|String|"含有未被允许的属性"|取整方式

##### validate 执行检查
参数与基类一至。
需要注意的是，这时对每个属性是并行检查的，所以即使用了转换函数，在做when检查时，is部分得到的仍然是原始值。

