<template>
  <div :class="['base']">
    <div ref="textRef" class="base-text" @click="handleInitClick">
      {{ text || "dasdasd" }}
      <i v-if="singleNoFuzzy" class="el-icon-caret-bottom" />

      <i v-if="status === 'init'" class="el-icon-caret-bottom" />
    </div>

    <div
      v-if="status === 'query'"
      key="query"
      class="base-query"
      :style="selectStyle"
    >
      <el-select
        ref="selectRef"
        v-model="bindValue"
        :class="{ cart: !multiple && !filterable }"
        v-bind="$props"
        collapse-tags
        size="mini"
        filterable
        @clear="handleClear"
        @change="change"
        @visible-change="handleChange"
      >
        <el-option
          v-for="item in options"
          :key="valueCompute(item)"
          :label="labelCompute(item)"
          :value="valueCompute(item)"
        />
      </el-select>
    </div>
    <div
      v-if="status === 'tag'"
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
    <!-- <div></div> -->
  </div>
</template>
<script>
export default {
  props: {
    ...[
      "clearable",
      "value-key",
      "disabled",
      "multiple",
      "remote",
      "remote-method",
      "loading"
    ].reduce((pre, cur) => {
      pre[cur] = {}
      return pre
    }, {}),
    filterable: {
      type: Boolean,
      default: true
    },
    value: {
      requied: true
    },
    text: {
      type: String,
      default: ""
    },
    options: {
      type: Array,
      default: () => []
    },
    labelKey: {
      type: String,
      default: ""
    },
    valueKey: {
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
    },
    selectStyle() {
      if (!this.multiple && this.singleNoFuzzy) {
        return {
          opacity: 0,
          width: "0px"
        }
      } else {
        return {}
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
        if (this.$refs.selectRef && this.$refs.selectRef.$children.length > 2) {
          const width = this.$refs.selectRef.$children[2].$el.clientWidth
          this.$refs.selectRef.$children[0].$el.style.width = width + 100 + "px"
        }
      })
    },
    /**
     * 下拉显隐
     * 如果单选不带filterable blur时若绑定值为空回归init
     */
    handleChange(e) {
      console.log("ddd", e, this.bindValue, this.multiple)
      if (this.filterable) {
        !e &&
          (!this.bindValue || this.bindValue.length === 0) &&
          this.handleClear()
        !e &&
          (this.bindValue || this.bindValue === 0) &&
          !this.multiple &&
          this.handleQuery()
      } else {
        !e &&
          !this.multiple &&
          (this.bindValue || this.bindValue === 0) &&
          this.handleQuery()
        !e &&
          !this.multiple &&
          !this.bindValue &&
          this.bindValue !== 0 &&
          this.handleClear()
      }
    },
    handleInitClick() {
      if (this.status === "init") {
        this.status = "query"
        if (!this.multiple && !this.filterable) {
          this.singleNoFuzzy = true
          setTimeout(() => {
            const offect = this.$refs.textRef.clientWidth
            console.log(offect, this.$refs.selectPrentRef)
            this.$refs.selectRef.$children[1].$el.style.transform = `translateX(-${offect}px)`
          }, 150)
        }
        setTimeout(() => {
          this.$refs.selectRef.focus()
        }, 150)
      }
    },
    handleQuery() {
      if (this.status === "query") {
        this.status = "tag"
        this.singleNoFuzzy = false
      }
    },
    handleTag() {
      if (this.status === "tag") {
        this.status = "query"
        setTimeout(() => {
          this.$refs.selectRef.focus()
        }, 150)
      }
    },
    handleClear() {
      if (~["query", "tag"].indexOf(this.status)) {
        this.bindValue = null
        this.status = "init"
        this.singleNoFuzzy = false
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
  border: 1px solid transparent;
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

::v-deep .el-icon-circle-close::before {
  content: "\e6db";
}

::v-deep .el-select__tags {
  flex-wrap: nowrap;
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
    background: #f4f4f5;
  }

  &:hover {
    color: rgb(100, 93, 93);
    transform: scale(0.9);
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
