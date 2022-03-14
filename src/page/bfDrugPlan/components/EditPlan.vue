<template>
  <div>
    <div class=""
         v-show="showStep == 1">
      <el-table class="child_table"
                border
                :data="tableData"
                :show-header="showHeaderStatus"
                :default-expand-all="defaultExpandAll"
                @selection-change="handleSelectionChange">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table border
                      :data="props.row.scheme">
              <el-table-column label="药品名称">
                <template slot-scope="scope">
                  <div v-show="scope.row.isBase">
                    {{scope.row.drugName}}
                  </div>
                  <div v-show="!scope.row.isBase">
                    <el-select v-model="scope.row.id"
                               filterable
                               @change="change(props, scope, $event)"
                               placeholder="">
                      <el-option v-for="item in drugPlanDetailOption"
                                 :key="item.id"
                                 :label="item.drugName"
                                 :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="剂量">
                <template slot-scope="scope">
                  <div v-show="scope.row.isBase">
                    {{scope.row.drugDose}}
                  </div>
                  <div v-show="!scope.row.isBase">
                    <el-input v-model="scope.row.drugDose"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="频次"
                               prop="drugFrequency">
                <template slot-scope="scope">
                  <div v-show="scope.row.isBase">
                    {{scope.row.drugFrequency}}
                  </div>
                  <div v-show="!scope.row.isBase">
                    <el-select v-model="scope.row.drugFrequency"
                               filterable
                               placeholder="">
                      <el-option v-for="item in frequencyOptions"
                                 :key="item.id"
                                 :label="item.frequency"
                                 :value="item.frequency">
                      </el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="给药途径"
                               prop="drugUsage">
                <template slot-scope="scope">
                  <div v-show="scope.row.isBase">
                    {{scope.row.drugUsage}}
                  </div>
                  <div v-show="!scope.row.isBase">
                    <el-select v-model="scope.row.drugUsage"
                               filterable
                               placeholder="">
                      <el-option v-for="item in drugUsageOptions"
                                 :key="item.id"
                                 :label="item.drugUsage"
                                 :value="item.drugUsage">
                      </el-option>
                    </el-select>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="总量">
                <template slot-scope="scope">
                  <div v-show="scope.row.isBase">
                    {{scope.row.total}}
                  </div>
                  <div v-show="!scope.row.isBase">
                    <el-input v-model="scope.row.total"></el-input>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <div v-show="scope.row.isBase">
                    <el-button type="danger"
                               class="el-icon-delete"
                               @click="removeScheme(scope)">&nbsp;删除</el-button>
                  </div>
                  <div v-show="!scope.row.isBase">
                    <div v-if="scope.$index == props.row.scheme.length-1">
                      <i class="el-icon-circle-plus"
                         @click="addScheme"></i>
                    </div>
                    <div v-else>
                      <i class="el-icon-delete"
                         @click="removeScheme(scope)"></i>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column>
          <div class="table_align_left">方案：</div>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { queryDrugInfo } from '@/service/api'
export default {
  props: {
    showStep: {
      type: Number,
      default: 0
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
    showInfo: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      showHeaderStatus: false, // 是否显示表头
      defaultExpandAll: true, // 默认全展开
      checkedGh: [], // 选中的方案
      tableData: [],
      drugPlanDetailOption: []
    }
  },
  created () {

  },
  mounted () { },
  methods: {
    // table
    // 实现表格单选
    handleSelectionChange (selection) {
      this.checkedGh = selection[0]
      if (selection.length > 1) {
        this.$refs.tb.clearSelection()
        this.$refs.tb.toggleRowSelection(selection.pop())
      }
    },
    // select实现下拉切换table数据
    change (props, scope, event) {
      this.drugPlanDetailOption.forEach((item) => {
        if (item.id === event) {
          this.tableData[props.$index].scheme[scope.$index].drugDose =
            item.drugDose
          this.tableData[props.$index].scheme[scope.$index].drugFrequency =
            item.drugFrequency
          this.tableData[props.$index].scheme[scope.$index].drugName =
            item.drugName
          this.tableData[props.$index].scheme[scope.$index].drugUsage =
            item.drugUsage
          this.tableData[props.$index].scheme[scope.$index].total =
            item.total ? item.total : ''
        }
      })
      this.$forceUpdate()
    },
    // 获取数据
    queryDrugPlanDetail () {
      queryDrugInfo('', {}).then((msg) => {
        console.log(msg.data)
        if (msg.status === '0') {
          this.drugPlanDetailOption = msg.data
        }
      })
    },

    // 增加
    addScheme () {
      let obj = {
        drugName: '',
        id: '',
        drugDose: '',
        drugFrequency: '一日1次',
        drugUsage: '吸入'
      }
      this.tableData[0].scheme.push(obj)
    },
    // 删除
    removeScheme (scope) {
      if (scope.row.isBase) {
        this.$alert('您确定要删除该行吗？', {
          title: '消息',
          confirmButtonText: '确定',
          callback: action => {
            this.tableData[0].scheme.splice(scope.$index, 1)
            this.$forceUpdate()
          }
        })
      } else {
        this.tableData[0].scheme.splice(scope.$index, 1)
        this.$forceUpdate()
      }
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
        _this.queryDrugPlanDetail()
        let obj = {
          drugName: '',
          id: '',
          drugDose: '',
          drugFrequency: '一日1次',
          drugUsage: '吸入'
        }
        let newData = JSON.parse(JSON.stringify(_this.showInfo))
        newData[0].scheme.push(obj)
        _this.tableData = newData
      }
    }
  }
}
</script>

<style scoped>
</style>
