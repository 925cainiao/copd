<template>
  <div v-show="isShowDrug">
    <el-container>
      <el-main>
        <el-row style="text-align: right;">
          <el-col :span="24">
            <el-button type="primary"
                       @click="clickShowDrug">新建用药建议</el-button>
          </el-col>
        </el-row>
        <el-timeline>
          <el-timeline-item v-for="(it,index) in drugPlan"
                            :timestamp="it.time"
                            placement="top"
                            :key="index">
            <el-card>
              <el-table border
                        :data="it.drugs">
                <el-table-column v-for="item in columns"
                                 v-bind:label="item.label"
                                 v-bind:key="item.id"
                                 :prop="item.prop"
                                 :align="item.align"></el-table-column>
              </el-table>
              <el-row>
                <el-col :span="24"
                        align="right">
                  <el-link icon="el-icon-delete"
                           type="primary"
                           :underline="true"
                           class="link_btn"
                           @click="deleteData(it.planId,index)">删除</el-link>
                </el-col>
              </el-row>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import { schemePlanDelete } from '@/service/api'
export default {
  props: {
    isShowDrug: {
      type: Boolean,
      default: false
    },
    drugPlan: {
      type: Array,
      default: () => {
        return []
      }
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      columns: [
        // { id: 'createTime', label: '用药日期', prop: 'createTime', align: 'left' },
        { id: 'drugName', label: '药品名称', prop: 'drugName', align: 'left' },
        { id: 'dosage', label: '剂量', prop: 'dosage', align: 'center' },
        { id: 'frequency', label: '频次', prop: 'frequency', align: 'cente' },
        { id: 'rightUsage', label: '给药途径', prop: 'rightUsage', align: 'center' },
        { id: 'total', label: '总量', prop: 'total', align: 'center' }
      ]
    }
  },
  methods: {
    // 切换显示
    clickShowDrug () {
      this.$emit('update:isShowDrug', false)
    },
    // 删除
    deleteData (planId, index) {
      let _this = this
      _this.$confirm(`此操作将删除方案, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.schemePlanDelete(planId, index)
      }).catch(() => {
        _this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据用药方案id删除该用药方案
    schemePlanDelete (planId, index) {
      let _this = this
      schemePlanDelete(`/${_this.info.id}/${planId}`, {})
        .then((res) => {
          if (res.status === '0') {
            _this.drugPlan.splice(index, 1)
            _this.$emit('updata:drugPlan')
            _this.$message.success('删除成功')
            if (_this.drugPlan.length === 0) {
              _this.clickShowDrug()
            }
          }
        }).catch((err) => {
          _this.$message.error(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.cont_flex {
  display: flex;
}
.cont_flex_item {
  flex: 1;
}
.cont_flex_wid {
  width: 50px;
}
.link_btn {
  padding: 10px 0;
}
</style>
