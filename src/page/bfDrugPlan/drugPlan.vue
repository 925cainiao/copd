<template>
  <div class="page_main">
    <div class="page_table_width">
      <div class="page_table_tit">
        <i class="el-icon-first-aid-kit el_icons"
           v-show="showStep != 2"></i><i class="el-icon-document el_icons"
           v-show="showStep == 2"></i>&nbsp;{{showStep == 1 ? "自定义" : "基础"}}用药方案 &nbsp;&nbsp;&nbsp;&nbsp;
        <span>当前病人GOLD分组为D组</span>
      </div>
      <base-plan :tableData="tableData"
                 :showStep="showStep"
                 :frequencyOptions="frequencyOptions"
                 :drugUsageOptions="drugUsageOptions"
                 ref="basePlan"></base-plan>
      <edit-plan :showInfo="showInfo"
                 :showStep="showStep"
                 :frequencyOptions="frequencyOptions"
                 :drugUsageOptions="drugUsageOptions"
                 ref="editPlan"></edit-plan>
      <plan-list :showInfo="showInfo[0].scheme"
                 :showStep="showStep"
                 ref="planList"></plan-list>
      <el-row class="button_align">
        <el-col :span="24">
          <el-button class="el-icon-back"
                     @click="goBack"
                     :disabled="showStep == 0">上一步</el-button>
          <el-button class="el-icon-right"
                     @click="goTo"
                     :disabled="showStep!=0">增加自定义药物</el-button>
          <el-button type="primary"
                     class="el-icon-check"
                     @click="confirm"
                     v-show="showStep!=2">确认</el-button>
          <el-button type="primary"
                     class="el-icon-check"
                     @click="save"
                     v-show="showStep==2">保存</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { querySchemeTag, queryDrugFrequency, saveScheme, queryDrugUsage, querySchemeGroup } from '@/service/api'
export default {
  components: {
    BasePlan: () => import(/* webpackChunkName: "BasePlan" */ './components/BasePlan.vue'),
    EditPlan: () => import(/* webpackChunkName: "EditPlan" */ './components/EditPlan.vue'),
    PlanList: () => import(/* webpackChunkName: "PlanList" */ './components/PlanList.vue')
  },
  data () {
    return {
      showHeaderStatus: false, // 是否显示表头
      defaultExpandAll: true, // 默认全展开
      checkedGh: [], // 选中的方案
      tableData: [], // 表格数据
      frequencyOptions: [], // 频次下拉
      drugUsageOptions: [], // 途径下拉
      showStep: 0, // 显示模块 0:基础用药方案， 1：自定义用药方案 2：确认用药方案
      backupStep: 0, // 备份
      showInfo: [{
        scheme: []
      }], // 选中的信息
      doctorId: '1', // 医生id
      patientId: '1' // 病人id
    }
  },
  created () {
    // this.querySchemeGroup()
    this.queryDrugPlan()
    this.queryDrugFrequency()
    this.queryDrugUsage()
  },
  mounted () { },
  methods: {
    // 判断并获得患者GOLD分组
    querySchemeGroup () {
      let _this = this
      let obj = {
        category: '',
        scheme: [],
        alternative: []
      }
      querySchemeGroup(``, {}).then((res) => {
        if (res.status === '0') {
          console.log(res)
        } else {
          _this.tableData = obj
          _this.$message.error(res.msg)
        }
      })
    },
    // 获取基础用药方案数据
    queryDrugPlan (id) {
      id = 'D'
      let _this = this
      let obj = {
        category: '',
        scheme: [],
        alternative: []
      }
      querySchemeTag(`/tag/${id}`, {}).then((res) => {
        if (res.status === '0') {
          this.dealData(res.data)
        } else {
          _this.tableData = obj
          _this.$message.error(res.msg)
        }
      })
    },
    // 处理基础用药方案接口数据
    dealData (msg) {
      let tableData = msg
      var newData = []
      for (var j in tableData.category) {
        var obj = {
          category: tableData.category[j],
          scheme: [],
          alternative: []
        }
        newData.push(obj)
      }
      for (var i in tableData.scheme) {
        newData[i - 1].scheme = newData[i - 1].scheme.concat(JSON.parse(JSON.stringify(tableData.scheme[i])))
        newData[i - 1].alternative = newData[i - 1].alternative.concat(tableData.scheme[i])
      }
      for (var k in tableData.alternative) {
        tableData.alternative[k].forEach((item) => {
          newData[k - 1].alternative = newData[k - 1].alternative.concat(item)
        })
      }
      newData.forEach((item, index) => {
        item.scheme.forEach((item1, index1) => {
          if (item1) {
            item1.category = item.category[index1]
            item1.alternative = item.alternative
          }
        })
      })
      this.tableData = newData
    },
    // 获得所有用药频次数据
    queryDrugFrequency () {
      let _this = this
      queryDrugFrequency('', {}).then(
        res => {
          if (res.status === '0') {
            _this.frequencyOptions = res.data
          } else {
            _this.$message.error(res.msg)
          }
        }
      )
    },
    // 获得所有给药途径数据
    queryDrugUsage () {
      let _this = this
      queryDrugUsage('', {}).then(
        res => {
          if (res.status === '0') {
            _this.drugUsageOptions = res.data
          } else {
            _this.$message.error(res.msg)
          }
        }
      )
    },
    // 判断是否已选择方案
    alertMessage () {
      if (this.showStep === 0) {
        this.checkedGh = this.$refs.basePlan.checkedGh
      }
      if (this.checkedGh.length === 0) {
        this.$alert('请选择一种基础用药方案！', {
          title: '消息',
          confirmButtonText: '确定'
        })
        return false
      } else {
        return true
      }
    },
    /* 底部切换按钮 */
    // 返回上一步
    goBack () {
      if (this.showStep === 1) {
        this.showStep = 0
      } else {
        this.showStep = this.backupStep
      }
    },
    // 增加自定义药物
    goTo () {
      if (this.alertMessage()) {
        this.showInfo = []
        this.showInfo.push(this.checkedGh[0])
        this.showInfo[0].scheme.forEach((item, index) => {
          item.isBase = true
        })
        this.showStep = 1
      }
    },
    // 确认
    confirm () {
      // 备份上一级step是什么
      this.backupStep = this.showStep
      if (this.alertMessage()) {
        if (this.showStep === 1) {
          let data = JSON.parse(JSON.stringify(this.$refs.editPlan.tableData[0].scheme))
          data = data.filter((item) => {
            return item.id !== ''
          })
          if (data.length === 0) {
            this.$alert('请选择一种基础用药方案！', {
              title: '消息',
              confirmButtonText: '确定'
            })
          } else {
            this.showInfo = this.$refs.editPlan.tableData
            this.showStep = 2
          }
        } else {
          this.showInfo = []
          this.showInfo.push(this.checkedGh[0])
          this.showInfo[0].scheme.forEach((item, index) => {
            item.isBase = true
          })
          this.showStep = 2
        }
      }
    },
    // 保存
    save () {
      let _this = this
      if (_this.showStep === 2) {
        let data = _this.$refs.planList.tableData
        data = data.map(item => {
          return {
            drugName: item.drugName,
            drugDose: item.drugDose,
            drugFrequency: item.drugFrequency,
            drugUsage: item.drugUsage,
            total: item.total ? item.total : '',
            id: item.id
          }
        })
        let params = {
          doctorId: _this.doctorId,
          patientId: _this.patientId,
          items: data
        }
        saveScheme('', params).then((res) => {
          if (res.status === '0') {
            _this.$message.success('保存成功')
          } else {
            _this.$message.error(res.msg)
          }
        })
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
  }
}
</script>

<style scoped>
.demo-table-expand {
  padding: 0 0;
}
.child_table {
  margin: 0 15px;
  width: auto;
}
</style>
