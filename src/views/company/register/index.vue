<template>
  <div class="main-body">
    <div class="main-content">
      <!-- <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="queryForm.username" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="queryForm.mobile" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryForm.status" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option :value="0" label="正常" />
                <el-option :value="1" label="停用" />
              </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="starttime">
              <el-date-picker
                v-model="queryForm.starttime"
                class="w24"
                type="datetime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endtime">
              <el-date-picker
                v-model="queryForm.endtime"
                class="w24"
                type="datetime"
                placeholder="结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
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
      </el-form> -->
      <el-row class="pt20 pb10">
        <el-col :span="24">
          <el-button type="primary" class="mr20 mb10" @click="openAdd">注册</el-button>
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
            <el-table-column prop="realname" min-width="150" label="申请人姓名">
              <template slot-scope="scope">
                {{ scope.row.sysUserEntity && scope.row.sysUserEntity.realname }}
              </template>
            </el-table-column>
            <el-table-column prop="companyName" min-width="150" label="公司姓名"></el-table-column>
            <el-table-column prop="createTime" min-width="150" label="申请时间">
              <template slot-scope="scope">
                {{ scope.row.sysUserEntity && scope.row.sysUserEntity.createTime }}
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">修改</el-button>
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
      :width="'600px'"
      @handleClose="dialogOption.show = false"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-steps :active="addActive" align-center>
          <el-step title="第一步" description="验证手机"></el-step>
          <el-step title="第二步" description="验证邮箱"></el-step>
          <el-step title="第三步" description="填写个人信息"></el-step>
          <el-step title="第四步" description="填写公司信息"></el-step>
        </el-steps>
        <el-form ref="form" :model="form" :rules="rules" label-width="160px" :inline="true" class="mt20">
          <el-form-item v-if="addActive == 0" label="用户姓名：" prop="username">
            <el-input v-model="form.username" class="w24"></el-input>
          </el-form-item>
          <el-form-item v-if="addActive == 0" label="手机号：" prop="mobile">
            <el-input v-model="form.mobile" class="w24"></el-input>
          </el-form-item>
          <el-form-item v-if="addActive == 0" label="验证码：" prop="phoneCode">
            <div class="w24 text-left">
              <el-input v-model="form.phoneCode" class="w10"></el-input>
              <el-button type="success" class="w13 ml10" :disabled="phoneSendCodeType" @click="getPhoneSendCode">{{ phoneSendCodeCount }}</el-button>
            </div>
          </el-form-item>
          <el-form-item v-if="addActive == 1" label="邮箱：" prop="email">
            <el-input v-model="form.email" class="w24"></el-input>
          </el-form-item>
          <el-form-item v-if="addActive == 1" label="验证码：" prop="phoneCode">
            <el-input v-model="form.phoneCode" class="w10"></el-input>
            <el-button type="success" class="w13 ml10" :disabled="phoneSendCodeType" @click="getPhoneSendCode">{{ phoneSendCodeCount }}</el-button>
          </el-form-item>
          <el-form-item v-if="addActive == 2" label="真名：" prop="realname">
            <el-input v-model="form.realname" class="w24"></el-input>
          </el-form-item>
          <el-form-item v-if="addActive == 2" label="性别：" prop="gender">
            <el-select v-model="form.gender" clearable placeholder="" class="w24">
              <el-option label="男" value="MALE" />
              <el-option label="女" value="FEMALE" />
              <el-option label="未知" value="UNKNOW" />
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" class="w24 mt24" @click="handleConfirm">下一步</el-button>
          </el-form-item>
        </el-form>
      </div>
    </mus-dialog>
  </div>
</template>
<script>
import {
  saveAdd,
  saveEdit,
  getSelectList,
  getInfoById
} from '@/api/system/account'
import {
  getDataList,
  getPhoneSendCode
} from '@/api/company/register'
export default {
  name: 'Register',
  data() {
    return {
      addActive: 0, // 添加步骤
      phoneSendCodeType: false, // 获取手机验证码状态 false 可以获取 true 不可获取
      phoneSendCodeCount: '获取验证码',
      emailSendCodeType: false, // 获取邮箱验证码状态 false 可以获取 true 不可获取
      emailSendCodeCount: '获取验证码',
      total: 0,
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
      timeList: [],
      loading: false,
      dataList: [],
      roleList: [], // 角色列表
      queryForm: {
        status: '', // 审核状态，0正常，1作废，2审核中，3退回，多种状态传 1,2
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      form: {
        phoneCode: '', // 手机验证码
        emailCode: '', // 邮箱验证码
        username: '', // 用户名
        email: '', // 邮箱
        mobile: '', // 手机号
        realname: '', // 真名
        gender: '', //  性别 male 男 female 女 unknown 未知
        companyName: '', // 公司名
        address: '', // 地址
        introduction: '', // 公司介绍
        file: '' // 公司附件
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        phoneCode: [
          { required: true, message: '请输入手机验证码', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '请选择用户状态', trigger: ['blur', 'change'] }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
        ],
        userManageroleId: [
          { required: true, message: '请选择角色', trigger: ['blur', 'change'] }
        ]
      }

    }
  },
  created() {
    this.getSelectList()
    this.getDataList()
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.userId)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
    },
    // 查询列表
    getDataList() {
      this.loading = true
      getDataList(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      })
    },
    // 查询角色列表
    getSelectList() {
      getSelectList().then(res => {
        this.roleList = res.data || []
      })
    },
    // 打开新增窗口
    openAdd() {
      this.dialogOption = {
        title: '注册',
        show: true,
        loading: false
      }
      this.form = {
        username: '', // 用户名
        email: '', // 邮箱
        mobile: '', // 手机号
        realname: '', // 真名
        gender: '', //  性别 male 男 female 女 unknown 未知
        companyName: '', // 公司名
        address: '', // 地址
        introduction: '', // 公司介绍
        file: '' // 公司附件
      }
      this.resetForm('form')
    },
    // 打开编辑窗口
    openEdit(row) {
      this.dialogOption = {
        title: '编辑账号',
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
          // if (this.form.userId) {
          //   this.saveEdit()
          // } else {
          //   this.saveAdd()
          // }
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
    // 获取手机验证码
    getPhoneSendCode() {
      let bl = true
      this.$refs['form'].validateField(['mobile', 'username'], valid => { // 验证手机号码是否正确
        if (!valid) {
          let json = {
            mobile: this.form.mobile,
            username: this.form.username
          }
          getPhoneSendCode(json).then(res => {
            console.log(res, '--res')
          })
          console.log('手机号正确')
        } else {
          bl = false
          return false
        }
      })
      console.log('效验')
      if (!bl) return false
      let _this = this
      this.phoneSendCodeType = true
      this.phoneSendCodeCount = '60秒后重新获取'
      let count = 60
      let indexS = ''
      // get_send_code(_this.$axios, { phone: _this.activationForm.username }).then(res => {
      //   let _data = res.data
      //   if (_data.statusCode === 200) {

      //   } else {
      //     _this.$Message.error(_data.statusMsg)
      //   }
      // }).catch(error => {
      //   console.log(error)
      // })
      function countTimeout() {
        indexS = setTimeout(() => {
          if (count <= 1) {
            _this.phoneSendCodeType = false
            _this.phoneSendCodeCount = '获取验证码'
          } else {
            count -= 1
            _this.phoneSendCodeCount = count + '秒后重新获取'
            countTimeout()
          }
        }, 1000)
      }
      countTimeout()
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
