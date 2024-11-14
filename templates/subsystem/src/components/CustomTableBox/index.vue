<template>
  <div class="chunk-box">
    <div v-if="$slots.left" class="chunk-box-left" :style="{ width: leftWidth }">
      <slot name="left"></slot>
    </div>
    <div class="chunk-box-middle">
      <slot></slot>
    </div>
    <div v-if="$slots.right" class="chunk-box-right" :style="{ width: rightWidth }">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  leftWidth: {
    type: String,
    default: '600px',
  },
  rightWidth: {
    type: String,
    default: '600px',
  },
});
</script>

<style lang="scss" scoped>
.chunk-box {
  display: flex;

  &-left {
    flex-shrink: 0;
    border: 1px solid #e3dede;
  }

  &-middle {
    flex: 1;
    flex-shrink: 0;
    border: 1px solid #e3dede;
  }

  &-right {
    flex-shrink: 0;
    border: 1px solid #e3dede;
  }
}
</style>
