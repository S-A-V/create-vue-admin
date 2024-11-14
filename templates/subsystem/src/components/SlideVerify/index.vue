<template>
  <div
    id="slideVerify"
    class="slide-verify"
    :style="{ width: w + 'px' }"
    onselectstart="return false;"
  >
    <Transition>
      <div v-show="showCanvas" class="pic-wrapper">
        <!-- 图片加载遮蔽罩 -->
        <div :class="{ 'slider-verify-loading': loadBlock }"></div>
        <canvas ref="canvas" :width="w" :height="h"></canvas>
        <!-- <div v-if="show" class="slide-verify-refresh-icon" @click="refresh">
          <i class="iconfont icon-refresh"></i>
        </div> -->
        <div class="slide-verify-cutdown">{{ seconds }}s</div>
        <canvas ref="block" :width="w" :height="h" class="slide-verify-block"></canvas>
      </div>
    </Transition>
    <!-- container -->
    <div
      class="slide-verify-slider"
      :class="{
        'container-active': containerCls.containerActive,
        'container-success': containerCls.containerSuccess,
        'container-fail': containerCls.containerFail,
      }"
    >
      <div class="slide-verify-slider-mask" :style="{ width: sliderBox.width }">
        <!-- slider -->
        <div
          class="slide-verify-slider-mask-item"
          :style="{ left: sliderBox.left }"
          @mousedown="sliderDown"
          @touchstart="touchStartEvent"
          @touchmove="touchMoveEvent"
          @touchend="touchEndEvent"
          @mouseenter="initCanvas"
          @mouseleave="destoryCanvas"
        >
          <i
            :class="['slide-verify-slider-mask-item-icon', 'iconfont', `icon-${sliderBox.iconCls}`]"
          ></i>
        </div>
      </div>
      <span class="slide-verify-slider-text">{{ sliderText }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, onMounted, onBeforeUnmount } from 'vue';
import { useSlideAction } from './hooks/index';
import { debounce } from '@way-ui/utils/index';
import { createImg, draw, getRandomImg, getRandomNumberByRange, throttle } from './util.js';

export default defineComponent({
  name: 'SlideVerify',
  props: {
    // block length
    l: {
      type: Number,
      default: 42,
    },
    // block radius
    r: {
      type: Number,
      default: 10,
    },
    // canvas width
    w: {
      type: Number,
      default: 314,
    },
    // canvas height
    h: {
      type: Number,
      default: 155,
    },
    sliderText: {
      type: String,
      default: '向右拖动滑块完成验证',
    },
    accuracy: {
      type: Number,
      default: 5, // 若为 -1 则不进行机器判断
    },
    show: {
      type: Boolean,
      default: true,
    },
    interval: {
      // 节流时长间隔
      type: Number,
      default: 50,
    },
  },
  emits: ['success', 'again', 'fail', 'refresh', 'begin'],
  setup(props, { emit }) {
    const { l, r, w, h, accuracy, interval } = props;
    // 图片加载完关闭遮蔽罩
    const loadBlock = ref(true);
    const blockX = ref(0);
    const blockY = ref(0);
    // class
    const containerCls = reactive({
      containerActive: false, // container active class
      containerSuccess: false, // container success class
      containerFail: false, // container fail class
    });
    // sliderMaskWidth sliderLeft
    const sliderBox = reactive({
      iconCls: 'arrow-right',
      width: '0',
      left: '0',
    });

    const block = ref();
    const blockCtx = ref();
    const canvas = ref();
    const canvasCtx = ref();
    let img;
    const { success, start, move, end, verify, isMouseDown } = useSlideAction();
    const seconds = ref(30);
    let cutdownTimeId = -1;
    //倒计时
    const refreshCutdown = () => {
      seconds.value = 50;
      clearTimeout(cutdownTimeId);

      cutdownTimeId = setInterval(() => {
        if (seconds.value <= 1) {
          refreshCutdown();
          reset();
        } else {
          seconds.value -= 1;
        }
      }, 1000);
    };
    // event
    const reset = () => {
      success.value = false;
      containerCls.containerActive = false;
      containerCls.containerSuccess = false;
      containerCls.containerFail = false;
      sliderBox.iconCls = 'arrow-right';
      sliderBox.left = '0';
      sliderBox.width = '0';

      block.value.style.left = '0';
      canvasCtx.value?.clearRect(0, 0, w, h);
      blockCtx.value?.clearRect(0, 0, w, h);
      block.value.width = w;

      // generate img
      img.src = getRandomImg();
    };

    const refresh = () => {
      reset();
      emit('refresh');
    };

    function moveCb(moveX) {
      sliderBox.left = moveX + 'px';
      let blockLeft = ((w - 40 - 20) / (w - 40)) * moveX;
      block.value.style.left = blockLeft + 'px';

      containerCls.containerActive = true;
      sliderBox.width = moveX + 'px';
    }

    function endCb(timestamp) {
      const { spliced, TuringTest } = verify(block.value.style.left, blockX.value, accuracy);
      showCanvas.value = false;
      clearTimeout(cutdownTimeId);

      if (spliced) {
        if (accuracy === -1) {
          containerCls.containerSuccess = true;
          sliderBox.iconCls = 'success';
          success.value = true;
          emit('success', timestamp);
          return;
        }
        if (TuringTest) {
          // success
          containerCls.containerSuccess = true;
          sliderBox.iconCls = 'success';
          success.value = true;
          emit('success', timestamp);
        } else {
          containerCls.containerFail = true;
          sliderBox.iconCls = 'fail';
          emit('again');
        }
      } else {
        containerCls.containerFail = true;
        sliderBox.iconCls = 'fail';
        emit('fail');
        setTimeout(() => {
          reset();
        }, 1000);
      }
    }

    const touchMoveEvent = throttle((e) => {
      move(w, e, moveCb);
    }, interval);

    const touchEndEvent = (e) => {
      end(e, endCb);
    };
    const showCanvas = ref(false);
    const initCanvas = () => {
      if (!success.value && !showCanvas.value) {
        showCanvas.value = true;
        refreshCutdown();

        emit('begin');
      }
    };
    const debounceReset = debounce(() => {
      reset();
    }, 500);
    const destoryCanvas = () => {
      if (isMouseDown.value || success.value) return;
      showCanvas.value = false;
      clearTimeout(cutdownTimeId);
      debounceReset();
    };
    onMounted(() => {
      const _canvasCtx = canvas.value?.getContext('2d');
      const _blockCtx = block.value?.getContext('2d');
      canvasCtx.value = _canvasCtx;
      blockCtx.value = _blockCtx;

      img = createImg(() => {
        loadBlock.value = false;
        const L = l + r * 2 + 3;
        // draw block
        blockX.value = getRandomNumberByRange(L + 10, w - (L + 10));
        blockY.value = getRandomNumberByRange(10 + r * 2, h - (L + 10));
        if (_canvasCtx && _blockCtx) {
          draw(_canvasCtx, blockX.value, blockY.value, l, r, 'fill');
          draw(_blockCtx, blockX.value, blockY.value, l, r, 'clip');
          // draw image
          _canvasCtx.drawImage(img, 0, 0, w, h);
          _blockCtx.drawImage(img, 0, 0, w, h);
          // getImage
          const _y = blockY.value - r * 2 - 1;
          const imgData = _blockCtx.getImageData(blockX.value, _y, L, L);
          block.value.width = L;
          _blockCtx.putImageData(imgData, 0, _y);
        }
      });

      // bindEvent
      document.addEventListener('mousemove', touchMoveEvent);
      document.addEventListener('mouseup', touchEndEvent);
    });

    // 移除全局事件
    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', touchMoveEvent);
      document.removeEventListener('mouseup', touchEndEvent);
    });

    return {
      block,
      canvas,
      loadBlock,
      containerCls,
      sliderBox,
      refresh,
      sliderDown: start,
      touchStartEvent: start,
      touchMoveEvent,
      touchEndEvent,
      showCanvas,
      initCanvas,
      destoryCanvas,
      seconds,
    };
  },
});
</script>

<style scoped lang="scss">
@import './assets/style/iconfont.css';

@mixin position() {
  position: absolute;
  top: 0;
  left: 0;
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.pic-wrapper {
  position: absolute;
  transform: translateY(-100%);
}

.slide-verify {
  position: relative;

  &-loading {
    @include position;

    right: 0;
    bottom: 0;
    z-index: 999;
    background: rgb(255 255 255 / 90%);
    animation: loading 1.5s infinite;
  }

  &-block {
    @include position;
  }

  &-refresh-icon {
    position: absolute;
    top: 0;
    right: 0;
    width: 34px;
    height: 34px;
    cursor: pointer;

    .iconfont {
      font-size: 28px;
      color: #fff;
    }
  }

  &-cutdown {
    position: absolute;
    top: 0;
    right: 0;
    width: 34px;
    height: 34px;
    font-size: 20px;
    color: #fff;
  }

  &-slider {
    position: relative;
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #45494c;
    text-align: center;
    background: #f7f9fa;
    border: 1px solid #e4e7eb;

    &-mask {
      @include position;

      height: 40px;
      background: #d1e9fe;
      border: 0 solid #1991fa;

      &-item {
        @include position;

        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        cursor: pointer;
        background: #fff;
        box-shadow: 0 0 3px rgb(0 0 0 / 30%);
        transition: background 0.2s linear;

        &:hover {
          background: var(--el-color-primary);

          .iconfont {
            color: #fff;
          }
        }

        &-icon {
          font-size: 24px;
          line-height: 1;
          color: #303030;
        }
      }
    }
  }
}

.container-active .slide-verify-slider-mask {
  height: 38px;
  border-width: 1px;

  &-item {
    top: -1px;
    height: 38px;
    border: 1px solid #1991fa;
  }
}

.container-success .slide-verify-slider-mask {
  height: 38px;
  background-color: #d2f4ef;
  border: 1px solid #52ccba;

  &-item {
    top: -1px;
    height: 38px;
    background-color: #52ccba !important;
    border: 1px solid #52ccba;
  }

  .iconfont {
    color: #fff;
  }
}

.container-fail .slide-verify-slider-mask {
  height: 38px;
  background-color: #fce1e1;
  border: 1px solid #f57a7a;

  &-item {
    top: -1px;
    height: 38px;
    background-color: #f57a7a !important;
    border: 1px solid #f57a7a;
  }

  .iconfont {
    color: #fff;
  }
}

.container-active .slide-verify-slider-text,
.container-success .slide-verify-slider-text,
.container-fail .slide-verify-slider-text {
  display: none;
}

@keyframes loading {
  0% {
    opacity: 0.7;
  }

  100% {
    opacity: 9;
  }
}
</style>
