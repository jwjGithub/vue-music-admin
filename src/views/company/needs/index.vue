<!--
 * @Descripttion:公司需求管理
 * @version:
 * @Author: jwj
 * @Date: 2020-12-01 14:31:05
 * @LastEditors: JWJ
 * @LastEditTime: 2020-12-01 23:16:18
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
          <el-button type="danger" class="mr20 mb10" :disabled="selectOption.multiple" @click="openDelete()">批量删除</el-button>
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
                <el-button v-if="scope.row.status === 0" size="mini" type="text" @click="openStopUsing(scope.row)">停用</el-button>
                <el-button v-if="scope.row.status === 2" size="mini" type="text" @click="usingLibrary(scope.row)">启用</el-button>
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
    <!-- 需求详情 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :is-show-ok="false"
      :is-show-close="false"
      :width="'860px'"
      @handleClose="dialogOption.show = false"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" label-width="130px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="需求内容" style="padding-bottom:66px;" prop="reason">
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
          v-show="musicTotal>0"
          :total="Number(musicTotal)"
          :page.sync="libraryInfo.page"
          :limit.sync="libraryInfo.limit"
          @pagination="getMusicPageInOptional"
        />
      </div>
    </mus-dialog>
    <!-- 需求库、作品删除 弹窗 -->
    <mus-dialog
      :title="dialogDelete.title"
      :loading="dialogDelete.loading"
      :is-show="dialogDelete.show"
      :width="'460px'"
      @handleClose="dialogDelete.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24">
        <el-form ref="deletefForm" :model="deletefForm" :rules="deletefRules" label-width="80px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="说明" style="padding-bottom:66px;" prop="reason">
                <el-input v-model="deletefForm.reason" class="w24"></el-input>
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
  getCompanyList,
  getMusicPageInOptional,
  deleteWorks,
  updateOption
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
      // 删除弹窗对象
      dialogDelete: {
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
        content: '' // 内容
      },
      libraryInfo: { // 需求库信息
        page: 1,
        limit: 10
      },
      musicTotal: [], // 需求库作品列表总条数
      musicList: [], // 需求库作品列表
      deletefForm: {
        reason: '' // 删除理由
      },
      deletefRules: {
        reason: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      }
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
      this.form = row
      this.libraryInfo.optionalType = row.optionalType
      this.libraryInfo.id = row.optionalType === 0 ? row.optionalLyricsId : row.optionalBaseId
      this.getMusicPageInOptional()
    },
    // 需求库下的作品列表
    getMusicPageInOptional() {
      this.loading = true
      getMusicPageInOptional(this.libraryInfo).then(res => {
        this.musicList = res.data || []
        this.musicTotal = res.count
        this.loading = false
      })
    },
    // 打开作品删除
    openWorksDelete(row) {
      this.dialogDelete = {
        title: '作品删除',
        show: true,
        loading: false
      }
      this.deletefForm = {
        workIds: row.id, // 多个用逗号隔开
        optionalType: this.libraryInfo.optionalType, //	库类型，0词 ，1曲
        optionalId: this.libraryInfo.id, // 库ID
        reason: ''// 删除理由
      }
    },
    // 删除保存回调
    handleConfirm() {
      this.$refs['deletefForm'].validate((valid) => {
        if (valid) {
          if (this.dialogDelete.type === 1) {
            this.saveStop()
          } else {
            this.dialogDelete.loading = true
            deleteWorks(this.deletefForm).then(res => {
              this.$notify.success({ title: '删除成功' })
              this.getMusicPageInOptional()
              this.dialogDelete.loading = false
              this.dialogDelete.show = false
            }).catch(() => {
              this.dialogDelete.loading = false
            })
          }
        } else {
          return false
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.id)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
    },
    // 打开批量删除
    openDelete(type, row) {
      this.dialogDelete = {
        title: '需求库删除',
        type: 1,
        show: true,
        loading: false
      }
      this.deletefForm = {
        status: 1, // 多个用逗号隔开
        optionalIds: this.selectOption.ids.join(','), // 库ID
        reason: ''// 删除理由
      }
    },
    // 启用
    usingLibrary(row) {
      this.$confirm('此操作将启用需求库, 是否继续?', '需求库启用', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let jsonInfo = {
          optionalIds: row.id,
          status: 0
        }
        updateOption(jsonInfo).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        }).catch(() => {
        })
      }).catch(() => {})
    },
    // 打开停用
    openStopUsing(row) {
      this.dialogDelete = {
        title: '需求库停用',
        type: 1,
        show: true,
        loading: false
      }
      this.deletefForm = {
        status: 2, // 多个用逗号隔开
        optionalIds: row.id, // 库ID
        reason: ''// 删除理由
      }
    },
    // 停用、批量删除保存
    saveStop() {
      this.dialogDelete.loading = true
      updateOption(this.deletefForm).then(res => {
        this.$notify.success({ title: '操作成功' })
        this.getDataList()
        this.dialogDelete.loading = false
        this.dialogDelete.show = false
      }).catch(() => {
        this.dialogDelete.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
