<template>
  <el-dialog
    v-model="open"
    class="chunk-custom-dialog"
    :title="title"
    :width="width"
    append-to-body
  >
    <div class="chunk-content">
      <slot></slot>
    </div>
    <template #footer>
      <template v-if="$slots.footer">
        <slot name="footer"></slot>
      </template>
    </template>
  </el-dialog>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '标题',
  },
  width: {
    type: String,
    default: '600px',
  },
});
const open = defineModel({ required: true, default: '' });
</script>

<style lang="scss" scoped>
.chunk-content {
  padding: 24px;
}
</style>
