
<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="用户账号" prop="username">
              <el-input v-model="queryForm.username" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="用户姓名" prop="realName">
              <el-input v-model="queryForm.realName" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="登录地" prop="cname">
              <el-input v-model="queryForm.cname" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="IP" prop="ip">
              <el-input v-model="queryForm.ip" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="timeList"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
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
      </el-form>
      <el-row class="pb10">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="dataList"
            stripe
            style="width: 100%"
          >
            <el-table-column prop="realName" min-width="150" label="登录人姓名"></el-table-column>
            <el-table-column prop="username" min-width="150" label="登录人账号"></el-table-column>
            <el-table-column prop="cname" min-width="150" label="登录地"></el-table-column>
            <el-table-column prop="ip" min-width="150" label="登录IP"></el-table-column>
            <el-table-column prop="createdTime" min-width="180" label="登录时间"></el-table-column>
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
  </div>
</template>
<script>
import {
  getDataList
} from '@/api/log/login/company'
export default {
  name: 'LogLoginCompany',
  data() {
    return {
      total: 0,
      loading: false,
      dataList: [],
      queryForm: {
        cname: null, // 登录地
        username: null, // 账号
        realName: null, // 姓名
        ip: '',
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      timeList: [] // 时间范围
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 查询列表
    getDataList() {
      this.loading = true
      this.queryForm.startTime = this.timeList && this.timeList[0]
      this.queryForm.endTime = this.timeList && this.timeList[1]
      getDataList(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
