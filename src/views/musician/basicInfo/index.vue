<!--
 * @Descripttion: 音乐人基本信息主组件
 * @version:
 * @Author: jwj
 * @Date: 2021-01-07 18:16:12
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-17 20:59:47
-->
<template>
  <div class="main-page musician-basicInfo">
    <div class="main-content">
      <!-- type="border-card" -->
      <el-tabs
        v-model="tabActiveName"
        class="main-tabs"
        type="card"
        @tab-remove="removeTab"
      >
        <el-tab-pane label="全部" name="index">
          <list @addTab="addTab"></list>
        </el-tab-pane>
        <el-tab-pane
          v-for="(item, index) in tabList"
          :key="index"
          :label="item.title"
          :name="item.name"
          :closable="true"
        >
          <Details :list-data="item.form"></Details>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import List from './components/List'
import Details from './components/Details'
export default {
  name: 'MusicianBasicInfo',
  components: {
    'list': List,
    Details
  },
  data() {
    return {
      tabActiveName: 'index',
      tabList: []// 展开的tab页列表
    }
  },
  created() {
  },
  methods: {
    // 添加tab页
    addTab(row) {
      console.log(row, 'row')
      let newTabName = row.title + row.form.id
      let bl = true
      for (let i = 0, len = this.tabList.length; i < len; i++) {
        let item = this.tabList[i]
        if (item.name === newTabName) {
          this.tabActiveName = newTabName
          bl = false
          break
        }
      }
      if (bl) {
        this.tabList.push({
          title: row.title,
          form: row.form,
          name: newTabName
        })
        this.tabActiveName = newTabName
      }
    },
    // 删除tab页
    removeTab(name) {
      for (let i = 0, len = this.tabList.length; i < len; i++) {
        let item = this.tabList[i]
        if (name === item.name) {
          this.tabList.splice(i, 1)
          if (i > 0) {
            this.tabActiveName = this.tabList[i - 1].name
          } else {
            this.tabActiveName = 'index'
          }
          break
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.musician-basicInfo{
  padding:10px;
  width:100%;
  height:100%;
  >.main-content{
    width:100%;
    height:100%;

  }
}
</style>
<style lang="scss">
.musician-basicInfo{
  .main-tabs{
    width:100%;
    height:100%;
    display:flex;
    flex-direction: column;
    .el-tabs__content{
      padding:0;
      flex:1;
      overflow:hidden;
      .el-tab-pane{
        height:100%;
      }
    }
  }
}
</style>

