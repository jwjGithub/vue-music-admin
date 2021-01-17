<!--
 * @Descripttion: 音乐人基本信息详情
 * @version:
 * @Author: jwj
 * @Date: 2021-01-07 18:33:28
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-17 21:18:12
-->
<template>
  <div class="main-page">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="作品名称">
              <el-input v-model="queryForm.title" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="作品类型">
              <el-select v-model="queryForm.type" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option value="1" label="词曲" />
                <el-option value="2" label="Beat/BGM" />
                <el-option value="3" label="作曲" />
                <el-option value="4" label="作词" />
              </el-select>
            </el-form-item>
            <el-form-item label="发布状态">
              <el-select v-model="queryForm.postStatus" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option value="0" label="未发布" />
                <el-option value="1" label="已发布" />
              </el-select>
            </el-form-item>
            <el-form-item label="出售状态">
              <el-select v-model="queryForm.status" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option value="0" label="未出售" />
                <el-option value="1" label="已出售" />
                <el-option value="2" label="交易中" />
                <el-option value="3" label="已下架" />
              </el-select>
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
            <el-table-column width="250" label="作品类型" prop="typeDes"></el-table-column>
            <el-table-column min-width="150" label="作品标签">
              <template slot-scope="scope">{{ scope.row.styleTagsDescArray && scope.row.styleTagsDescArray.join(',') }}</template>
            </el-table-column>
            <el-table-column prop="postStatusDesc" min-width="150" label="发布状态"></el-table-column>
            <el-table-column prop="statusDesc" min-width="150" label="交易状态"></el-table-column>
            <el-table-column min-width="150" label="曲作者">
              <template slot-scope="scope">{{ setComposers(scope.row.composers) }}</template>
            </el-table-column>
            <el-table-column min-width="150" label="词作者">
              <template slot-scope="scope">{{ setComposers(scope.row.lyricists) }}</template>
            </el-table-column>
            <el-table-column min-width="150" label="制作人">
              <template slot-scope="scope">{{ setComposers(scope.row.producers) }}</template>
            </el-table-column>
            <el-table-column prop="createdTime" min-width="150" label="发布时间"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openDetails(scope.row)">详情</el-button>
                <el-button :disabled="scope.row.status == 3" size="mini" type="text" @click="openDown(scope.row)">下架</el-button>
                <el-button size="mini" type="text" @click="openDelete(scope.row)">删除</el-button>
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
          <el-row>
            <el-col :span="12">
              <el-form-item class="mb1" label="作品名：">
                <div>{{ form.title }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="作品类型：">
                <div>{{ form.typeDes }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="曲作者：">
                <div>{{ setComposers(form.composers) }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="词作者：">
                <div>{{ setComposers(form.lyricists) }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="上传者：">
                <div>{{ form.creator }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="所属公司：">
                <div>{{ form.belongCompanyName }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="作品标签：">
                <div>{{ form.styleTagsDescArray && form.styleTagsDescArray.join(',') }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="速度：">
                <div>{{ form.speedDes }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="作品时长：">
                <div>{{ form.duration }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="报价：">
                <div>{{ form.price }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="成交价：">
                <div>{{ form.cost }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="预留状态：">
                <div>{{ form.isReservation === 0 ? '否' : '是' }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="预留公司：">
                <div>{{ form.reservationCompanyNameArray && form.reservationCompanyNameArray.join(',') }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="交易状态：">
                <div>{{ form.statusDesc }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="购买公司：">
                <div>{{ form.buyerName }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="发布状态：">
                <div>{{ form.postStatusDesc }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="推广状态：">
                <div>没有该字段</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="歌词：">
                <div>{{ form.lrcContent }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="mb1" label="发布时间：">
                <div>{{ form.createdTime }}</div>
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
  getList,
  updateWork
} from '@/api/musician/basicInfo/details'
export default {
  name: 'Details',
  components: {
  },
  props: {
    listData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      total: 0,
      loading: false,
      dataList: [],
      queryForm: {
        userId: '', // 用户ID
        title: '', // 作品名模糊查询
        type: '', // 作品类型查询 1词曲 2Beat/Bgm 3作曲 4作词
        postStatus: '', // 作品发布状态查询 0未发布 1已发布
        status: '', // 出售发布状态查询 0未出售 1已出售 2交易中 3已下架
        page: 1, // 当前页
        limit: 20 // 每页条数
      },
      dialogOption: {
        title: '',
        show: false,
        loading: false
      },
      form: {}
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询列表
    getList() {
      this.loading = true
      this.queryForm.userId = this.listData.id
      getList(this.queryForm).then(res => {
        this.dataList = res.data || []
        this.total = res.count || 0
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    // 设置作者
    setComposers(row) {
      let arr = []
      row && row.forEach(item => {
        if (item) {
          arr.push(item.name)
        }
      })
      return arr.join(',')
    },
    // 打开详情
    openDetails(row) {
      this.dialogOption = {
        title: '详情',
        show: true,
        loading: false
      }
      this.form = row
    },
    // 下架
    openDown(row) {
      this.$confirm('此操作将下架作品, 是否继续?', '下架', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let info = {
          id: row.id, // 作品ID
          status: '', // 作品状态 0未发布 1已发布 -1已删除
          postStatus: '3'// 出售状态 0未出售 1已出售 2交易中 3已下架
        }
        updateWork(info).then(res => {
          this.getList()
          this.$notify.success({ title: '添加成功' })
        })
      }).catch(() => {})
    },
    // 删除
    openDelete(row) {
      this.$confirm('此操作将删除作品, 是否继续?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let info = {
          id: row.id, // 作品ID
          status: '-1', // 作品状态 0未发布 1已发布 -1已删除
          postStatus: ''// 出售状态 0未出售 1已出售 2交易中 3已下架
        }
        updateWork(info).then(res => {
          this.getList()
          this.$notify.success({ title: '添加成功' })
        })
      }).catch(() => {})
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
