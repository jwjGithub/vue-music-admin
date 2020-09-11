<template>
  <div class="main-body">
    <div>
      <el-form ref="queryForm" class="pl20 pr20 pt20" label-width="100px" :model="queryForm" :inline="true">
        <div class="query-item">
          <div class="left-query">
            <el-form-item label="生产订单号" prop="produceOrderNo">
              <el-input v-model="queryForm.produceOrderNo" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="销售订单号" prop="salesOrderNo">
              <el-input v-model="queryForm.salesOrderNo" class="w24"></el-input>
            </el-form-item>
            <el-form-item label="工序" prop="processId">
              <el-select v-model="queryForm.processId" filterable clearable placeholder="" class="w24">
                <el-option v-for="(item,index) in processList" :key="index" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="tabs == 2" label="开工时间" prop="workingTime">
              <el-date-picker
                v-model="workingTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd"
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
      <el-row class="pt20 pr20 pb10 pl20">
        <el-col :span="24">
          <el-button type="primary" class="mr20 mb10" plain :disabled="selectOption.multiple">批量启用</el-button>
          <el-button type="primary" class="mr20 mb10" plain :disabled="selectOption.multiple">批量停用</el-button>
          <el-button type="primary" class="mr20 mb10" plain>新增</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="dataList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column prop="name" min-width="120" label="单位">
          <template slot-scope="scope">
            <el-input v-if="scope.row.type == 'edit'" v-model="form.name" maxlength="5" class="w12"></el-input>
            <span v-else>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" min-width="120" label="排序">
          <template slot-scope="scope">
            <el-input v-if="scope.row.type == 'edit'" v-model="form.sort" type="number" maxlength="5" class="w12"></el-input>
            <span v-else>{{ scope.row.sort }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createUsername" min-width="120" label="创建人"></el-table-column>
        <el-table-column prop="createTime" min-width="180" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <!-- <template slot-scope="scope">
            <span v-if="scope.row.type == 'edit'">
              <el-button size="mini" type="text" @click="saveSubmit(scope.row)">保存</el-button>
              <el-button v-if="!!scope.row.id" size="mini" type="text" class="c-red" @click="cancelSave(scope.row)">取消</el-button>
              <el-button v-else size="mini" type="text" class="c-red" @click="deleteSave(scope.row)">删除</el-button>
            </span>
            <span v-else>
              <el-button :disabled="isEdit" size="mini" type="text" @click="openEdit(scope.row)">修改</el-button>
              <el-button :disabled="isEdit" size="mini" type="text" class="c-red" @click="batchRemove(1,scope.row)">删除</el-button>
            </span>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Account',
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
      tabs: '',
      loading: false,
      dataList: [],
      processList: [],
      queryForm: {

      }

    }
  },
  created() {

  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectOption.ids = selection.map(item => item.id)
      this.selectOption.single = selection.length !== 1
      this.selectOption.multiple = !selection.length
    },
    getDataList() {
      console.log('123')
    }
  }
}
</script>
<style lang="scss" scoped>
  .main-body{
    min-height: calc(100% - 74px);
    background-color: #ffffff;
    border-radius: 6px;
    padding-bottom: 20px;
    margin: 24px;
  }
</style>
