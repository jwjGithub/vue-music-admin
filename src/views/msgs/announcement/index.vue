<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="模版标题" prop="title">
              <el-input v-model="queryForm.title" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="业务类型" prop="business">
              <el-select v-model="queryForm.business" clearable placeholder="请选择业务类型" class="w24">
                <el-option :value="0" label="消息公告" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否已读" prop="isRead">
              <el-select v-model="queryForm.isRead" clearable placeholder="请选择是否已读" class="w24">
                <el-option :value="1" label="是" />
                <el-option :value="0" label="否" />
              </el-select>
            </el-form-item>
            <el-form-item label="发送类型" prop="sendType">
              <el-select v-model="queryForm.sendType" clearable placeholder="请选择发送类型" class="w24">
                <el-option :value="1" label="即时发送" />
                <el-option :value="2" label="定时发送" />
              </el-select>
            </el-form-item>
            <el-form-item label="发送状态" prop="sendStatus">
              <el-select v-model="queryForm.sendStatus" clearable placeholder="请选择发送状态" class="w24">
                <el-option :value="0" label="待发送" />
                <el-option :value="1" label="已发送" />
              </el-select>
            </el-form-item>
            <el-form-item label="接收人" prop="recipientName">
              <el-input v-model="queryForm.recipientName" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="创建时间" prop="time">
              <el-date-picker
                v-model="queryForm.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="changeTime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="类型" prop="type">
              <el-select v-model="queryForm.type" clearable placeholder="请选择类型" class="w24">
                <el-option :value="1" label="普通消息" />
                <el-option :value="2" label="模板消息" />
              </el-select>
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
          <el-button type="primary" class="mr20 mb10" @click="openAdd">新增</el-button>
        </el-col>
      </el-row>
      <el-row class="pb10">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="dataList"
            stripe
            style="width: 100%"
          >
            <el-table-column min-width="55" label="序号">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="businessName" min-width="120" label="消息类型">
              <template slot-scope="scope">{{ scope.row.type === 1 ? '普通消息' : '模板消息' }}</template>
            </el-table-column>
            <el-table-column min-width="120" label="业务类型">
              <template slot-scope="scope">{{ scope.row.sendTypeDes }}</template>
            </el-table-column>
            <el-table-column prop="createTime" min-width="150" label="创建时间"></el-table-column>
            <el-table-column prop="scheduledSendTime" min-width="150" label="计划发送时间"></el-table-column>
            <el-table-column min-width="120" label="接收人">
              <template slot-scope="scope">{{ scope.row.recipientName }}</template>
            </el-table-column>
            <el-table-column prop="sendStatusDes" min-width="120" label="发送状态"></el-table-column>
            <el-table-column min-width="120" label="已读">
              <template slot-scope="scope">{{ scope.row.isRead === 1 ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column min-width="150" label="已处理">
              <template slot-scope="scope">{{ scope.row.isHandle === 1 ? '是' : '否' }}</template>
            </el-table-column>
            <el-table-column prop="sendTime" min-width="150" label="发送时间"></el-table-column>
            <el-table-column prop="title" min-width="120" label="模版标题"></el-table-column>
            <el-table-column prop="content" min-width="240" label="模版内容"></el-table-column>
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
    <el-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :width="'860px'"
      :visible.sync="dialogOption.show"
    >
      <div class="pl24 pr24 pt24">
        <el-form ref="form" :model="form" :rules="rules" label-width="180px">
          <el-form-item label="消息标题：" prop="title">
            <el-input v-model="form.title" class="w50"></el-input>
          </el-form-item>
          <el-form-item label="消息内容：" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              class="w50"
              :rows="4"
            ></el-input>
          </el-form-item>
          <el-form-item label="发送类型：" prop="sendType">
            <el-select v-model="form.sendType" clearable placeholder="请选择发送类型" class="w50">
              <el-option :value="1" label="及时发送" />
              <el-option :value="2" label="定时发送" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="form.sendType===2" label="定时发送时间：" prop="scheduledSendTime">
            <el-date-picker
              v-model="form.scheduledSendTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="w50"
              type="datetime"
              placeholder="请选择定时发送时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="是否发送给所有用户：" prop="sendToAll">
            <el-radio-group v-model="form.sendToAll" class="w50">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="form.sendToAll===0" label="接收人：" prop="recipientArr">
            <el-select
              v-model="form.recipientArr"
              class="w50"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入姓名查询"
              :remote-method="remoteMethod"
              :loading="loading"
            >
              <el-option
                v-for="item in recipientArrList"
                :key="item.userId"
                :label="item.realname"
                :value="item.userId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="text-center">
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
          <el-button class="ml20" @click="dialogOption.show=false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getSysMessageListPage,
  addSysMessage,
  getQueryUserPageList
} from '@/api/msg/announcement'
export default {
  name: 'Announcement',
  data() {
    const validateTime = (rule, value, callback) => {
      if (this.form.sendType === 2 && this.form.scheduledSendTime === '') {
        callback(new Error('请选择定时发送时间'))
      } else {
        callback()
      }
    }
    const validateRecipient = (rule, value, callback) => {
      if (this.form.sendToAll === 0 && this.form.recipientArr.length <= 0) {
        callback(new Error('请选择接收人'))
      } else {
        callback()
      }
    }
    return {
      total: 0,
      // 新增/修改 弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      loading: false,
      dataList: [],
      recipientArrList: [],
      queryForm: {
        title: '', // 标题
        sendType: '', // 发送类型
        business: '',
        isRead: '',
        sendStatus: '',
        recipient: '',
        recipientName: '',
        type: '',
        time: [],
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      // 消息form
      form: {
        title: '', // 消息标题
        content: '', // 消息内容
        sendType: '', // 发送类型
        scheduledSendTime: '', // 有效时间
        sendToAll: '', // 是否发送给所有用户
        recipientArr: [] // 接收人
      },
      rules: {
        title: [
          { required: true, message: '请输入消息标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入消息内容', trigger: 'blur' }
        ],
        scheduledSendTime: [
          { validator: validateTime, trigger: ['blur', 'change'] }
        ],
        sendType: [
          { required: true, message: '请选择发送类型', trigger: ['blur', 'change'] }
        ],
        sendToAll: [
          { required: true, message: '请选择是否发送给所有用户', trigger: 'change' }
        ],
        recipientArr: [
          { validator: validateRecipient, trigger: ['blur', 'change'] }
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
      getSysMessageListPage(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 选择搜索时间赋值
    changeTime(res) {
      if (res && res.length > 1) {
        this.queryForm.startTime = res[0]
        this.queryForm.endTime = res[1]
      } else {
        this.queryForm.startTime = ''
        this.queryForm.endTime = ''
      }
    },
    // 查询接收人
    remoteMethod(str) {
      if (str !== '') {
        getQueryUserPageList({
          realName: str,
          page: 1,
          limit: 10000
        }).then(res => {
          this.recipientArrList = res.data || []
        })
      }
    },
    // 打开新增模版窗口
    openAdd() {
      this.dialogOption = {
        title: '新增通知公告',
        show: true,
        loading: false
      }
      this.form = {
        title: '', // 消息标题
        content: '', // 消息内容
        sendType: '', // 发送类型
        scheduledSendTime: '', // 有效时间
        sendToAll: '', // 是否发送给所有用户
        recipientArr: [] // 接收人
      }
      this.resetForm('form')
    },
    // 保存回调
    handleConfirm() {
      console.log(this.form)
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialogOption.loading = true
          addSysMessage({
            title: this.form.title,
            sendType: this.form.sendType,
            scheduledSendTime: this.form.scheduledSendTime,
            content: this.form.content,
            sendToAll: this.form.sendToAll,
            recipientArr: this.form.recipientArr
          }).then(res => {
            this.$notify.success({
              title: '保存成功'
            })
            this.getDataList()
            this.dialogOption.show = false
            this.dialogOption.loading = false
          }).catch(e => {
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
#paramsId,#contentId{
  display: block;
  resize: vertical;
  padding: 5px 15px;
  line-height: 1.5;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  font-size: inherit;
  color: #606266;
  background-color: #FFF;
  background-image: none;
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  &:focus{
    outline: 0;
    border-color: #409EFF;
  }
}
</style>
