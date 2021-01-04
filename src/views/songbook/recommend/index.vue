<!--
 * @Descripttion: 精品推荐
 * @version:
 * @Author: jwj
 * @Date: 2020-12-26 16:17:49
 * @LastEditors: JWJ
 * @LastEditTime: 2021-01-04 11:15:38
-->
<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="状态">
              <el-select v-model="queryForm.status" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option value="0" label="未审核" />
                <el-option value="1" label="已通过" />
                <el-option value="2" label="已拒绝" />
              </el-select>
            </el-form-item>
            <el-form-item label="歌曲名">
              <el-input v-model="queryForm.title" class="w24"></el-input>
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
            <el-table-column min-width="55" label="序号">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="title" min-width="150" label="名称"></el-table-column>
            <!-- <el-table-column prop="fineWorkStatusDesc" min-width="80" label="状态"></el-table-column> -->
            <el-table-column prop="tags" min-width="150" label="作品标签"></el-table-column>
            <el-table-column prop="statusDesc" min-width="150" label="曲作者"></el-table-column>
            <el-table-column prop="statusDesc" min-width="150" label="词作者"></el-table-column>
            <el-table-column prop="statusDesc" min-width="150" label="上传者"></el-table-column>
            <el-table-column prop="price" min-width="120" label="报价"></el-table-column>
            <el-table-column prop="boughtTime" min-width="160" label="发布日期"></el-table-column>
            <el-table-column prop="createdTime" min-width="160" label="申请时间"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openExamine(scope.row)">详情</el-button>
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
    <!-- 审核 弹窗 -->
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
              <el-form-item class="mb1" label="曲作者：">
                <div class="w24">{{ form.statusDesc }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="词作者：">
                <div class="w24">{{ form.statusDesc }}</div>
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
                  <!-- <span v-if="form.styleTagsDescArray && form.styleTagsDescArray.length > 0">{{ form.styleTagsDescArray && form.styleTagsDescArray.join(',') }},</span> -->
                  <!-- <span>{{ form.emotionTagsDescArray && form.emotionTagsDescArray.join(',') }}</span> -->
                  <span>{{ form.tags }}</span>
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
            <el-col :span="24">
              <el-form-item class="mb1" label="歌词：">
                <div class="w24">{{ form.lrcContent }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="form.status == 0">
            <el-col :span="24">
              <el-form-item label="审批意见：" prop="auditOpinions">
                <el-input v-model="form.auditOpinions" style="width:600px;" type="textarea" :rows="4" :resize="'none'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label=" ">
                <el-button type="primary" class="w14 mt24 mr24" @click="handleConfirm(1)">通过</el-button>
                <el-button type="danger" class="w14 mt24 mr24" @click="handleConfirm(2)">拒绝</el-button>
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
  saveExamine
} from '@/api/songbook/recommend'
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
        title: '', // 歌曲名
        status: '', // 状态 0未审核 1已通过 2已拒绝
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
    // 打开审核窗口
    openExamine(row) {
      this.dialogOption = {
        title: '详情',
        show: true,
        loading: false
      }
      this.form = JSON.parse(JSON.stringify(row))
      this.resetForm('form')
    },
    // 保存回调 1通过 2作废 3驳回
    handleConfirm(type) {
      let json = {
        status: 0,
        id: this.form.id,
        auditRemarks: this.form.auditRemarks || ''
      }
      let title = ''
      let message = ''
      if (type === 1) {
        json.status = 1
        title = '审核通过'
        message = '此操作将通过当前申请, 是否继续?'
      }
      if (type === 2) {
        if (!this.form.auditRemarks) {
          this.$message.error('请输入审批意见！')
          return false
        }
        json.status = 2
        title = '申请拒绝'
        message = '此操作将拒绝当前申请, 是否继续?'
      }
      this.$confirm(message, title, {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.dialogOption.loading = true
        saveExamine(json).then(res => {
          this.$notify.success({
            title: '操作成功'
          })
          this.getDataList()
          this.dialogOption.show = false
          this.dialogOption.loading = false
        }).catch(() => {
          this.dialogOption.loading = false
        })
      }).catch(() => {

      })
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
