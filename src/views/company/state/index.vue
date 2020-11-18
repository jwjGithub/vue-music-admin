<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="公司名称" prop="com_name">
              <el-input v-model="queryForm.com_name" class="w24"></el-input>
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
            <el-table-column prop="realname" min-width="150" label="申请人姓名">
              <template slot-scope="scope">
                {{ scope.row.sysUserEntity && scope.row.sysUserEntity.realname }}
              </template>
            </el-table-column>
            <el-table-column prop="companyName" min-width="150" label="公司名称"></el-table-column>
            <el-table-column prop="createTime" min-width="150" label="申请时间">
              <template slot-scope="scope">
                {{ scope.row.sysUserEntity && scope.row.sysUserEntity.createTime }}
              </template>
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="状态">
              <template slot-scope="scope">
                <template v-if="scope.row.sysUserEntity">
                  <span v-if="scope.row.sysUserEntity.status == 0" class="c-darkBlue">正常</span>
                  <span v-if="scope.row.sysUserEntity.status == 1" class="c-red">作废</span>
                  <span v-if="scope.row.sysUserEntity.status == 2" class="c-darkBlue">审核中</span>
                  <span v-if="scope.row.sysUserEntity.status == 3" class="c-red">退回</span>
                </template>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">修改</el-button>
                <el-button size="mini" type="text" @click="openDetails(scope.row)">详情</el-button>
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
    <!-- 详情 弹窗 -->
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
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" :inline="true">
          <el-form-item class="mb1" label="管理员账号：" prop="username">
            <div class="w24">{{ form.username }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="管理员姓名：" prop="realname">
            <div class="w24">{{ form.realname }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="手机号：" prop="mobile">
            <div class="w24">{{ form.mobile }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="邮箱：" prop="email">
            <div class="w24">{{ form.email }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="性别：" prop="gender">
            <div class="w24">{{ form.gender == 'male' ? '男' : (form.gender == 'female' ? '女' : '未知') }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="公司名：" prop="companyName">
            <div class="w24">{{ form.companyName }}</div>
          </el-form-item>
          <el-form-item class="mb10" label="地址：" prop="address">
            <div class="w24">{{ form.address }}</div>
          </el-form-item>
          <el-form-item class="mb10" label="网址：" prop="url">
            <div class="w24">{{ form.url }}</div>
          </el-form-item>
          <el-form-item class="mb10" label="公司性质：" prop="companyType">
            <div class="w24">
              <span v-if="form.companyType == 1" class="c-darkBlue">国有企业</span>
              <span v-if="form.companyType == 2" class="c-darkBlue">集体企业</span>
              <span v-if="form.companyType == 3" class="c-darkBlue">联营企业</span>
              <span v-if="form.companyType == 4" class="c-darkBlue">股份合作制企业</span>
              <span v-if="form.companyType == 5" class="c-darkBlue">私营企业</span>
              <span v-if="form.companyType == 6" class="c-darkBlue">合伙企业</span>
            </div>
          </el-form-item>
          <el-form-item class="mb10" label="状态：" prop="status">
            <div class="w24">
              <span v-if="form.status == 0" class="c-darkBlue">正常</span>
              <span v-if="form.status == 1" class="c-red">作废</span>
              <span v-if="form.status == 2" class="c-darkBlue">审核中</span>
              <span v-if="form.status == 3" class="c-red">退回</span>
            </div>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item class="mb10" label="公司资质：" prop="imgUrl">
                <el-image
                  style="width: 100px; height: 100px"
                  :src="form.imgUrl"
                  :preview-src-list="[form.imgUrl]"
                >
                </el-image>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item class="mb10" label="公司介绍：" prop="introduction">
                <el-scrollbar wrap-class="scrollbar-wrapper">
                  <div class="content-editor" v-html="form.introduction"></div>
                </el-scrollbar>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </mus-dialog>
    <!-- 新增/修改 弹窗 -->
    <mus-dialog
      :title="dialogEdit.title"
      :loading="dialogEdit.loading"
      :is-show="dialogEdit.show"
      :width="'860px'"
      @handleClose="dialogEdit.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="editForm" :model="form" :rules="rules" label-width="130px" :inline="true">
          <el-form-item label="管理员账号：" prop="username">
            <el-input v-model="form.username" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="管理员姓名：" prop="realname">
            <el-input v-model="form.realname" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="手机号：" prop="mobile">
            <el-input v-model="form.mobile" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" prop="email">
            <el-input v-model="form.email" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="性别：" prop="gender">
            <el-select v-model="form.gender" clearable placeholder="" class="w24">
              <el-option label="男" value="male" />
              <el-option label="女" value="female" />
              <el-option label="未知" value="unknow" />
            </el-select>
          </el-form-item>
          <el-form-item label="公司名：" prop="companyName">
            <el-input v-model="form.companyName" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="地址：" prop="address">
            <el-input v-model="form.address" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="公司网址：" prop="url">
            <el-input v-model="form.url" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="公司性质：" prop="companyType">
            <el-select v-model="form.companyType" clearable placeholder="" class="w24">
              <el-option label="国有企业" :value="1" />
              <el-option label="集体企业" :value="2" />
              <el-option label="联营企业" :value="3" />
              <el-option label="股份合作制企业" :value="4" />
              <el-option label="私营企业" :value="5" />
              <el-option label="合伙企业" :value="6" />
            </el-select>
          </el-form-item>
          <el-form-item class="mb10" label="状态：" prop="status">
            <el-select v-model="form.status" clearable placeholder="" class="w24">
              <el-option label="正常" :value="0" />
              <el-option label="作废" :value="1" />
              <el-option label="审核中" :value="2" />
              <el-option label="退回" :value="3" />
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item class="mb10" label="公司资质：" prop="url">
                <el-upload
                  class="avatar-uploader w24"
                  :headers="{token: getToken()}"
                  :action="baseURL + '/company/signup/uploadImg'"
                  accept="image/*"
                  :before-upload="handleBeforeUpload"
                  :show-file-list="false"
                  :on-success="handleSuccess"
                >
                  <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="公司介绍：" style="padding-bottom:66px;" prop="introduction">
                <Editor v-model="form.introduction" class="w50" />
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
  updateCompanyInfo
} from '@/api/company/review'
import Editor from '@/components/Editor'
export default {
  name: 'Review',
  components: {
    Editor
  },
  data() {
    return {
      total: 0,
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      // 修改弹窗对象
      dialogEdit: {
        title: '',
        show: false,
        loading: false
      },
      loading: false,
      dataList: [],
      queryForm: {
        com_name: '', // 公司名称
        status: '0,1,2,3', // 审核状态，0正常，1作废，2审核中，3退回，多种状态传 1,2
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
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ],
        companyName: [
          { required: true, message: '请输入公司名称', trigger: ['blur', 'change'] }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: ['blur', 'change'] }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: ['blur', 'change'] }
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
      let json = row.sysUserEntity || {}
      this.form = {
        imgUrl: row.lisence && row.lisence.tempUrl || '',
        id: row.id,
        username: json.username, // 管理员账号：
        realname: json.realname, // 管理员姓名：
        mobile: json.mobile, // 手机号
        email: json.email, // 邮箱
        gender: json.gender, //  性别 male 男 female 女 unknown 未知
        companyName: row.companyName, // 公司名
        address: row.address, // 地址
        url: row.url, // 公司网址
        companyType: row.companyType, // 公司性质
        status: json.status, // 状态
        lisenceAtt: row.lisence && row.lisence.id || '', // 公司资质
        introduction: row.introduction, // 公司介绍
        auditRemarks: row.auditRemarks // 备注
      }
      //       管理员账号 管理员姓名
      // 手机号 邮箱
      // 性别 公司名
      // 地址 网址
      // 公司性质 状态
      // 营业执照
      // 公司介绍
      this.resetForm('form')
    },
    // 打开修改功能
    openEdit(row) {
      this.dialogEdit = {
        title: '修改',
        show: true,
        loading: false
      }
      let json = row.sysUserEntity || {}
      this.form = {
        imgUrl: row.lisence && row.lisence.tempUrl || '',
        id: row.id,
        username: json.username, // 管理员账号：
        realname: json.realname, // 管理员姓名：
        mobile: json.mobile, // 手机号
        email: json.email, // 邮箱
        gender: json.gender, //  性别 male 男 female 女 unknown 未知
        companyName: row.companyName, // 公司名
        address: row.address, // 地址
        url: row.url, // 公司网址
        companyType: row.companyType, // 公司性质
        status: json.status, // 状态
        lisenceAtt: row.lisence && row.lisence.id || '',
        introduction: row.introduction, // 公司介绍
        auditRemarks: row.auditRemarks // 备注
      }
      this.resetForm('editForm')
    },
    // 保存回调 1通过 2作废 3驳回
    handleConfirm(type) {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          this.dialogEdit.loading = true
          updateCompanyInfo(this.form).then(res => {
            this.dialogEdit.loading = false
            this.dialogEdit.show = false
            this.getDataList()
          }).catch(() => {
            this.dialogEdit.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 选择文件回调
    handleBeforeUpload(file) {
      const reg = '.*\\.(jpg|png|gif|JPG|PNG|GIF)'
      if (file.name.match(reg) == null) {
        this.$notify.error({ title: '对不起，上传格式不正确，请重新上传' })
        return false
      }
      if (file.size > 1024 * 1024 * 10) {
        this.$notify.error({ title: '对不起，文件不能大于10M，请重新上传' })
        return false
      }
      return true
    },
    // 上传成功回调
    handleSuccess(res, file, fileList) {
      this.form.imgUrl = res.data.url
      this.form.lisenceAtt = res.data.id
    }
  }
}
</script>
<style lang="scss" scoped>
// 头像上传样式
  .avatar-uploader{
    text-align: left;
    .el-upload {
      border: 1px dashed #d9d9d9;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      // &:hover {
      //   border-color: #409EFF;
      // }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
      }
      .avatar {
        width: 100px;
        height: 100px;
        display: block;
      }
    }
  }
</style>
