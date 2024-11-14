<template>
  <div>
    <el-form
      ref="formRef"
      :rules="rules"
      :label-position="labelPosition"
      :label-width="labelWidth"
      :model="model"
      :inline="inline"
    >
      <el-row>
        <slot></slot>
      </el-row>
    </el-form>
  </div>
</template>
<script setup>
const props = defineProps({
  inline: {
    type: Boolean,
    default: false,
  },
  rules: {
    type: Object,
    default: () => {},
  },
  labelPosition: {
    type: String,
    default: 'left',
  },
  labelWidth: {
    type: String,
    default: '',
  },
  model: {
    type: Object,
    default: () => {},
  },
});

const formRef = ref(null);

defineExpose({ formRef });
</script>
