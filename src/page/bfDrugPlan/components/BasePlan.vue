<template>
  <div v-show="showStep==0">
    <el-table class="child_table"
              border
              :data="tableData"
              :show-header="showHeaderStatus"
              :default-expand-all="defaultExpandAll"
              @selection-change="handleSelectionChange"
              ref="tb">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.scheme">
            <el-table-column label="药品分类"
                             prop="category">
            </el-table-column>
            <el-table-column label="药品名称"
                             min-width="120px">
              <template slot-scope="scope">
                <el-select v-model="scope.row.id"
                           filterable
                           @change="change(props,scope,$event)">
                  <el-option v-for="item in scope.row.alternative"
                             :key="item.id"
                             :label="item.drugName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="剂量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.drugDose"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="频次"
                             prop="drugFrequency">
              <template slot-scope="scope">
                <el-select v-model="scope.row.drugFrequency"
                           filterable
                           placeholder="请选择">
                  <el-option v-for="item in frequencyOptions"
                             :key="item.id"
                             :label="item.frequency"
                             :value="item.frequency">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="给药途径"
                             prop="drugUsage">
              <template slot-scope="scope">
                <el-select v-model="scope.row.drugUsage"
                           filterable
                           placeholder="请选择">
                  <el-option v-for="item in drugUsageOptions"
                             :key="item.id"
                             :label="item.drugUsage"
                             :value="item.drugUsage">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="总量">
              <template slot-scope="scope">
                <el-input v-model="scope.row.total"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="selection"
                       width="55"> </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <div class="table_align_left">方案{{scope.$index+1}}:{{ scope.row.category | filerCategory }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    frequencyOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    drugUsageOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    showStep: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showHeaderStatus: false, // 是否显示表头
      defaultExpandAll: true, // 默认全展开
      checkedGh: [] // 选中的方案
      // tableData: [],
    }
  },
  created () { },
  mounted () { },
  methods: {
    // table
    // 实现表格单选
    handleSelectionChange (selection) {
      this.checkedGh = selection
      if (selection.length > 1) {
        this.$refs.tb.clearSelection()
        this.$refs.tb.toggleRowSelection(selection.pop())
      }
    },
    // select实现下拉切换table数据
    change (props, scope, event) {
      this.tableData[props.$index].alternative.forEach((item) => {
        if (item.id === event) {
          this.tableData[props.$index].scheme[scope.$index].drugDose =
            item.drugDose
          this.tableData[props.$index].scheme[scope.$index].drugFrequency =
            item.drugFrequency
          this.tableData[props.$index].scheme[scope.$index].drugName =
            item.drugName
          this.tableData[props.$index].scheme[scope.$index].drugUsage =
            item.drugUsage
        }
      })
      this.$forceUpdate()
    }
  },
  filters: {
    filerCategory (val) {
      if (Array.isArray(val)) {
        let name = ''
        val.map((item, index) => {
          name = name + item + ','
        })
        name =
          name.substring(name.length - 1) === ','
            ? name.substring(0, name.length - 1)
            : name
        return name
      } else {
        return val
      }
    }
  },
  watch: {
    showInfo (n, o) {
      let _this = this
      if (n !== o && this.showStep === 1) {
        let obj = {
          drugName: '',
          id: '',
          drugDose: '',
          drugFrequency: '一日1次',
          drugUsage: '吸入',
          total: ''
        }
        let newData = JSON.parse(JSON.stringify(_this.showInfo))
        newData[0].scheme.push(obj)
        this.tableData = newData
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
