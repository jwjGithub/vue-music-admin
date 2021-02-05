<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="模版标题" prop="title">
              <el-input v-model="queryForm.title" class="w24" placeholder="请输入模版标题"></el-input>
            </el-form-item>
            <el-form-item label="业务类型" prop="business">
              <el-select v-model="queryForm.business" clearable placeholder="请选择业务类型" class="w24">
                <el-option value="" label="全部" />
                <el-option v-for="item in businessTypeList" :key="item.id" :value="item.code" :label="item.des" />
              </el-select>
            </el-form-item>
          </div>
          <div class="right-btn" style="width: 180px;text-align: right;">
            <el-button type="primary" :loading="loading" @click="getDataList">
              <i class="el-icon-search"></i>
              <span>搜索</span>
            </el-button>
            <el-button type="primary" @click="resetTable">
              <span>重置</span>
            </el-button>
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
            <el-table-column prop="businessName" min-width="120" label="业务类型"></el-table-column>
            <el-table-column prop="title" min-width="120" label="模版标题"></el-table-column>
            <el-table-column min-width="240" label="模版内容">
              <template slot-scope="scope">
                <el-tooltip placement="top">
                  <div slot="content" style="max-width:300px;">{{ scope.row.content }}</div>
                  <span class="text-ellipsis">{{ scope.row.content }}</span>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="createUserName" min-width="120" label="创建人"></el-table-column>
            <el-table-column prop="expireTimeDes" min-width="120" label="操作有效时间"></el-table-column>
            <el-table-column prop="updateUserName" min-width="120" label="修改人"></el-table-column>
            <el-table-column prop="createTime" min-width="150" label="创建时间"></el-table-column>
            <el-table-column prop="updateTime" min-width="150" label="修改时间"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="text" @click="delTemplate(scope.row)">删除</el-button>
                <el-button size="mini" type="text" @click="openTemplateOption(scope.row.id)">配置操作</el-button>
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
    <el-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :width="'860px'"
      :visible.sync="dialogOption.show"
      @opened="openedForm"
    >
      <div class="pl24 pr24 pt24">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px">
          <el-form-item label="模版标题：" prop="title">
            <el-input v-model="form.title" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="模版编码：" prop="code">
            <el-input v-model="form.code" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="模版内容：" prop="content">
            <textarea
              id="contentId"
              class="w50"
              rows="4"
              @blur="textareaParamsBlur('contentId','content')"
            ></textarea>
            <div>
              <el-link type="primary" @click="insertAtCaret('contentId','{}')">插入变量</el-link>
            </div>
          </el-form-item>
          <el-form-item label="有效时间：" prop="expireTime">
            <el-input-number v-model="form.day" class="w15" :min="0" :max="999999" /> 天
            <el-input-number v-model="form.hour" class="w15" :min="0" :max="23" /> 时
            <el-input-number v-model="form.minute" class="w15" :min="0" :max="59" /> 分
            <p class="expire-prompt">温馨提示:有效时间可以为0，为0时模版永久有效</p>
          </el-form-item>
          <el-form-item label="业务类型：" prop="business">
            <el-select v-model="form.business" clearable placeholder="请选择业务类型" class="w24">
              <el-option v-for="item in businessTypeList" :key="item.id" :value="item.code" :label="item.des" />
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="text-center">
          <el-button type="primary" @click="handleConfirm">确 定</el-button>
          <el-button class="ml20" @click="dialogOption.show=false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 模板操作清单列表 弹窗 -->
    <el-dialog
      title="模板操作清单列表"
      :close-on-click-modal="false"
      :visible.sync="operatingList.show"
      width="920px"
    >
      <el-button type="primary" class="mb10" @click="openOperatingAddModel">新增</el-button>
      <el-table
        v-loading="operatingList.loading"
        :data="operatingList.list"
        stripe
        style="width: 100%"
      >
        <el-table-column min-width="55" label="序号">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column prop="name" min-width="80" label="操作名称"></el-table-column>
        <el-table-column prop="uri" label="接口地址"></el-table-column>
        <el-table-column prop="params" label="接口参数"></el-table-column>
        <el-table-column min-width="80" label="调用方式">
          <template slot-scope="scope">
            {{ scope.row.method === 1 ? 'get' : (scope.row.method === 2 ? 'post' : '-') }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="openOperatingEditModel(scope.row)">编辑</el-button>
            <el-button size="mini" type="text" @click="delTemplateOperating(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 添加/编辑操作 弹框 -->
    <el-dialog
      :title="operatingAddForm.title"
      :close-on-click-modal="false"
      :visible.sync="operatingAddForm.show"
      width="620px"
      @opened="openedOperating"
    >
      <div class="pl24 pr24 pt24">
        <el-form ref="operatingAddForm" :model="operatingAddForm" :rules="operatingRules" label-width="100px">
          <el-form-item label="操作名称：" prop="name">
            <el-input v-model="operatingAddForm.name" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="接口地址：" prop="uri">
            <el-input v-model="operatingAddForm.uri" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="请求方式：" prop="method">
            <el-select v-model="operatingAddForm.method" clearable placeholder="请选择请求方式" class="w24">
              <el-option :value="1" label="GET" />
              <el-option :value="2" label="POST" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序序号：" prop="seq">
            <el-input v-model="operatingAddForm.seq" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="接口参数：" prop="params">
            <textarea
              id="paramsId"
              class="w40"
              rows="4"
              @blur="textareaParamsBlur('paramsId','params')"
            ></textarea>
            <div>
              <el-link type="primary" @click="insertAtCaret('paramsId','{}')">插入变量</el-link>
            </div>
          </el-form-item>
          <el-form-item label="操作描述：" prop="description">
            <el-input
              v-model="operatingAddForm.description"
              type="textarea"
              class="w40"
              :rows="4"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="text-center">
          <el-button @click="operatingAddForm.show = false">取消</el-button>
          <el-button type="primary" @click="saveOperating">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMessageTemplateList,
  addMessageTemplate,
  updateMessageTemplate,
  getInfoById,
  deleteMsgTemplate,
  getBusinessTypeList,
  getMsgTemplateOptionList,
  addTemplateOption,
  deleteMsgTemplateOption,
  updateTemplateOption
} from '@/api/msg/template'
export default {
  name: 'Template',
  data() {
    const validateExpireTime = (rule, value, callback) => {
      if (this.form.day + this.form.hour + this.form.minute < 0) {
        callback(new Error('请输入有效时间'))
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
      // 模板操作清单列表
      operatingList: {
        show: false,
        templateId: '',
        list: [],
        loading: false
      },
      loading: false,
      dataList: [],
      businessTypeList: [], // 业务类型
      queryForm: {
        title: '', // 标题
        business: '', // 业务类型
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      // 模版form
      form: {
        id: '',
        day: 0, // 天
        hour: 0, // 时
        minute: 0, // 分
        title: '', // 模版标题
        code: '', // 模版编码
        content: '', // 模版内容
        expireTime: 0, // 有效时间
        business: '' // 业务类型
      },
      rules: {
        title: [
          { required: true, message: '请输入模版标题', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入模版编码', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入模版内容', trigger: 'blur' }
        ],
        expireTime: [
          { validator: validateExpireTime, trigger: ['blur', 'change'] }
        ],
        business: [
          { required: true, message: '请选择业务类型', trigger: ['blur', 'change'] }
        ]
      },
      // 新增/编辑操作form
      operatingAddForm: {
        title: '',
        show: false,
        name: '', // 操作名称
        uri: '', // 接口地址
        method: '', // 请求方式
        seq: '', // 排序序号
        params: '', // 接口参数
        description: '' // 操作描述
      },
      operatingRules: {
        name: [
          { required: true, message: '请输入操作名称', trigger: 'blur' }
        ],
        uri: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ],
        method: [
          { required: true, message: '请选择请求方式', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getBusinessTypeList()
    this.getDataList()
  },
  methods: {
    // 获取业务类型
    getBusinessTypeList() {
      getBusinessTypeList({}).then((res) => {
        this.businessTypeList = res.data || []
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.userId)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
    },
    // 查询列表
    getDataList() {
      this.loading = true
      getMessageTemplateList(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 重置table查询
    resetTable() {
      this.resetForm('queryForm')
      this.getDataList()
    },
    // 打开新增模版窗口
    openAdd() {
      this.dialogOption = {
        title: '新增模版',
        show: true,
        loading: false
      }
      this.form = {
        id: '',
        title: '', // 模版标题
        day: 0, // 天
        hour: 0, // 时
        minute: 0, // 分
        code: '', // 模版编码
        content: '', // 模版内容
        expireTime: '', // 有效时间
        business: '' // 业务类型
      }
      this.resetForm('form')
    },
    // dialog 打开动画结束时的回调
    openedForm() {
      document.getElementById('contentId').value = this.form.content
    },
    // 打开编辑模版窗口
    openEdit(row) {
      this.dialogOption = {
        title: '编辑账号',
        show: true,
        loading: false
      }
      this.resetForm('form')
      this.form.day = parseInt(row.expireTime / (24 * 60 * 60))
      this.form.hour = parseInt((row.expireTime - parseInt(this.form.day * (24 * 60 * 60))) / (60 * 60))
      this.form.minute = ((row.expireTime - parseInt(this.form.day * (24 * 60 * 60))) - (this.form.hour * (60 * 60))) / 60
      this.form.title = row.title
      this.form.code = row.code
      this.form.content = row.content
      this.form.business = row.business + ''
      this.form.id = row.id
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
      addMessageTemplate({
        expireTime: this.form.day * 24 * 60 * 60 + this.form.hour * 60 * 60 + this.form.minute * 60,
        title: this.form.title,
        code: this.form.code,
        content: this.form.content,
        business: this.form.business
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
    },
    // 编辑保存
    saveEdit() {
      this.dialogOption.loading = true
      updateMessageTemplate({
        id: this.form.id,
        expireTime: this.form.day * 24 * 60 * 60 + this.form.hour * 60 * 60 + this.form.minute * 60,
        title: this.form.title,
        code: this.form.code,
        content: this.form.content,
        business: this.form.business
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
    },
    // 删除模版
    delTemplate(row) {
      this.$confirm('此操作将删除当前模版, 是否继续?', '模版删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        deleteMsgTemplate([row.id]).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
        })
      })
    },
    // 打开模版操作列表 弹框
    openTemplateOption(id) {
      this.operatingList.loading = true
      this.operatingList.show = true
      this.operatingList.templateId = id
      getMsgTemplateOptionList(id).then((res) => {
        this.operatingList.loading = false
        this.operatingList.list = res.data
      }).catch(() => {
        this.operatingList.loading = false
      })
    },
    // 打开 新增操作 弹框
    openOperatingAddModel() {
      this.operatingAddForm = {
        title: '新增模版操作',
        show: true,
        id: '',
        name: '',
        uri: '',
        method: '',
        seq: '',
        params: '',
        description: ''
      }
      this.resetForm('operatingAddForm')
    },
    // dialog 打开动画结束时的回调
    openedOperating() {
      document.getElementById('paramsId').value = this.operatingAddForm.params
    },
    // 打开 编辑操作 弹框
    openOperatingEditModel(res) {
      this.operatingAddForm = {
        title: '编辑模版操作',
        show: true,
        id: res.id,
        name: res.name,
        uri: res.uri,
        method: res.method,
        seq: res.seq,
        params: res.params,
        description: res.description
      }
      this.resetForm('operatingAddForm')
    },
    // blur 赋值
    textareaParamsBlur(id, param) {
      if (id === 'contentId') {
        this.form[param] = document.getElementById(id).value
      } else {
        this.operatingAddForm[param] = document.getElementById(id).value
      }
    },
    // 新增/编辑操作 保存
    saveOperating() {
      this.$refs['operatingAddForm'].validate((valid) => {
        if (valid) {
          if (this.operatingAddForm.id) {
            updateTemplateOption({
              id: this.operatingAddForm.id,
              name: this.operatingAddForm.name,
              uri: this.operatingAddForm.uri,
              method: this.operatingAddForm.method,
              seq: this.operatingAddForm.seq,
              params: this.operatingAddForm.params,
              description: this.operatingAddForm.description
            }).then(() => {
              this.operatingAddForm.show = false
              this.$notify.success({
                title: '编辑成功'
              })
              this.openTemplateOption(this.operatingList.templateId)
            })
          } else {
            addTemplateOption({
              templateId: this.operatingList.templateId,
              name: this.operatingAddForm.name,
              uri: this.operatingAddForm.uri,
              method: this.operatingAddForm.method,
              seq: this.operatingAddForm.seq,
              params: this.operatingAddForm.params,
              description: this.operatingAddForm.description
            }).then(() => {
              this.operatingAddForm.show = false
              this.$notify.success({
                title: '新增成功'
              })
              this.openTemplateOption(this.operatingList.templateId)
            })
          }
        } else {
          return false
        }
      })
    },
    // 删除模版操作
    delTemplateOperating(row) {
      deleteMsgTemplateOption({ optionIds: row.id }).then(res => {
        this.$notify.success({
          title: '操作成功'
        })
        this.openTemplateOption()
      })
    },
    // 插入变量
    insertAtCaret(domId, textFeildValue) {
      var textObj = document.getElementById(domId)
      // 兼容不支持 selectionStart 浏览器
      if (document.all && textObj.createTextRange && textObj.caretPos) {
        var caretPos = textObj.caretPos
        caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) === '' ? textFeildValue + '' : textFeildValue
      } else if (textObj.setSelectionRange) {
        var rangeStart = textObj.selectionStart
        var rangeEnd = textObj.selectionEnd
        var tempStr1 = textObj.value.substring(0, rangeStart)
        var tempStr2 = textObj.value.substring(rangeEnd)
        textObj.value = tempStr1 + textFeildValue + tempStr2
        textObj.focus()
        var len = textFeildValue.length
        textObj.setSelectionRange(rangeStart + len, rangeStart + len) // 移动光标到添加内容之后
      } else {
        textObj.value += textFeildValue
      }
      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.expire-prompt{
  font-size: 12px;
  color: #666;
  margin: 0;
}
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
