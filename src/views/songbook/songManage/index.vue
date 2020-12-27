<!--
 * @Descripttion: 曲库管理---歌曲管理
 * @version:
 * @Author: jwj
 * @Date: 2020-12-26 16:15:26
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-26 17:11:24
-->
<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="作品名称" prop="title">
              <el-input v-model="queryForm.title" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="上传人姓名" prop="creator">
              <el-input v-model="queryForm.creator" class="w24"></el-input>
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
            <el-table-column prop="title" min-width="150" label="作品名"></el-table-column>
            <el-table-column prop="creator" min-width="150" label="上传人"></el-table-column>
            <el-table-column prop="createdTime" min-width="150" label="上传时间"></el-table-column>
            <el-table-column prop="statusDesc" min-width="80" label="状态"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">详情</el-button>
                <el-button size="mini" type="text" @click="getOffShelf(scope.row)">下架</el-button>
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
        <el-form ref="form" :model="form" label-width="130px" :inline="true">
          <el-form-item class="mb1" label="作品名称：">
            <div class="w24">{{ form.title }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="上传人：">
            <div class="w24">{{ form.creator }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="上传时间：">
            <div class="w24">{{ form.createdTime }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="状态：">
            <div class="w24">{{ form.statusDesc }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="作品价格：">
            <div class="w24">{{ form.price }}</div>
          </el-form-item>
          <el-form-item class="mb1" label="作品类型：">
            <div class="w24">{{ form.typeDes }}</div>
          </el-form-item>
          <el-form-item class="mb10" label="制作人：">
            <div class="w24">{{ setComposers(form.producers) }}</div>
          </el-form-item>
        </el-form>
      </div>
    </mus-dialog>
  </div>
</template>
<script>
import {
  getDataList,
  saveDelete
} from '@/api/songbook/songManage'
export default {
  name: 'Review',
  components: {},
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
        optionalType: 1, // 0词 1曲
        title: '', // 作品名
        creator: '', // 上传人
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      form: {}
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
    // 设置作者
    setComposers(row) {
      let arr = []
      row && row.forEach(item => {
        if (item) {
          arr.push(item.name || '')
        }
      })
      return arr.join(',')
    },
    // 打开详情接口
    openDetails(row) {
      this.dialogOption = {
        title: '详情',
        show: true,
        loading: false
      }
      this.form = row
      this.resetForm('form')
    },
    // 下架
    getOffShelf(row) {
      this.$confirm('此操作将下架作品, 是否继续?', '作品下架', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let json = {
          id: row.id, // 作品ID
          status: '', // 作品状态 0未发布 1已发布 -1已删除
          postStatus: '3'// 出售状态 0未出售 1已出售 2交易中 3已下架
        }
        saveDelete(json).then(res => {
          this.$notify.success({ title: '操作成功' })
          this.getDataList()
        })
      }).catch(() => {})
    },
    // 删除
    openDelete(row) {
      this.$confirm('此操作将删除作品, 是否继续?', '作品删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let json = {
          id: row.id, // 作品ID
          status: '-1', // 作品状态 0未发布 1已发布 -1已删除
          postStatus: ''// 出售状态 0未出售 1已出售 2交易中 3已下架
        }
        saveDelete(json).then(res => {
          this.$notify.success({ title: '操作成功' })
          this.getDataList()
        })
      }).catch(() => {})
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

