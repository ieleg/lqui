module.exports = {
  // 环境
  env: {
    browser: true,
    // es2021: true,
    es6: true,
    commonjs: true,
    node: true,
  },
  // 配置解析器
  parserOptions: {
    ecmaVersion: 12,
    parser: 'babel-eslint',
  },
   // 配置扩展
 extends: [
    // eslint推荐规则
    // 'eslint:recommended',
    // // 标准js规则
    // 'standard',
    // vue eslint 基本规则
    'plugin:vue/base',
    // Vue eslint A级推荐规则预设
    'plugin:vue/essential',
    // Vue eslint B级推荐规则预设
    'plugin:vue/strongly-recommended',
    // Vue eslint C级推荐规则预设
    'plugin:vue/recommended',
  ],
  // 允许的全局变量预设
  globals: {
    // 如 lodash
    _: true,
  },
  // 这里可以设置规则：
  // "off" or 0 - 关闭规则
  // "warn" or 1 - 将规则作为警告打开（不影响退出代码）
  // "error" or 2 - 将规则作为错误打开（退出代码为1）
  rules: {
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
  }
 }
//  vue/custom-event-name-casing	执行自定义事件名称时始终使用 “kebab-case” 的命名方式	
//  vue/no-arrow-functions-in-watch	不允许使用箭头函数来定义观察者	
//  vue/no-async-in-computed-properties	在计算属性中不允许异步操作	
//  vue/no-custom-modifiers-on-v-model	不允许在组件上使用v-model上的自定义修饰符	
//  vue/no-dupe-keys	不允许重复字段名	
//  vue/no-dupe-v-else-if	不允许在v-if / v-else-if链中出现重复条件	
//  vue/no-duplicate-attributes	不允许重复属性	
//  vue/no-multiple-template-root	不允许向模板添加多个根节点	
//  vue/no-mutating-props	不允许组件props的突变	
//  vue/no-parsing-error	不允许在< template >中出现解析错误	
//  vue/no-reserved-keys	不允许覆盖保留键	
//  vue/no-shared-component-data	将组件的数据属性强制为函数 
//  vue/no-side-effects-in-computed-properties	不允许在计算属性中出现副作用	
//  vue/no-template-key	在< template >上禁用键属性	
//  vue/no-textarea-mustache	在< textarea >中不允许有inner	
//  vue/no-unused-components	不允许注册模板中未使用的组件	
//  vue/no-unused-vars	不允许v-for指令或范围属性的未使用变量定义	
//  vue/no-use-v-if-with-v-for	不允许在与v-for相同的元素上使用v-if	
//  vue/no-v-for-template-key	在< template v-for >上禁用键属性	
//  vue/no-v-model-argument	不允许向自定义组件中使用的 v-model 添加参数	
//  vue/require-component-is	需要v-bind:is 是< component >元素的	
//  vue/require-prop-type-constructor	需要prop类型为构造函数
//  vue/require-render-return	强制呈现函数始终返回值	
//  vue/require-v-for-key	需要v-bind:key与v-for指令	
//  vue/require-valid-default-prop	强制props默认值是有效的	
//  vue/return-in-computed-property	强制return语句出现在computed属性中	
//  vue/use-v-on-exact	在v-on上强制使用精确修饰符	
//  vue/valid-template-root	强制有效的模板根	
//  vue/valid-v-bind-sync	在v-bind指令上执行有效的.sync修饰符	
//  vue/valid-v-bind	执行有效的v-bind指令	
//  vue/valid-v-cloak	执行有效的v-cloak指令	
//  vue/valid-v-else-if	执行有效的v-else-if指令	
//  vue/valid-v-else	强制有效的v-else指令	
//  vue/valid-v-for	执行有效的v-for指令	
//  vue/valid-v-html	执行有效的v-html指令	
//  vue/valid-v-if	执行有效的 v-if 指令	
//  vue/valid-v-model	执行有效的 v-model 指令	
//  vue/valid-v-on	执行有效的 v-on 指令	
//  vue/valid-v-once	执行有效的 v-once 指令	
//  vue/valid-v-pre	执行有效的 v-pre 指令	
//  vue/valid-v-show	执行有效的 v-show 指令	
//  vue/valid-v-slot	执行有效的 v-slot 指令	
//  vue/valid-v-text	执行有效的 v-text 指令
