<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="标题" prop="title">
              <el-input v-model="queryForm.title" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="问题类型" prop="type">
              <el-select v-model="queryForm.type" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option :value="0" label="问题反馈" />
                <el-option :value="1" label="举报投诉" />
                <el-option :value="2" label="优化建议" />
              </el-select>
            </el-form-item>
            <el-form-item label="提交人" prop="proposer">
              <el-input v-model="queryForm.proposer" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="提交时间" prop="createdTime">
              <el-date-picker
                v-model="form.createdTime"
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
      <el-row class="pb10">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="dataList"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="title" min-width="150" label="标题"></el-table-column>
            <el-table-column prop="status" min-width="150" label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0" class="c-red">未回复</span>
                <span v-if="scope.row.status === 1" class="c-blue">已回复</span>
              </template>
            </el-table-column>
            <el-table-column prop="type" min-width="150" label="类型">
              <template slot-scope="scope">
                <span v-if="scope.row.status === 0">问题反馈</span>
                <span v-if="scope.row.status === 1">举报投诉</span>
                <span v-if="scope.row.status === 2">优化建议</span>
              </template>
            </el-table-column>
            <el-table-column prop="proposer" min-width="150" label="提交人"></el-table-column>
            <el-table-column prop="email" min-width="150" label="邮箱"></el-table-column>
            <el-table-column prop="createdTime" min-width="180" label="提交时间"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">详情</el-button>
                <el-button size="mini" type="text" class="c-red" @click="openDelete(scope.row)">删除</el-button>
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
    <!-- 新增/修改 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :is-show-ok="false"
      :is-show-close="false"
      :width="'800px'"
      @handleClose="dialogOption.show = false"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" :inline="true">
          <el-form-item class="mb1" label="标题：" prop="title">
            <div class="w24">{{ form.title }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="类型：" prop="type">
            <div class="w24">{{ form.type }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="提交人：" prop="proposer">
            <div class="w24">{{ form.proposer }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="邮箱：" prop="email">
            <div class="w24">{{ form.email }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="状态：" prop="status">
            <div class="w24">
              <span v-if="form.status == 1" class="c-blue">已回复</span>
              <span v-else class="c-red">未回复</span>
            </div>
          </el-form-item>
          <el-form-item class="mb1" label="提交内容：" prop="tiJiaoContent">
            <div class="w24">{{ form.tiJiaoContent }}</div>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="回复内容：" prop="content">
                <el-input v-if="form.status == 0" v-model="form.content" style="width:600px;" type="textarea" :rows="4" :resize="'none'"></el-input>
                <div v-else style="width:600px;">{{ form.content }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label=" ">
                <el-button class="w14 mt24" @click="dialogOption.show = false">关闭</el-button>
                <el-button v-if="form.status == 0" v-loading="dialogOption.loading" type="primary" class="w14 mt24" @click="handleConfirm">回复</el-button>
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
  saveDelete,
  queryReply,
  addReply
} from '@/api/feedback'
export default {
  name: 'Review',
  data() {
    return {
      total: 0,
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      loading: false,
      dataList: [],
      queryForm: {
        // title: '', // 问题标题
        // type: '', // 问题类型
        // proposer: '', // 提交人
        // createdTime: '', // 提交时间
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      form: {
        title: '', // 问题标题
        type: '', // 问题类型
        proposer: '', // 提交人
        createdTime: '', // 提交时间
        fdId: '', // 问题id
        content: '' // 回复内容
      },
      rules: {
        content: [
          { required: true, message: '请输入回复内容', trigger: 'blur' }
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
      getDataList(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 打开详情接口
    openDetails(row) {
      this.dialogOption = {
        title: '详情',
        show: true,
        loading: false
      }
      this.form = {
        title: row.title, // 问题标题
        type: row.type, // 问题类型
        proposer: row.proposer, // 提交人
        createdTime: row.createdTime, // 提交时间
        email: row.email, // 邮箱
        tiJiaoContent: row.content, // 提交内容
        status: row.status, // 提交状态
        fdId: row.id, // 问题id
        content: '' // 回复内容
      }
      if (row.status !== 0) {
        this.queryReply(row.id)
      }
      console.log(row, this.form)
      this.resetForm('form')
    },
    // 打开问题删除
    openDelete(row) {
      this.$confirm('此操作将删除意见反馈, 是否继续?', '反馈删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        saveDelete(row.id).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      }).catch(() => {

      })
    },
    // 查询一个问题的回复
    queryReply(id) {
      queryReply(id).then(res => {
        this.form.content = res.data.content
      })
    },
    // 保存回调
    handleConfirm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogOption.loading = true
          let json = {
            fdId: this.form.fdId,
            content: this.form.content
          }
          addReply(json).then(res => {
            this.$notify.success({
              title: '操作成功'
            })
            this.getDataList()
            this.dialogOption.show = false
            this.dialogOption.loading = false
          }).catch(() => {
            this.dialogOption.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
