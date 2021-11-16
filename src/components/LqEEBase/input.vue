<template>
  <div :class="['base']">
    <div ref="textRef" class="base-text" @click="handleInitClick">
      {{ text }}
    </div>
    <transition name="fade" mode="out-in" :duration="100">
      <div
        v-if="status === 'init'"
        key="init"
        class="base-icon"
        @click="handleInitClick"
      >
        <i class="el-icon-caret-bottom" />
      </div>
      <div v-else-if="status === 'query'" key="query" class="base-query">
        <el-input
          ref="inputRef"
          v-model="bindValue"
          size="mini"
          v-bind="$props"
          @keyup.enter.native="handleQuery"
          @blur="handleQuery"
        />
      </div>
      <div
        v-else
        key="tag"
        class="base-tag"
        @click="handleTag"
      >
        <el-tag
          closable
          type="info"
          size="mini"
          @close="handleClear"
        >
          {{ bindValue }}
        </el-tag>
      </div>
    </transition>
    <!-- <div></div> -->
  </div>
</template>
<script>
export default {
  props: {
    ...["disabled", "placeholder", "maxlength"].reduce((pre, cur) => {
      pre[cur] = {}
      return pre
    }, {}),
    value: {
      type: String,
      default: "",
      requied: true
    },
    text: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      status: "init",
      bindValue: null,
      // 单选且无模糊搜索的标识
      singleNoFuzzy: false
    }
  },
  computed: {
    valueCompute() {
      return item => {
        const map = {
          object: JSON.stringify(item)
        }
        if (this.valueKey) {
          return item[this.valueKey]
        } else {
          return map[typeof item] ?? item
        }
      }
    },
    labelCompute() {
      return item => {
        if (this.labelKey) {
          return item[this.labelKey]
        } else {
          return item
        }
      }
    }
  },

  watch: {
    bindValue(val) {
      this.$emit("input", val)
    }
  },
  methods: {
    change() {
      this.$nextTick(() => {
        if (this.$refs.inputRef && this.$refs.inputRef.$children.length > 2) {
          const width = this.$refs.inputRef.$children[2].$el.clientWidth
          this.$refs.inputRef.$children[0].$el.style.width = width + 100 + "px"
        }
      })
    },
    handleChange(e) {
      console.log("vvssssssssv", e, this.bindValue, this.multiple)
      console.log(2)
      if (this.multiple) {
        !e &&
          (!this.bindValue || this.bindValue.length === 0) &&
          this.handleClear()
      } else {
        !e &&
          !this.multiple &&
          (this.bindValue || this.bindValue === 0) &&
          this.handleQuery()
      }
    },
    handleInitClick() {
      if (this.status === "init") {
        this.status = "query"
        if (!this.multiple && !this.filterable) {
          this.singleNoFuzzy = true
          setTimeout(() => {
            const offect = this.$refs.textRef.clientWidth
            console.log(offect, this.$refs.textRef)
            this.$refs.inputRef.$children[1].$el.style.transform = `translateX(-${offect}px)`
          }, 150)
        }
        setTimeout(() => {
          this.$refs.inputRef.focus()
        }, 150)
      }
    },
    handleQuery() {
      if (this.status === "query") {
        if (this.bindValue) {
          this.status = "tag"
        } else {
          this.handleClear()
        }
      }
    },
    handleTag() {
      if (this.status === "tag") {
        this.singleNoFuzzy = false
        this.status = "query"
        setTimeout(() => {
          this.$refs.inputRef.focus()
        }, 150)
      }
    },
    handleClear() {
      if (~["query", "tag"].indexOf(this.status)) {
        this.bindValue = null
        this.status = "init"
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.base {
  display: flex;
  height: 28px;
  align-items: center;
  color: #586278;
  font-size: 12px;

  &-text {
    position: relative;
    z-index: 34;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    cursor: pointer;
    gap: 5px;

    &::after {
      position: absolute;
      z-index: -1;
      width: 100%;
      height: 100%;
      content: "";
      transition: all 0.3s;
    }

    &:hover {
      &::after {
        background: #f5f7fe;
        border-radius: 2px;
      }
    }
  }

  &-query {
    margin-left: 5px;
    transition: all 3s;
  }

  &-tag {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 5px;
    cursor: pointer;
  }
}

::v-deep .el-input {
  // width: 135px;
  transition: width 0.3s;
}

::v-deep .el-input__inner {
  border: 1px solid #dae5fd;
}

::v-deep .el-select:hover .el-input__inner {
  border-color: #dae5fd;
}

::v-deep .el-input__suffix-inner {
  transition: all 1s;
  // position: absolute;
}

::v-deep .el-icon-arrow-up::before {
  content: "\e78f";
}

::v-deep .el-icon-close::before {
  content: "\e78c";
}

::v-deep .el-select__tags {
  flex-wrap: nowrap;
}

::v-deep .el-tag.el-tag {
  background: #eff1f9;
  border-radius: 2px;
  color: #252e40;

  &:hover {
    background: #e8ecff;

    .el-tag__close.el-icon-close::before {
      background: #e8ecff;
    }
  }
}

::v-deep .el-tag.el-tag--info:nth-child(1) {
  position: relative;
  overflow: hidden;
  max-width: 90px;
  padding: 0 16px 0 5px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
}

::v-deep .el-tag__close.el-icon-close {
  position: absolute;
  top: 2px;
  right: 0;
  transition: all.3s;

  &::before {
    border: none;
    background: #eff1f9;
    border-radius: 0;
    transform: translate(0, 0);
  }

  &:hover {
    color: rgb(100, 93, 93);
    transform: scale(0.76);

    &::before {
      content: "\e6db";
    }
  }
}

::v-deep .el-select .el-input.is-focus .el-input__inner {
  border: 1px solid #dae5fd;
  border-radius: 2px;
}

::v-deep .el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  background-color: #f6f8ff;
  color: #213182;
}

::v-deep .el-select-dropdown.is-multiple,
.el-select-dropdown {
  font-size: 12px;

  .el-select-dropdown__empty {
    font-size: 12px;
  }

  .el-select-dropdown__item {
    padding: 0 12px;
    font-size: 12px;
  }

  .el-select-dropdown__item.selected {
    background-color: #f6f8ff;
    color: #213182;
    font-weight: normal;
  }
}

.cart {
  ::v-deep input {
    caret-color: #fff;
    color: #333;
  }
}
</style>
