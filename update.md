# 1.0.2
 - 替换自定义类型验证方案，修改为使用第三方插件。
 - 修改编译工具，采用editions输出编译后的文件，而不再是使用webpack打包成一个压缩包。

# 1.0.4
 - 增加YupCompatible，用来对Yup错误消息做兼容。

# 1.0.5
 - 修复YupCompatible，输出数组异常时的没有正确处理的BUG
 - YupCompatible在根节点提供第一个错误信息

# 1.0.6
 - 修改string.matches的excludeEmptyString配置，在设置了excludeEmptyString为true后，string值现在可以是null,undefined和""

# 1.0.8
 - 删除了全部的async函数，以期望在babel之后体积可以缩小一点。
 - 添加了github相关的设置