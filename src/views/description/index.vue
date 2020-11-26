<!--
 * @Descripttion: 说明页
 * @version:
 * @Author: jwj
 * @Date: 2020-11-26 10:42:37
 * @LastEditors: jwj
 * @LastEditTime: 2020-11-26 22:24:49
-->
<template>
  <div class="main-body">
    <div class="main-content">
      <el-row class="pb10">
        <el-col :span="24">
          <el-button type="primary" class="mr20 mb10" @click="openAdd(null)">新增</el-button>
        </el-col>
      </el-row>
      <el-row class="pb10">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="dataList"
            style="width: 100%"
            row-key="id"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="name" min-width="150" label="名称"></el-table-column>
            <el-table-column min-width="120" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 1" class="c-blue">启用</span>
                <span v-else class="c-red">停用</span>
              </template>
            </el-table-column>
            <el-table-column prop="expireTime" min-width="180" label="过期时间"></el-table-column>
            <el-table-column prop="createdUser" min-width="180" label="创建人"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">修改</el-button>
                <el-button size="mini" type="text" @click="openAdd(scope.row)">新增</el-button>
                <el-button v-if="scope.row.status != 1" size="mini" type="text" class="c-darkBlue" @click="normalManageMenu(scope.row)">启用</el-button>
                <el-button v-else size="mini" type="text" class="c-red" @click="stopManageMenu(scope.row)">停用</el-button>
                <el-button size="mini" type="text" class="c-red" @click="openDelete(1, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </div>
    <!-- 新增/修改 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'860px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pbx30">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="说明页名称：" prop="name">
                <el-input v-model="form.name" style="width:100%;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="过期时间：" prop="expire_time">
                <el-date-picker v-model="form.expire_time" type="date" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择过期时间" style="width:100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="上级目录：" prop="parent_id">
                <treeselect
                  v-model="form.parent_id"
                  class="lh20"
                  :no-results-text="'未搜索到数据'"
                  :no-options-text="'暂无数据'"
                  :no-children-text="'没有子级'"
                  :options="treeList"
                  :normalizer="normalizer"
                  :show-count="true"
                  :disabled="!!form.id"
                  placeholder="选择上级目录"
                  style="width:100%;"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="说明页内容：">
                <Editor v-model="form.content" style="width:100%;" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </mus-dialog>
  </div>
</template>
<script>
import {
  getDataList,
  saveAdd,
  saveEdit,
  deleteManageMenu,
  stopManageMenu,
  normalManageMenu,
  explainInfo
} from '@/api/description'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import Editor from '@/components/Editor' // 富文本
export default {
  name: 'Menu',
  components: {
    Treeselect,
    Editor
  },
  data() {
    return {
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      loading: false,
      dataList: [],
      treeList: [], // 角色列表
      form: {
        name: '', // 说明页名称
        expire_time: '', // 创建时间
        parent_id: null, // 父级目录id
        content: '' // 说明页内容
      },
      rules: {
        name: [
          { required: true, message: '请输入说明页名称', trigger: 'blur' }
        ],
        expire_time: [
          { required: true, message: '请选择过期时间', trigger: ['blur', 'change'] }
        ],
        parent_id: [
          { required: true, message: '请选择上级目录', trigger: ['blur', 'change'] }
        ]
      }

    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 查询列表
    getDataList() {
      this.loading = true
      getDataList().then(res => {
        // this.dataList = this.handleTree(res.data, 'id')
        this.dataList = res.data || []
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 查询目录列表树
    getManageMenuSelectTree() {
      this.treeList = []
      const menu = { id: 0, name: '主类目', children: [] }
      let list = JSON.parse(JSON.stringify(this.dataList)) || []
      list.forEach(item => {
        item.children && item.children.forEach(child => {
          child.children = []
        })
      })
      // menu.children = this.dataList || []
      menu.children = list
      this.treeList.push(menu)
      // this.treeList = res.data
    },
    /** 转换目录数据结构 */
    normalizer(node) {
      if (node.children === null || (node.children && !node.children.length)) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
        // disabled: false
      }
    },
    // 打开新增窗口
    openAdd(row) {
      this.getManageMenuSelectTree()
      this.dialogOption = {
        title: '新增说明页',
        show: true,
        loading: false
      }
      this.form = {
        name: '', // 说明页名称
        expire_time: '', // 创建时间
        parent_id: null, // 父级目录id
        content: '' // 说明页内容
      }
      if (row != null) {
        this.form.parent_id = row.id
      }
      this.resetForm('form')
    },
    // 打开编辑窗口
    openEdit(row) {
      row.parentId = row.parentId === 0 ? null : row.parentId
      this.getManageMenuSelectTree()
      this.dialogOption = {
        title: '编辑说明页',
        show: true,
        loading: false
      }
      explainInfo(row.id).then(res => {
        let json = res.data || {}
        this.form = {
          name: json.name,
          expire_time: json.expireTime,
          parent_id: json.parentId,
          content: json.content,
          id: json.id
        }
      })
      this.resetForm('form')
    },
    // 保存回调
    handleConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.saveEdit()
          } else {
            this.saveAdd()
          }
        } else {
          return false
        }
      })
    },
    // 新增保存
    saveAdd() {
      this.dialogOption.loading = true
      saveAdd(this.form).then(res => {
        this.$notify.success({
          title: '保存成功'
        })
        this.getDataList()
        this.dialogOption.show = false
        this.dialogOption.loading = false
      }).catch(e => {
        this.dialogOption.loading = false
      })
    },
    // 编辑保存
    saveEdit() {
      this.dialogOption.loading = true
      saveEdit(this.form).then(res => {
        this.$notify.success({
          title: '保存成功'
        })
        this.getDataList()
        this.dialogOption.show = false
        this.dialogOption.loading = false
      }).catch(e => {
        this.dialogOption.loading = false
      })
    },
    // 打开删除 type:1 单个 type:2 批量
    openDelete(type, row) {
      let title = type === 1 ? '单个' : '批量'
      this.$confirm('此操作将删除说明页, 是否继续?', '说明页删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        // let json = type === 1 ? row.id : this.selectOption.ids.join(',')
        deleteManageMenu(row.id).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      }).catch(() => {

      })
    },
    // 启用保存
    normalManageMenu(row) {
      this.$confirm('此操作将启用说明页, 是否继续?', '说明页启用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        normalManageMenu(row.id).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        }).catch(() => {
        })
      }).catch(() => {})
    },
    // 打开停用
    stopManageMenu(row) {
      this.$confirm('此操作将单个停用说明页, 是否继续?', '说明页停用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        stopManageMenu(row.id).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      }).catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
