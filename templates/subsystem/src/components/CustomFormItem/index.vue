<template>
  <el-col :span="span" class="chunk-col">
    <el-form-item :label="label" :prop="fieldName">
      <template v-if="$slots.default">
        <slot></slot>
      </template>
      <template v-else>
        <el-input v-if="type == 'input'" v-model="model" />
      </template>
    </el-form-item>
  </el-col>
</template>
<script setup>
const props = defineProps({
  // 表单字段文本
  label: {
    type: String,
    default: '',
  },
  //文本显示位置
  labelPosition: {
    type: String,
    default: 'left',
  },
  //字段名称
  fieldName: {
    type: String,
    default: '',
  },
  //表单字段域宽度，使用elementUIplus layout配置
  span: {
    type: Number,
    default: 24,
  },
  //表单字段类型
  type: {
    type: String,
    default: 'input',
  },
});

const model = defineModel({ required: true, default: '' });
</script>
<style lang="scss" scoped>
.chunk-col {
  padding: 0 5px;
}

:deep .el-form-item__label {
  font-size: 14px;
  font-weight: 500;
  color: #4b4b4b;
  text-align: right;
}
</style>
