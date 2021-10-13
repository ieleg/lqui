<template>
  <div
    ref="scrollDom"
    class="list"
    style="overflow: scroll; height: 300px"
    @scroll="scroll"
  >
    <div :style="{ height: list.length * 40 + 'px' }" />
    <div
      style="position: absolute; width: 100%"
      :style="{ top: startIndex * 40 + 'px' }"
    >
      <div v-for="(item, index) in splitData" :key="index" class="item">
        <div v-html="item.id" />
        <div v-html="item.name" />
        <div v-html="item.createTime" />
        <div>
          <Button>修改</Button>
          <Button>删除</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startIndex: 0,
      list: []
    }
  },
  computed: {
    limitCount() {
      return 300 / 40 + 2
    },
    splitData() {
      return this.list.slice(this.startIndex, this.startIndex + this.limitCount)
    }
  },
  created() {
    for (let i = 0; i < 10000; i++) {
      this.list.push({
        id: 1,
        name: "name" + i,
        createTime: "2018-09-09"
      })
    }
  },
  methods: {
    scroll() {
      // 根据滚动的距离，估算出这个滚动位置对应的数组序列，例如滚动100px，每条40px，对应第3条
      let scrollTop = this.$refs.scrollDom.scrollTop
      this.startIndex = Math.floor(scrollTop / 40)
    }
  }
}
</script>
<style scoped lang="scss">
.list {
  position: relative;
  width: 500px;
  padding: 5px;
  border: solid 1px #5f5f5f;
  margin: 100px 0;
  background-color: white;

  .item {
    display: flex;
    height: 40px;

    > * {
      flex-grow: 1;
      padding: 3px;
      border: solid 1px #9e9e9e;
    }
  }
}
</style>
