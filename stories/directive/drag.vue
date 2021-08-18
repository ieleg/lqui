<template>
  <div>
    <el-table :data="cities">
      <el-table-column
        v-for="item in cities"
        :key="item.id"
        :label="item.label"
      />
    </el-table>
    <el-checkbox-group v-model="checkedCities">
      <el-checkbox
        v-for="(city, index) in cities"
        :key="city.id"
        v-dragging="{ item: city, list: cities, group: 'city' }"
        class="bar"
        :label="city.id"
      >
        {{ city.label }}
        <el-button v-show="index > 0" type="text" @click="handleUp(index)">
          up
        </el-button>
        <el-button
          v-show="index + 1 < cities.length"
          type="text"
          @click="handleDown(index)"
        >
          down
        </el-button>
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      arr: Array.from({ length: 7 }, (_, k) => k + 1),
      checkAll: false,
      checkedCities: [1, 3],
      cities: [
        { id: 1, label: "拖动测试" },
        { id: 2, label: "猪八戒" },
        { id: 3, label: "在编辑" },
        { id: 4, label: "这部剧" }
      ]
    }
  }
}
</script>
