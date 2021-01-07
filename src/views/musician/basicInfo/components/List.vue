<!--
 * @Descripttion: 音乐人基本信息列表
 * @version:
 * @Author: jwj
 * @Date: 2021-01-07 18:33:28
 * @LastEditors: jwj
 * @LastEditTime: 2021-01-07 19:14:23
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
            <el-table-column prop="username" min-width="150" label="作者">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openName(scope.row)">{{ scope.row.username }}({{ scope.row.realname }})</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="url" width="250" label="工种">
              <template slot-scope="scope">{{ scope.row.url }}没有该字段</template>
            </el-table-column>
            <el-table-column prop="statusDes" min-width="150" label="账号状态"></el-table-column>
            <el-table-column prop="expiredTime" min-width="150" label="发布作品数"></el-table-column>
            <el-table-column prop="statusDesc" min-width="80" label="成交作品数"></el-table-column>
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
      :title="dialogOption.title"
      :loading="dialogOption.loading"
      :is-show="dialogOption.show"
      :width="'860px'"
      @handleClose="dialogOption.show = false"
    >
      <div class="pl24 pr24 pt24 pb24">
        详情
      </div>
    </mus-dialog>
  </div>
</template>
<script>
import {
  getList
//   saveAdd,
//   saveEdit,
//   saveDelete,
//   getUserUnderCom
} from '@/api/musician/basicInfo/list'
export default {
  name: 'List',
  components: {
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
      form: {},
      rules: {
        baseName: [
          { required: true, message: '请输入自选库名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
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
    // 打开详情
    openDetails(row) {
      this.dialogOption = {
        title: '详情',
        show: true,
        loading: false
      }
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

