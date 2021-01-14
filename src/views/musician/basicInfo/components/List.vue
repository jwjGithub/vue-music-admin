<!--
 * @Descripttion: 音乐人基本信息列表
 * @version:
 * @Author: jwj
 * @Date: 2021-01-07 18:33:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-14 22:33:18
-->
<template>
  <div class="main-page">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="音乐人姓名">
              <el-input v-model="queryForm.username" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="账号状态" prop="status">
              <el-select v-model="queryForm.status" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option value="0" label="正常" />
                <el-option value="1" label="停用" />
                <!-- <el-option value="1" label="封号" /> -->
                <!-- <el-option value="2" label="注销" /> -->
              </el-select>
            </el-form-item>
            <el-form-item label="入驻时间">
              <el-date-picker v-model="queryForm.starttime" type="datetime" class="w24" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </div>
          <div class="right-btn">
            <el-form-item>
              <el-button type="primary" :loading="loading" @click="getList">
                <i class="el-icon-search"></i>
                <span>搜索</span>
              </el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-row class="pt20 pb10">
        <el-col :span="24">
          <!-- <el-button type="primary" class="mr20 mb10" @click="openAdd">新增</el-button> -->
          <!-- <el-button type="danger" class="mr20 mb10" :disabled="selectOption.multiple" @click="openDelete(null,2)">批量删除</el-button> -->
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
            <el-table-column prop="stageName" min-width="150" label="作者">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openName(scope.row)">{{ scope.row.stageName }}({{ scope.row.realname }})</el-button>
              </template>
            </el-table-column>
            <el-table-column width="250" label="工种">
              <template slot-scope="scope">{{ scope.row.professionDescArray.join(',') }}</template>
            </el-table-column>
            <el-table-column prop="statusDes" min-width="150" label="账号状态"></el-table-column>
            <el-table-column prop="postNum" min-width="150" label="发布作品数"></el-table-column>
            <el-table-column prop="dealNum" min-width="80" label="成交作品数"></el-table-column>
            <el-table-column prop="createTime" min-width="80" label="入驻时间"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">编辑</el-button>
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
        @pagination="getList"
      />
    </div>
    <!-- 新增/修改 弹窗 -->
    <mus-dialog
      :title="dialogEdit.title"
      :loading="dialogEdit.loading"
      :is-show="dialogEdit.show"
      :width="'1300px'"
      @handleClose="dialogEdit.show = false"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="editForm" :model="editForm" label-width="130px" :inline="true">
          <el-row :gutter="30">
            <!-- 左边 -->
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <h3>基本信息</h3>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="艺名：">
                    <el-input v-model="editForm.stageName" class="w24"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="工种：">
                    <el-select v-model="editForm.professionArray" multiple clearable placeholder="请选择工种" class="w24">
                      <el-option value="" label="全部" />
                      <el-option v-for="(item,index) in professionList" :key="index" :value="item.code" :label="item.des" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="头像：">
                    <el-input v-model="editForm.profile" class="w24"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="个人简介：">
                    <div class="h25 w45">
                      <Editor v-model="editForm.introduction" style="width:100%;" />
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <h3>实名信息</h3>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="身份证正反面：">
                    <el-input v-model="editForm.front" class="w24"></el-input>
                    <el-input v-model="editForm.back" class="w24"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <!-- 右边 -->
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <h3>账号信息</h3>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="用户名：">
                    <el-input v-model="editForm.username" class="w24"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="密码：">
                    <el-input v-model="editForm.password" type="password" class="w24"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="手机号：">
                    <el-input v-model="editForm.mobile" class="w24"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="邮箱：">
                    <el-input v-model="editForm.email" class="w24"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="注册时间：">
                    <el-date-picker v-model="editForm.createTime" type="datetime" class="w24" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="账号状态：">
                    <el-select v-model="editForm.status" clearable placeholder="请选择状态" class="w24">
                      <el-option value="" label="全部" />
                      <el-option :value="0" label="正常" />
                      <el-option :value="1" label="停用" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="封禁时间：">
                    <el-date-picker v-model="editForm.banTime" type="datetime" class="w24" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="解禁时间：">
                    <el-date-picker v-model="editForm.unsealTime" type="datetime" class="w24" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="封号原因：">
                    <el-input v-model="editForm.banReason" class="w24"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </mus-dialog>
    <!-- 详情 弹窗 -->
    <mus-dialog
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :is-show-ok="false"
      :is-show-close="false"
      :width="'1300px'"
      @handleClose="dialogOption.show = false"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" label-width="130px" :inline="true">
          <el-row :gutter="30">
            <!-- 左边 -->
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <h3>基本信息</h3>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="真实姓名：">
                    <div>{{ form.base && form.base.realname }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="艺名：">
                    <div>{{ form.base && form.base.stageName }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item class="mb1" label="工种：">
                    <div>{{ form.base && form.base.professionArrayDesc.join(',') }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item class="mb1" label="头像：">
                    <div class="w10 h10">
                      <img class="w100 h100" :src="form.base && form.base.profileUrl">
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item class="mb1" label="个人简介：">
                    <div v-html="form.base && form.base.introduction"></div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <h3>实名信息</h3>
                </el-col>
                <el-col :span="24">
                  <el-form-item class="mb1" label="真身份证号：">
                    <div>{{ form.idMessage && form.idMessage.url }}没有该字段</div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item class="mb1" label="身份证正反面：">
                    <div class="w10 h10">
                      <img class="w100 h100" :src="form.idMessage && form.idMessage.frontUrl">
                    </div>
                    <div class="w10 h10">
                      <img class="w100 h100" :src="form.idMessage && form.idMessage.backUrl">
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <h3>账户信息</h3>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="资产余额：">
                    <div>{{ form.base && form.base.title }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="积分余额：">
                    <div>{{ form.base && form.base.title }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item class="mb1" label="绑定支付宝账号：">
                    <div>{{ form.base && form.base.title }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item class="mb1" label="绑定银行卡账号：">
                    <div>{{ form.base && form.base.title }}</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
            <!-- 右边 -->
            <el-col :span="12">
              <el-row>
                <el-col :span="24">
                  <h3>账号信息</h3>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="用户名：">
                    <div>{{ form.account && form.account.username }}</div>
                  </el-form-item>
                </el-col>
                <!-- <el-col :span="12">
                  <el-form-item class="mb1" label="密码：">
                    <div>{{ form.account && form.account.password }}</div>
                  </el-form-item>
                </el-col> -->
                <el-col :span="12">
                  <el-form-item class="mb1" label="手机号：">
                    <div>{{ form.account && form.account.mobile }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="邮箱：">
                    <div>{{ form.account && form.account.email }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="注册时间：">
                    <div>{{ form.account && form.account.registerTime }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="账号状态：">
                    <div>{{ form.account && form.account.statusDes }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="封号时长：">
                    <div>{{ form.account && form.account.banDays }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="日期：">
                    <div>{{ form.account && form.account.banTime }} - {{ form.account && form.account.unsealTime }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="封号原因：">
                    <div>{{ form.account && form.account.banReason }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <h3>作品信息</h3>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="全部作品：">
                    <div>{{ form.workMessage && form.workMessage.allNum }}首</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="发布中作品：">
                    <div>{{ form.workMessage && form.workMessage.postNum }}首</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="未售作品：">
                    <div>{{ form.workMessage && form.workMessage.unsoldNum }}首</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="已售作品：">
                    <div>{{ form.workMessage && form.workMessage.soldNum }}首</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="交易中作品：">
                    <div>{{ form.workMessage && form.workMessage.tradingNum }}首</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="下架作品：">
                    <div>{{ form.workMessage && form.workMessage.offShelfNum }}首</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="已删除作品：">
                    <div>{{ form.workMessage && form.workMessage.deleteNum }}首</div>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <h3>推广信息</h3>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="精品推荐：">
                    <div>{{ form.spreadMessage && form.spreadMessage.spreadNum }}首</div>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item class="mb1" label="其它推广：">
                    <div>{{ form.spreadMessage && form.spreadMessage.title }}首</div>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </mus-dialog>
  </div>
</template>
<script>
import {
  getList,
  getMusicianDetail,
  getProfessionSelect
//   saveAdd,
//   saveEdit,
//   saveDelete,
//   getUserUnderCom
} from '@/api/musician/basicInfo/list'
import Editor from '@/components/Editor'
export default {
  name: 'List',
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
      total: 0,
      loading: false,
      dataList: [],
      userList: [], // 用户列表
      queryForm: {
        starttime: '', // 创建时间开始时间
        endtime: '', // 创建时间结束时间
        username: '',	// 用户名称
        mobile: '', // 手机号
        status: '', // 用户状态 0正常 1停用
        page: 1, // 当前页
        limit: 10// 每页条数
      },
      // 默认弹窗对象
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      dialogEdit: {
        title: '',
        show: false,
        loading: false
      },
      form: {},
      editForm: {},
      professionList: []// 工种列表
      // rules: {
      //   baseName: [
      //     { required: true, message: '请输入自选库名称', trigger: 'blur' }
      //   ]
      // }
    }
  },
  created() {
    this.getList()
    getProfessionSelect().then(res => {
      this.professionList = res.data || []
    })
  },
  methods: {
    // 查询列表
    getList() {
      this.loading = true
      getList(this.queryForm).then(res => {
        console.log(this.queryForm)
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 点击作者名称
    openName(row) {
      let form = {
        id: row.userId,
        name: `${row.username}(${row.realname})`
        // createdTime: row.createdTime,
      }
      let json = {
        title: `${row.username}(${row.realname})`,
        form: form
      }
      this.$emit('addTab', json)
    },
    // 打开编辑
    openEdit(row) {
      this.dialogEdit = {
        title: '编辑',
        show: true,
        loading: false
      }
      getMusicianDetail({ userId: row.userId }).then(res => {
        let info = res.data || {}
        this.editForm = {
          id: info?.base?.userId, // 用户id
          username: info?.account?.username, // 用户账号
          password: info?.account?.password, // 用户密码
          mobile: info?.account?.mobile, // 用户手机
          email: info?.account?.email, // 用户邮箱
          createTime: info?.account?.registerTime, // 注册时间
          status: info?.account?.status, // 用户状态 0正常 1停用 -1删除
          banTime: info?.account?.banTime, // 封禁时间
          unsealTime: info?.account?.unsealTime, // 解禁时间
          banReason: info?.account?.banReason, // 封号原因
          profile: info?.base?.profileUrl, // 用户头像，传上传图片接口返回的ID
          stageName: info?.base?.stageName, // 音乐人艺名
          professionArray: info?.base?.professionArray.map(String), // 音乐人工种数组
          introduction: info?.base?.introduction, // 音乐人简介
          front: info?.idMessage?.frontUrl, // 身份证正面图片
          back: info?.idMessage?.backUrl// 身份证反面图片
        }
      })
    },
    // 打开详情
    openDetails(row) {
      this.dialogOption = {
        title: '详情',
        show: true,
        loading: false
      }
      getMusicianDetail({ userId: row.userId }).then(res => {
        this.form = res.data || {}
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main-page{
  width:100%;
  height:100%;
  >.main-content{
    width:100%;
    height:100%;
    display:flex;
    flex-direction: column;
    >.header{
      margin-bottom: 10px;
      height:60px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      >.left{
        padding-left:20px;
        display: flex;
        align-items:center;
        >.tag{
          width: 4px;
          height: 24px;
          background: #65a3dd;
        }
        >.title{
          font-size: 20px;
          color: #65a3dd;
        }
      }
      >.right{
        display: flex;
        align-items:center;
        .search-input{
          ::v-deep .el-input__inner{
            background-color:#f8f8f8;
          }
        }
      }
    }
    >.content{
      flex:1;
      overflow: hidden;
      >.lists{
        width:100%;
        height:100%;
      }
    }
  }
}
</style>

