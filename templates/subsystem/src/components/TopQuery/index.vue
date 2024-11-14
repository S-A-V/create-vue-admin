<template>
  <div class="chunk-main">
    <el-row style="align-items: flex-start">
      <el-col
        ref="testRef"
        :span="16"
        :style="{ maxHeight: expanded ? '500px' : _height }"
        class="chunk-query-form"
      >
        <!-- 查询表单插槽 -->
        <slot name="form"></slot>
      </el-col>
      <el-col :span="8" class="chunk-btns">
        <el-button :icon="expanded ? 'ArrowUp' : 'ArrowDown'" @click="handleExpand">
          {{ expanded ? '收起' : '更多筛选' }}
        </el-button>

        <el-button
          v-if="showSearch"
          v-permission="searchPermission"
          type="primary"
          icon="Search"
          @click="handleQuery"
          >查询
        </el-button>

        <el-button v-if="showAdd" v-permission="addPermission" icon="Plus" @click="handleAdd">
          新增
        </el-button>

        <el-button v-if="showEdit" v-permission="editPermission" icon="Edit" @click="handleUpdate">
          修改
        </el-button>

        <el-button
          v-if="showDelete"
          v-permission="deletePermission"
          type="danger"
          plain
          icon="Delete"
          @click="handleDelete"
          >删除
        </el-button>
        <el-button
          v-if="showImport"
          v-permission="importPermission"
          type="info"
          plain
          icon="Upload"
          @click="handleImport"
          >导入
        </el-button>
        <el-button
          v-if="showExport"
          v-permission="exportPermission"
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          >导出
        </el-button>

        <!-- 自定义按钮插槽 -->
        <slot name="button"></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Cookies from 'js-cookie';
import { computed, reactive } from 'vue';

const props = defineProps({
  //自定义查询表单默认高度,适用特殊情况，比如表单项标签文本在上面时
  queryFormHeight: {
    type: Object,
    default: null,
  },
  //显示查询按钮
  showSearch: {
    type: Boolean,
    default: true,
  },
  //查询按钮权限
  searchPermission: {
    type: Array,
    default: () => ['*:*:*'],
  },
  //显示新增按钮
  showAdd: {
    type: Boolean,
    default: true,
  },
  //新增按钮权限
  addPermission: {
    type: Array,
    default: () => ['*:*:*'],
  },
  //显示修改按钮
  showEdit: {
    type: Boolean,
    default: true,
  },
  //查询按钮权限
  editPermission: {
    type: Array,
    default: () => ['*:*:*'],
  },
  //显示删除按钮
  showDelete: {
    type: Boolean,
    default: true,
  },
  //删除按钮权限
  deletePermission: {
    type: Array,
    default: () => ['*:*:*'],
  },
  //显示导入按钮
  showImport: {
    type: Boolean,
    default: true,
  },
  //导入按钮权限
  importPermission: {
    type: Array,
    default: () => ['*:*:*'],
  },
  //显示导出按钮
  showExport: {
    type: Boolean,
    default: true,
  },
  //导出按钮权限
  exportPermission: {
    type: Array,
    default: () => ['*:*:*'],
  },
});

const queryForm = reactive({});
const expanded = ref(false);

const _height = computed(() => {
  let size = Cookies.get('size') || 'default';
  let queryHeight = props.queryFormHeight?.default || '45px';

  switch (size) {
    case 'large':
      queryHeight = props.queryFormHeight?.large || '56px';
      break;
    case 'small':
      queryHeight = props.queryFormHeight?.small || '40px';
      break;
  }
  return queryHeight;
});

const testRef = ref(null);

const emit = defineEmits(['btnEvent', 'add', 'edit', 'delete', 'import', 'export']);

//点击查询
function handleQuery() {
  emit('btnEvent', { type: 'search', data: queryForm });
}

//点击新增
function handleAdd() {
  emit('btnEvent', { type: 'add' });
}

//点击编辑
function handleUpdate() {
  emit('btnEvent', { type: 'edit' });
}

//点击删除
function handleDelete() {
  emit('btnEvent', { type: 'delete' });
}

//点击导入
function handleImport() {
  emit('btnEvent', { type: 'import' });
}

//点击导出
function handleExport() {
  emit('btnEvent', { type: 'export' });
}

//展开搜索
function handleExpand() {
  expanded.value = !expanded.value;
}
</script>

<style lang="scss" scoped>
.chunk-main {
  padding: 12px;
  background-color: #fff;

  .chunk-query-form {
    overflow: hidden;
    transition: max-height 0.5s;
  }
}

.chunk-btns {
  padding: 0 10px;

  ::v-deep .el-button {
    margin-right: 12px;
    margin-bottom: 18px;
    margin-left: 0;
  }
}
</style>
