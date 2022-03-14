<template>
  <div class="table">
            <el-table id="iTable"
              v-loading.iTable="options.loading"
              :data="list"
              :stripe="options.stripe"
              ref="mutipleTable"
              @selection-change="handleSelectionChange"
              border>
                  <el-table-column v-if="options.mutiSelect"
                       type="selection"
                       style="width: 55px">
                    </el-table-column>
  </div>
</template>
<script>
import tabletext from 'views/layout/tabletext'
import { page } from 'api/dl/meter/index'
export default {
  name: 'table1',
  components: {
    tabletext
  },
  computed: {},
  data () {
    return {
      list: [], // table数据
      listQuery: {
        page: 1,
        limit: 20,
        systemname: undefined

      },
      total: null,
      options: {

        stripe: true, // 是否为斑马纹 table

        loading: false, // 是否添加表格loading加载动画

        highlightCurrentRow: true, // 是否支持当前行高亮显示

        mutiSelect: false // 是否支持列表项选中功能

      }, // table 的参数
      columns: [
        {
          prop: 'meterid',
          label: '电表ID',
          align: 'center'
        }, {
          prop: 'title',
          label: '电表名称',
          align: 'center',
          formatter: (row, column, cellValue) => {
            console.log(row.isenable)
            return `<span style="white-space: nowrap;color: dodgerblue;">${row.metername}</span>`
          }
        }, {
          prop: 'isenable',
          label: '是否有效',
          align: 'center',
          render: (h, params) => {
            return h('span', {
            }, params.row.isenable === '1' ? '是' : params.row.isenable === '2' ? '否' : '')
          }

        }

      ], // 需要展示的列

      // 按钮
      operates: {
        width: 150,
        list: [
          {

            id: '1',

            label: '编辑',

            style: 'cursor:pointer;color: #409eff;',

            show: true,

            class: 'el-icon-edit',

            plain: true,

            method: (scope, row) => {
              console.log(scope)

              console.log(row)

              this.handleEdit(row)
            }

          },

          {

            id: '2',
            label: '删除',
            style: 'cursor:pointer;color: #b3450e;',
            class: 'el-icon-delete',
            show: true,
            plain: false,
            method: (index, row) => {
              this.handleDel(row)
            }

          }

        ]

      } // 列操作按钮

    }
  },

  created () {
    this.getList()
  },

  methods: {
    // 选中行
    handleSelectionChange (val) {
      console.log('val:', val)
    },

    // 编辑
    handleEdit (index, row) {
      console.log(' index:', index)
      console.log(' row:', row)
    },
    // 删除
    handleDel (index, row) {
      console.log(' index:', index)
      console.log(' row:', row)
    },
    getList () {
      console.log(this.listQuery)
      page(this.listQuery).then(response => {
        this.list = response.data.rows
        this.total = response.data.total
      })
    },
    handleSizeChange (val) {
      console.log(val)
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      console.log(val)
      this.listQuery.page = val
      this.getList()
    }

  }

}

</script>
