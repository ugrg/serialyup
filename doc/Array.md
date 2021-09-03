## <span id=array>ArraySchema</span>
extends Schema
默认会以空验证作为数组内部对像的验证逻辑
可以通过传入一个schema的方式，为数组内部对象进行检查。

##### of 替换数组内部对象的校验器


##### validate
参数与基类一至。
注意，这里对于数组中的每一项检查是并行的。
