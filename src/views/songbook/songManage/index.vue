<!--
 * @Descripttion: 曲库管理---歌曲管理
 * @version:
 * @Author: jwj
 * @Date: 2020-12-26 16:15:26
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-30 20:45:29
-->
<template>
  <div class="main-body">
    <div class="main-content">
      <el-tabs v-model="tabActiveName">
        <el-tab-pane label="词曲" name="1"></el-tab-pane>
        <el-tab-pane label="作曲" name="3"></el-tab-pane>
        <el-tab-pane label="作词" name="4"></el-tab-pane>
        <el-tab-pane label="Beat/BGM" name="2"></el-tab-pane>
      </el-tabs>
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
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="title" min-width="150" label="名称">
              <template slot-scope="scope">
                <span>{{ scope.row.title }}</span>
                <i v-if="tabActiveName === '3'" class="el-icon-video-play"></i>
              </template>
            </el-table-column>
            <el-table-column min-width="150" label="作品标签">
              <template slot-scope="scope">
                <span>{{ scope.row.styleTagsDescArray && scope.row.styleTagsDescArray.join(',') }}</span>
                <span>{{ scope.row.emotionTagsDescArray && scope.row.emotionTagsDescArray.join(',') }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="tabActiveName === '1' || tabActiveName === '3'" min-width="150" label="曲作者">
              <template slot-scope="scope">
                <span>{{ setComposers(scope.row.composers) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="tabActiveName !== '2'" min-width="150" label="词作者">
              <template slot-scope="scope">
                <span>{{ setComposers(scope.row.lyricists) }}</span>
              </template>
            </el-table-column>
            <el-table-column v-if="tabActiveName === '2'" min-width="150" label="制作者">
              <template slot-scope="scope">
                <span>{{ setComposers(scope.row.producers) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="creator" min-width="150" label="上传者"></el-table-column>
            <el-table-column prop="price" min-width="150" label="报价"></el-table-column>
            <el-table-column prop="createdTime" min-width="180" label="发布日期"></el-table-column>
            <!-- <el-table-column prop="statusDesc" min-width="80" label="状态"></el-table-column> -->
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">详情</el-button>
                <!-- <el-button v-if="scope.row.status == 0" size="mini" type="text" @click="getUpShelf(scope.row)">上架</el-button> -->
                <el-button v-if="scope.row.status != 3" size="mini" type="text" @click="getOffShelf(scope.row,3)">下架</el-button>
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
        <el-form ref="form" :model="form" label-width="120px" :inline="true">
          <el-row>
            <el-col :span="12">
              <el-form-item class="mb1" label="作品名：">
                <div class="w24">{{ form.title }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="作品类型：">
                <div class="w24">{{ form.typeDes }}</div>
              </el-form-item>
            </el-col>
            <el-col v-if="tabActiveName === '1' || tabActiveName === '3'" :span="12">
              <el-form-item class="mb1" label="曲作者：">
                <div class="w24">{{ setComposers(form.composers) }}</div>
              </el-form-item>
            </el-col>
            <el-col v-if="tabActiveName !== '2'" :span="12">
              <el-form-item class="mb1" label="词作者：">
                <div class="w24">{{ setComposers(form.lyricists) }}</div>
              </el-form-item>
            </el-col>
            <el-col v-if="tabActiveName === '2'" :span="12">
              <el-form-item class="mb1" label="制作者：">
                <div class="w24">{{ setComposers(form.producers) }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="上传者：">
                <div class="w24">{{ form.creator }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="所属公司：">
                <div class="w24">没有该字段</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="作品标签：">
                <div class="w24">
                  <span v-if="form.styleTagsDescArray && form.styleTagsDescArray.length > 0">{{ form.styleTagsDescArray && form.styleTagsDescArray.join(',') }},</span>
                  <span>{{ form.emotionTagsDescArray && form.emotionTagsDescArray.join(',') }},</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="速度：">
                <div class="w24">{{ form.speedDes }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="作品时长：">
                <div class="w24">{{ form.duration }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="报价：">
                <div class="w24">{{ form.price }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="成交价：">
                <div class="w24">没有该字段</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="预留状态：">
                <div class="w24">没有该字段</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="预留公司：">
                <div class="w24">没有该字段</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="交易状态：">
                <div class="w24">没有该字段</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="购买公司：">
                <div class="w24">没有该字段</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="发布状态：">
                <div class="w24">{{ form.postStatusDesc }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="推广状态：">
                <div class="w24">没有该字段</div>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item class="mb1" label="歌词：">
                <div class="w24">没有该字段</div>
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
  saveDelete
} from '@/api/songbook/songManage'
export default {
  name: 'Review',
  components: {},
  data() {
    return {
      total: 0,
      tabActiveName: '1',
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
  watch: {
    tabActiveName() {
      this.resetForm('queryForm')
      this.getDataList()
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 查询列表
    getDataList() {
      this.loading = true
      let json = JSON.parse(JSON.stringify(this.queryForm))
      json.optionalType = this.tabActiveName
      getDataList(json).then(res => {
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
    // 上架
    getUpShelf(row) {
      this.$confirm('此操作将上架作品, 是否继续?', '作品上架', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let json = {
          id: row.id, // 作品ID
          status: 0, // 作品状态 0未发布 1已发布 -1已删除
          postStatus: ''// 出售状态 0未出售 1已出售 2交易中 3已下架
        }
        saveDelete(json).then(res => {
          this.$notify.success({ title: '操作成功' })
          this.getDataList()
        })
      }).catch(() => {})
    },
    // 下架
    getOffShelf(row, type) {
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

