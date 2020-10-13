<template>
  <div class="main">
    <div class="main-content">
      <el-row>
        <el-col :span="14">
          <el-form ref="form" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="请求地址：" prop="baseUrl">
              <el-input v-model="baseUrl" class="w40" placeholder="示例：http://47.94.21.246:8082/musicmanage/"></el-input>
            </el-form-item>
            <el-form-item label="Token：" prop="token">
              <el-input v-model="token" class="w40" placeholder="示例：请求在头部的token"></el-input>
            </el-form-item>
            <el-form-item label="接口地址：" prop="url">
              <el-input v-model="form.url" class="w40" placeholder="示例：/sys/login"></el-input>
            </el-form-item>
            <el-form-item label="请求方式：" prop="method">
              <el-select v-model="method" clearable placeholder="" class="w40">
                <el-option label="POST" value="post" />
                <el-option label="GET" value="get" />
              </el-select>
            </el-form-item>
            <el-form-item label="请求参数：">
              <el-button size="mini" type="primary" @click="addQuert">添加参数</el-button>
            </el-form-item>
            <div class="query-list">
              <div v-for="(item,index) in queryList" :key="index" class="list">
                <el-form :ref="'itemForm-' + index" :model="item" label-width="100px" :inline="true">
                  <el-form-item label="参数类型：" prop="type">
                    <el-select v-model="item.type" clearable placeholder="" class="w40">
                      <el-option label="String" value="string" />
                      <el-option label="Int" value="int" />
                      <el-option label="Ojbect" value="object" />
                      <el-option label="Array" value="array" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="" prop="value">
                    <el-button size="mini" type="danger" @click="deleteQuery(item)">删除</el-button>
                  </el-form-item>
                  <el-form-item label="参数名称：" prop="key">
                    <el-input v-model="item.key" class="w40" placeholder="示例：name"></el-input>
                  </el-form-item>
                  <el-form-item label="参数值：" prop="value">
                    <el-input v-model="item.value" class="w40" placeholder="示例：admin"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <el-form-item>
              <el-button @click="handleResetAll">全部重置</el-button>
              <el-button @click="handleReset">基础重置</el-button>
              <el-button :loading="loading" type="primary" @click="handleConfirm">提交</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="10">
          <span>{{ preTitle }}</span>
          <pre v-html="pre"></pre>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { test } from '@/api/test'
export default {
  name: 'Test',
  data() {
    return {
      loading: false,
      baseUrl: '',
      token: '',
      method: 'post',
      form: {
        url: ''
      },
      preTitle: '',
      pre: null,
      rules: {
        username: [
          { required: true, message: '请输入接口地址', trigger: 'blur' }
        ]
      },
      queryList: []
    }
  },
  methods: {
    addQuert() {
      let json = {
        type: 'string',
        key: '',
        value: ''
      }
      this.queryList.push(json)
    },
    deleteQuery(row) {
      this.queryList.splice(this.queryList.indexOf(row), 1)
    },
    handleResetAll() {
      this.resetForm('form')
      this.token = ''
      this.baseUrl = ''
      this.method = 'post'
      this.loading = false
      this.queryList = []
      this.preTitle = ''
      this.pre = ''
    },
    handleReset() {
      this.preTitle = ''
      this.pre = ''
      this.resetForm('form')
      this.queryList.forEach((item, index) => {
        let name = 'itemForm-' + index
        console.log(name, '--')
        this.$refs[name][0].resetFields()
      })
    },
    // 确认
    handleConfirm() {
      let url = this.baseUrl + this.form.url
      console.log(url, '--url')
      let json = {}
      this.queryList.forEach((item) => {
        if (item.type === 'int') {
          json[item.key] = Number(item.value)
        } else if (item.type === 'object' || item.type === 'object') {
          json[item.key] = JSON.parse(item.value)
        } else {
          json[item.key] = item.value
        }
      })
      console.log(json, '--json')
      test(url, this.token, this.method, json).then(res => {
        this.pre = res
        this.preTitle = '成功消息'
      }).catch((err) => {
        this.preTitle = '失败消息'
        this.pre = err
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.main{
  .main-content{
    margin:0 auto;
    padding: 20px 0;
  }
  .query-list{
    .list{
      border-bottom:1px solid #ff5351;
      margin-bottom:20px;
    }
  }
}
</style>
