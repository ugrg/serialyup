## <span id=number>NumberSchema</span>
extends Schema
默认会将传入值进行数据转换

##### min 最小值检查（含）
参数|类型|默认值|说明
----|----|----|----
`limit`|number| |极值
`message`|String|`小于${limit}`|匹配失败提示内容

##### max 最大值检查（含）
参数|类型|默认值|说明
----|----|----|----
`limit`|number| |极值
`message`|String|`大于${limit}`|匹配失败提示内容

##### positive  正数数检查
参数|类型|默认值|说明
----|----|----|----
`message`|String|"必须为正数！"|匹配失败提示内容

##### negative  负数检查
参数|类型|默认值|说明
----|----|----|----
`message`|String|"必须为负数！"|匹配失败提示内容

##### integer  整型验证
参数|类型|默认值|说明
----|----|----|----
`message`|String|"必须整数！"|匹配失败提示内容


##### round 取整转换
取整一共分为round(四舍五入)，floor（向下取整），ceil（向上取整）

参数|类型|默认值|说明
----|----|----|----
`fn`|String|"round"|取整方式


##### required 必须选项
相对于基类，新增加了对NaN的判定。
