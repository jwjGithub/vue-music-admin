<!--
 * @Descripttion: banner配置
 * @version:
 * @Author: jwj
 * @Date: 2020-12-26 16:17:49
 * @LastEditors: jwj
 * @LastEditTime: 2020-12-31 17:28:38
-->
<template>
  <div class="main-body">
    <div class="main-content">
      <el-form ref="queryForm" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="标题" prop="title">
              <el-input v-model="queryForm.title" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryForm.status" clearable placeholder="" class="w24">
                <el-option value="" label="全部" />
                <el-option value="0" label="失效" />
                <el-option value="1" label="生效" />
              </el-select>
            </el-form-item>
            <el-form-item label="生效时间">
              <el-date-picker v-model="queryForm.effectiveTime" type="datetime" class="w24" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
            <el-form-item label="失效时间">
              <el-date-picker v-model="queryForm.expiredTime" type="datetime" class="w24" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
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
      <el-row class="pt20 pb10">
        <el-col :span="24">
          <el-button type="primary" class="mr20 mb10" @click="openAdd">新增</el-button>
          <el-button type="danger" class="mr20 mb10" :disabled="selectOption.multiple" @click="openDelete(null,2)">批量删除</el-button>
        </el-col>
      </el-row>
      <el-row class="pb10">
        <el-col :span="24">
          <el-table
            v-loading="loading"
            :data="dataList"
            stripe
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="title" min-width="150" label="标题"></el-table-column>
            <el-table-column prop="effectiveTime" min-width="150" label="生效时间"></el-table-column>
            <el-table-column prop="expiredTime" min-width="150" label="失效时间"></el-table-column>
            <el-table-column prop="statusDesc" min-width="80" label="状态"></el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="openEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="text" class="c-red" @click="openDelete(scope.row,1)">删除</el-button>
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
      :width="'860px'"
      @handleClose="dialogOption.show = false"
      @handleConfirm="handleConfirm"
    >
      <div class="pl24 pr24 pt24 pb24">
        <el-form ref="form" :model="form" :rules="rules" label-width="130px" :inline="true">
          <el-form-item label="标题：" prop="title">
            <el-input v-model="form.title" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="url：" prop="url">
            <el-input v-model="form.url" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="生效时间：" prop="effectiveTime">
            <el-date-picker
              v-model="form.effectiveTime"
              class="w24"
              type="datetime"
              placeholder="请选择"
              default-time="23:59:59"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerTodayDateAfter"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="失效时间：" prop="expiredTime">
            <el-date-picker
              v-model="form.expiredTime"
              class="w24"
              type="datetime"
              placeholder="请选择"
              default-time="23:59:59"
              value-format="yyyy-MM-dd HH:mm:ss"
              :picker-options="pickerTodayDateAfter"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="链接：">
            <el-input v-model="form.ref" class="w24"></el-input>
          </el-form-item>
          <el-form-item label="排序：">
            <el-input-number v-model="form.sort" class="w24" controls-position="right" :min="1" :max="999999"></el-input-number>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select v-model="form.status" clearable placeholder="请选择状态" class="w24">
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="0" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </mus-dialog>
  </div>
</template>
<script>
import {
  getDataList,
  saveEditAndAdd,
  saveDelete
} from '@/api/songbook/banner'
export default {
  name: 'Review',
  components: {},
  data() {
    return {
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
      loading: false,
      dataList: [],
      queryForm: {
        title: '', // 标题模糊查询
        effectiveTime: '', // 生效时间
        expiredTime: '', // 失效时间
        status: '', // 状态 0失效 1生效
        page: 1, // 当前页
        limit: 10 // 每页条数
      },
      form: {},
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入url', trigger: 'blur' }
        ],
        effectiveTime: [
          { required: true, message: '请选择生效时间', trigger: ['blur', 'change'] }
        ],
        expiredTime: [
          { required: true, message: '请选择失效时间', trigger: ['blur', 'change'] }
        ]
      },
      pickerTodayDateAfter: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7 // 如果当天禁用，就不用减8.64e7
        }
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.id)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
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
    // 打开新增
    openAdd() {
      this.dialogOption = {
        title: '新增banner配置',
        show: true,
        loading: false
      }
      this.form = {
        id: '', // banner配置项ID，传入是修改，不传是添加
        title: '', // 标题
        url: '', // 图片资源地址，传入图片上传接口返回的url
        effectiveTime: '', // 生效时间
        expiredTime: '', // 失效时间
        ref: '', // 链接
        sort: '', // 顺序排序，默认是0
        status: 1 // 上架状态 0下架 1上架 默认是1
      }
      this.resetForm('form')
    },
    // 保存新增/编辑
    saveEditAndAdd() {
      this.dialogOption.loading = true
      saveEditAndAdd(this.form).then(res => {
        this.$notify.success({ title: '保存成功' })
        this.getDataList()
        this.dialogOption.show = false
        this.dialogOption.loading = false
      }).catch(e => {
        this.dialogOption.loading = false
      })
    },
    // 打开编辑
    openEdit(row) {
      this.dialogOption = {
        title: '编辑banner配置',
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
          this.saveEditAndAdd()
        } else {
          return false
        }
      })
    },
    // 删除
    openDelete(row, type) {
      let title = type === 1 ? '单个' : '批量'
      this.$confirm(`此操作将${title}删除作品, 是否继续?`, '作品删除', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        let json = {
          ids: type === 1 ? row.id : this.selectOption.ids
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
