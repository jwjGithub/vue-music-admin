<!--
 * @Descripttion:公司需求管理
 * @version:
 * @Author: jwj
 * @Date: 2020-12-01 14:31:05
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-01 17:53:36
-->
<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="需求名称" prop="title">
              <el-input v-model="queryForm.title" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="发布公司" prop="comId">
              <el-select v-model="queryForm.comId" clearable placeholder="请选择公司" class="w24">
                <el-option v-for="(item,index) in companyList" :key="index" :value="item.id" :label="item.companyName" />
              </el-select>
            </el-form-item>
            <el-form-item label="发布人">
              <el-input v-model="queryForm.realname" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="queryForm.createdTime"
                class="w24"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="生效时间">
              <el-date-picker
                v-model="queryForm.effectiveTime"
                class="w24"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="截止时间">
              <el-date-picker
                v-model="queryForm.expiredTime"
                class="w24"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div class="right-btn">
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="getDataList">
                <i class="el-icon-search"></i>
                <span>搜索</span>
              </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-row class="pt20 pb10">
        <el-col :span="24">
          <el-button type="danger" class="mr20 mb10" :disabled="selectOption.multiple" @click="openDelete(2,null)">批量删除</el-button>
        </el-col>
      </el-row>
      <el-row class="pb10">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="dataList"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column min-width="150" label="名称">
              <template slot-scope="scope">
                <el-button type="text" class="mr20 mb10" @click="openDetails(scope.row)">{{ scope.row.title }}</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="companyName" min-width="150" label="发布公司"></el-table-column>
            <el-table-column prop="creatorName" min-width="150" label="发布人员"></el-table-column>
            <el-table-column prop="optionalStatusDes" min-width="80" label="状态"></el-table-column>
            <el-table-column prop="createdTime" min-width="150" label="创建时间"></el-table-column>
            <el-table-column prop="effectiveTime" min-width="150" label="生效时间"></el-table-column>
            <el-table-column prop="expiredTime" min-width="150" label="截止时间"></el-table-column>
            <el-table-column prop="contributionNum" min-width="150" label="投稿数"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">启用</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <pagination
        v-show="total>0"
        :total="Number(total)"
        :page.sync="queryForm.page"
        :limit.sync="queryForm.limit"
        @pagination="getDataList"
      />
    </div>
    <!-- 需求 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'860px'"
      @handleClose="dialogOption.show = false"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="删除理由" style="padding-bottom:66px;" prop="reason">
                <Editor v-model="form.reason" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row class="pb10">
          <el-col :span="24">
            <el-table
              v-loading="loading"
              :data="musicList"
              stripe
              style="width: 100%"
            >
              <el-table-column prop="remark" min-width="150" label="投稿内容"></el-table-column>
              <el-table-column prop="createdTime" min-width="150" label="投稿时间"></el-table-column>
              <el-table-column prop="lrcAuthor" min-width="80" label="投稿人"></el-table-column>
              <el-table-column label="操作" fixed="right" width="180">
                <template slot-scope="scope">
                  <el-button size="mini" type="text" @click="openWorksDelete(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
        <pagination
          v-show="total>0"
          :total="Number(total)"
          :page.sync="queryForm.page"
          :limit.sync="queryForm.limit"
          @pagination="getDataList"
        />
      </div>
    </mus-dialog>
  </div>
</template>
<script>
import {
  getDataList,
  getCompanyList,
  getMusicPageInOptional,
  // saveAdd,
  // saveEdit,
  // deleteManageMenu,
  // stopManageMenu,
  // normalManageMenu
  deleteWorks
} from '@/api/company/needs'
import Editor from '@/components/Editor'
export default {
  name: 'Menu',
  components: {
    Editor
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
      companyList: [], // 公司下拉列表
      queryForm: {
        title: '', // 需求名称
        comId: '', // 发布公司
        realname: '', // 发布人
        createdTime: '', // 创建时间
        effectiveTime: '', // 生效时间
        expiredTime: '', // 截止时间
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      total: 0,
      form: {
        reason: '' // 删除理由
      },
      rules: {
        reason: [
          { required: true, message: '请输入删除理由', trigger: 'blur' }
        ]
      },
      musicList: []// 需求库作品列表
    }
  },
  created() {
    this.getDataList()
    this.getCompanyList()
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
        this.dataList = res.data || []
        this.total = res.count
        this.loading = false
      })
    },
    // 查询公司列表
    getCompanyList() {
      getCompanyList().then(res => {
        this.companyList = res.data || []
      })
    },
    // 打开需求详情
    openDetails(row) {
      this.dialogOption = {
        title: '需求详情',
        show: true,
        loading: false
      }
      let josnInfo = {
        optionalType: row.optionalType,
        id: row.optionalType === 0 ? row.optionalLyricsId : row.optionalBaseId,
        page: 1,
        limit: 10
      }
      this.getMusicPageInOptional(josnInfo)
    },
    // 需求库下的作品列表
    getMusicPageInOptional(josnInfo) {
      this.loading = true
      getMusicPageInOptional(josnInfo).then(res => {
        this.musicList = res.data || []
        this.total = res.count
        this.loading = false
      })
    },
    // 打开作品删除
    openWorksDelete(row) {
      this.$confirm('此操作将删除作品, 是否继续?', '作品删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        // let ids = this.selectOption.ids.join(',')
        // deleteWorks(ids).then(res => {
        //   this.$notify.success({
        //     title: '操作成功'
        //   })
        //   this.getDataList()
        // })
      }).catch(() => {})
    },
    // 打开新增窗口
    // openAdd(row) {
    //   this.dialogOption = {
    //     title: '新增菜单',
    //     show: true,
    //     loading: false
    //   }
    //   this.form = {
    //     isExlink: 'N', // 是否外链
    //     icon: '', // 图标
    //     sort: '', // 排序
    //     title: '', // 菜单标题
    //     type: 'CONTENTS', // 菜单类型
    //     parentId: 0, // 父级菜单id
    //     isHidden: 'N', // 是否隐藏
    //     isFree: 0, // 是否收费
    //     path: '', // 路由地址
    //     parentName: '', // 父级菜单名称
    //     component: '', // 组件路径
    //     name: '', // 路由名称
    //     status: 'NORMAL' // 菜单状态
    //   }
    //   if (row != null) {
    //     this.form.parentId = row.id
    //   }
    //   this.resetForm('form')
    // },
    // 打开编辑窗口
    openEdit(row) {
      row.parentId = row.parentId === 0 ? null : row.parentId
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
      // this.dialogOption.loading = true
      // saveAdd(this.form).then(res => {
      //   this.$notify.success({
      //     title: '保存成功'
      //   })
      //   this.getDataList()
      //   this.dialogOption.show = false
      //   this.dialogOption.loading = false
      // }).catch(e => {
      //   this.dialogOption.loading = false
      // })
    },
    // 编辑保存
    saveEdit() {
      // this.dialogOption.loading = true
      // saveEdit(this.form).then(res => {
      //   this.$notify.success({
      //     title: '保存成功'
      //   })
      //   this.getDataList()
      //   this.dialogOption.show = false
      //   this.dialogOption.loading = false
      // }).catch(e => {
      //   this.dialogOption.loading = false
      // })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.id)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
    },
    // 打开删除 type:1 单个 type:2 批量
    openDelete(type, row) {
      this.$confirm('此操作将删除需求, 是否继续?', '需求删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let ids = this.selectOption.ids.join(',')
        // deleteManageMenu(ids).then(res => {
        //   this.$notify.success({
        //     title: '操作成功'
        //   })
        //   this.getDataList()
        // })
      }).catch(() => {})
    },
    // 启用保存
    normalManageMenu(row) {
      // this.$confirm('此操作将启用菜单, 是否继续?', '菜单启用', {
      //   cancelButtonText: '取消',
      //   confirmButtonText: '确定',
      //   type: 'warning'
      // }).then(() => {
      //   normalManageMenu(row.id).then(res => {
      //     this.$notify.success({
      //       title: '操作成功'
      //     })
      //     this.getDataList()
      //   }).catch(() => {
      //   })
      // }).catch(() => {

      // })
    },
    // 打开停用
    stopManageMenu(row) {
      // this.$confirm('此操作将单个停用菜单, 是否继续?', '菜单停用', {
      //   cancelButtonText: '取消',
      //   confirmButtonText: '确定',
      //   type: 'warning'
      // }).then(() => {
      //   stopManageMenu(row.id).then(res => {
      //     this.$notify.success({
      //       title: '操作成功'
      //     })
      //     this.getDataList()
      //   })
      // }).catch(() => {

      // })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
