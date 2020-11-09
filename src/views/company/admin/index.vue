<template>
  <div class="main-body">
    <div class="main-content">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form ref="queryForm" :model="queryForm" :inline="true" class="pt20" style="text-align:center;">
            <el-form-item prop="companyName">
              <el-input v-model="queryForm.companyName" placeholder="输入公司名称搜索" @keyup.enter.native="getDataList"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="getDataList">
                <i class="el-icon-search"></i>
                <span>搜索</span>
              </el-button>
            </el-form-item>
          </el-form>
          <el-row class="pb10">
            <el-col :span="24">
              <div class="left-tree">
                <el-tree
                  ref="elTree"
                  :data="treeList"
                  node-key="id"
                  draggable
                  default-expand-all
                  :expand-on-click-node="false"
                  @node-click="handleClick"
                >
                  <!-- :allow-drop="allowDrop"
                  :allow-drag="allowDrag"
                  @node-drop="handleDrop" -->
                  <span slot-scope="{ data }" class="custom-tree-node">
                    <span>{{ data.companyName }}</span>
                    <!-- <span class="icon-btns">
                      <i class="el-icon-plus ft14 ml12" title="新增" @click="openAddTree(node, data)"></i>
                      <svg-icon slot="prefix" icon-class="icon-edit" title="编辑" class="el-input__icon input-icon" @click="openEditTree(node, data)" />
                      <i class="el-icon-close ft14 ml12" title="删除" @click="deleteTree(node, data)"></i>
                    </span> -->
                  </span>
                </el-tree>
              </div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="16">
          <div class="pt30 pb20 space-between-center">
            <p>{{ company.name }}</p>
            <el-button type="primary" @click="openAdd">新增公司菜单</el-button>
          </div>
          <el-row>
            <el-col :span="24">
              <el-table
                v-loading="loading"
                :data="dataList"
                style="width: 100%"
                row-key="id"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                @selection-change="handleSelectionChange"
              >
                <!-- <el-table-column type="selection" width="55" align="center"></el-table-column> -->
                <el-table-column prop="title" min-width="150" label="菜单名称"></el-table-column>
                <el-table-column label="操作" fixed="right" width="180">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" class="c-red" @click="openDelete(1, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
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
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="菜单：" prop="comMenuIds">
                <treeselect
                  v-model="form.comMenuIds"
                  class="lh20"
                  :no-results-text="'未搜索到数据'"
                  :no-options-text="'暂无数据'"
                  :no-children-text="'没有子级'"
                  :options="munuList"
                  :normalizer="normalizer"
                  :show-count="true"
                  :multiple="true"
                  placeholder="选择菜单"
                />
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
  getManageMenuSelectTree
} from '@/api/company/menu'
import {
  getDataList,
  getCompanyTree,
  addRelCompanyMenu,
  deleteRelCompanyMenu
} from '@/api/company/admin'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  name: 'Menu',
  components: {
    Treeselect
  },
  data() {
    return {
      // 选择对象
      selectOption: {
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true
      },
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      loading: false,
      dataList: [],
      treeList: [], // tree
      munuList: [], // 菜单列表
      queryForm: {
        companyName: '' // 公司名称
      },
      company: {
        id: '',
        name: '' // 公司名称/展示
      },
      form: {
        comMenuIds: ''
      },
      rules: {
        comMenuIds: [
          { required: true, message: '请选择菜单', trigger: 'blur' }
        ]
      }

    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 选择图标
    selectedIcon(name) {
      this.form.icon = name
    },
    // 查询列表
    getDataList() {
      this.loading = true
      getDataList(this.queryForm).then(res => {
        this.treeList = res.data || []
        if (this.treeList.length > 0) {
          this.handleClick(this.treeList[0])
        }
        this.loading = false
      })
    },
    // 查询公司菜单树
    getList(id) {
      getCompanyTree(id).then(res => {
        this.dataList = res.data
      })
    },
    // tree树 点击回调
    handleClick(data, dropNode) {
      this.company.name = data.companyName
      this.company.id = data.id
      this.getList(data.id)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.id)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = selection.length < 2
      this.margeList = JSON.parse(JSON.stringify(selection))
    },
    // 查询菜单列表树
    getManageMenuSelectTree() {
      getManageMenuSelectTree().then(res => {
        this.munuList = res.data || []
        // const menu = { id: 0, title: '主类目', children: [] }
        // menu.children = res.data || []
        // this.treeList.push(menu)
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children === null || (node.children && !node.children.length)) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.title,
        children: node.children
      }
    },
    // 打开新增窗口
    openAdd(row) {
      this.getManageMenuSelectTree()
      this.dialogOption = {
        title: '新增菜单',
        show: true,
        loading: false
      }
      this.form = {
        comId: this.company.id,
        comMenuIds: []
      }
      this.resetForm('form')
    },
    // 打开编辑窗口
    openEdit(row) {
      row.parentId = row.parentId === 0 ? null : row.parentId
      this.getManageMenuSelectTree()
      this.dialogOption = {
        title: '编辑菜单',
        show: true,
        loading: false
      }
      this.form = JSON.parse(JSON.stringify(row))
      this.resetForm('form')
    },
    // 保存回调
    handleConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.saveAdd()
        } else {
          return false
        }
      })
    },
    // 新增保存
    saveAdd() {
      this.dialogOption.loading = true
      let json = {
        comId: this.form.comId,
        comMenuIds: this.form.comMenuIds.join(',')
      }
      addRelCompanyMenu(json).then(res => {
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
      this.$confirm('此操作将删除菜单权限, 是否继续?', '菜单权限删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let json = {
          comId: this.company.id,
          comMenuIds: row.id
        }
        deleteRelCompanyMenu(json).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      }).catch(() => {

      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main-content{
  min-height:100%;
  width:100%;
}
.left-tree{
  width:100%;
  height:100%;
  background-color: #fafafa;
  border-radius: 6px;
  ::v-deep{
    .el-tree{
      // background:none;
      >.el-tree-node{
        min-width:100%;
        display: inline-block;
        text-align: right;
      }
      .el-tree-node__content{
        height:40px;
        text-align: right;
      }
      .el-tree-node__expand-icon{
        font-size:20px;
        color:#061032;
        &.is-leaf{
          color: transparent;
          cursor:default;
        }
      }
      .el-button--mini.is-circle{
        padding:2px;
      }
  }
  }
  .custom-tree-node {
    // flex: 1;
    display: flex;
    align-items: center;
    font-size: 12px;
    padding-right: 8px;
    .icon-btns{
      display:flex;
      align-items:center;
      .input-icon{
        width:14px;
        height:14px;
        margin-left:12px;
      }
    }
  }
}
</style>
