<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddEntity">新增</el-button>

    <el-table :data="schedulePeriodsList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="班次名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.scheName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="班次时长(小时)" width="220">
        <template slot-scope="scope">
          {{ scope.row.scheTimes }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="起止时间">
        <template slot-scope="scope">
          {{ scope.row.schePreriod }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="班次描述">
        <template slot-scope="scope">
          {{ scope.row.scheDesc }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" style="text-align: right">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑':'新增'">
      <el-form :model="schedulePeriods" label-width="80px" label-position="left">
        <el-form-item label="创建人">
          <span>admin</span>
          <el-input v-model="schedulePeriods.createUser" style="display: none" />
        </el-form-item>
        <el-form-item label="班次名称" :required="true">
          <el-input v-model="schedulePeriods.scheName" placeholder="" />
        </el-form-item>
        <el-form-item label="起止时间" :required="true">
          <el-time-select
            v-model="schedulePeriods.startTime"
            placeholder="起始时间"
            :picker-options="{
              start: '07:00',
              step: '00:01',
              end: '21:00'
            }"
            @change="timeChange"
          />&nbsp;&nbsp;
          <el-time-select
            v-model="schedulePeriods.endTime"
            placeholder="结束时间"
            :picker-options="{
              start: '07:00',
              step: '00:01',
              end: '21:00',
              minTime: schedulePeriods.startTime
            }"
            @change="timeChange"
          />
        </el-form-item>
        <el-form-item label="班次时长" :required="true">
          <el-input v-model="schedulePeriods.scheTimes" placeholder="" readonly />
        </el-form-item>
        <el-form-item label="班次描述">
          <el-input
            v-model="schedulePeriods.scheDesc"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入至少5个字符"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">退出</el-button>
        <el-button type="primary" @click="confirmEntity">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
import { getRoutes, addRole, updateRole } from '@/api/role'
import { getSchedulePeriods, confirmEntity, deleteEntity } from '@/api/schedulePeriods'

const defaultSchedulePeriods = {
  createUser: '',
  scheName: '',
  startTime: '',
  endTime: '',
  scheTimes: '',
  scheDesc: ''
}

export default {
  data() {
    return {
      schedulePeriods: Object.assign({}, defaultSchedulePeriods),
      routes: [],
      schedulePeriodsList: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        queryString: null
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.getRoutes()
    this.getSchedulePeriods()
  },
  methods: {
    async getSchedulePeriods() {
      var data = {}
      const res = await getSchedulePeriods(data, this.pagination.currentPage, this.pagination.pageSize)
      this.schedulePeriodsList = res.data.records
      this.pagination.total = res.data.total
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page
      this.getSchedulePeriods()
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size
      this.getSchedulePeriods()
    },
    timeChange() {
      // 起止时间
      var startTime = this.schedulePeriods.startTime
      var endTime = this.schedulePeriods.endTime
      if (startTime.trim().length !== 0 && endTime.trim().length !== 0) {
        this.schedulePeriods.schePreriod = startTime + '-' + endTime
        this.schedulePeriods.scheTimes = ((parseInt(endTime.substr(0, 2)) - parseInt(startTime.substr(0, 2))) +
          (parseInt(endTime.substr(3, 2)) - parseInt(startTime.substr(3, 2))) / 60).toFixed(2) + '小时'
      }
    },
    handleAddEntity() {
      this.schedulePeriods = Object.assign({}, defaultSchedulePeriods)
      this.dialogType = 'new'
      this.dialogVisible = true
    },
    async confirmEntity() {
      // 用户
      this.schedulePeriods.createUser = 'admin'
      if (this.schedulePeriods.scheName.trim().length === 0) {
        this.$message.error('班次名称不为空！')
        return
      }
      if (this.schedulePeriods.scheName.trim().length > 20) {
        this.$message.error('班次名称不超过20个字！')
        return
      }
      if (this.schedulePeriods.startTime.trim().length === 0) {
        this.$message.error('起始时间不为空！')
        return
      }
      if (this.schedulePeriods.endTime.trim().length === 0) {
        this.$message.error('结束时间不为空！')
        return
      }
      if (this.schedulePeriods.scheTimes.trim().length === 0) {
        this.$message.error('班次时长不为空！')
        return
      }
      if (this.schedulePeriods.scheDesc.trim().length > 100) {
        this.$message.error('班次描述不超过100个字！')
        return
      }
      delete this.schedulePeriods['startTime']
      delete this.schedulePeriods['endTime']
      const res = await confirmEntity(this.schedulePeriods)
      if (res.success) {
        this.$message({
          message: '保存成功！',
          type: 'success'
        })
        this.dialogVisible = false
        this.getSchedulePeriods()
      } else {
        this.$message.error('保存失败！')
      }
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.schedulePeriods = deepClone(scope.row)
      this.$nextTick(() => {
        const routes = this.generateRoutes(this.schedulePeriods.routes)
        this.$refs.tree.setCheckedNodes(this.generateArr(routes))
        // set checked state of a node not affects its father and child nodes
        this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除?', 'Warning', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteEntity(row.id)
          this.schedulePeriodsList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async getRoutes() {
      const res = await getRoutes()
      this.serviceRoutes = res.data
      this.routes = this.generateRoutes(res.data)
    },

    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      this.schedulePeriods.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)

      if (isEdit) {
        await updateRole(this.schedulePeriods.key, this.schedulePeriods)
        for (let index = 0; index < this.schedulePeriodsList.length; index++) {
          if (this.schedulePeriodsList[index].key === this.schedulePeriods.key) {
            this.schedulePeriodsList.splice(index, 1, Object.assign({}, this.schedulePeriods))
            break
          }
        }
      } else {
        const { data } = await addRole(this.schedulePeriods)
        this.schedulePeriods.key = data.key
        this.schedulePeriodsList.push(this.schedulePeriods)
      }

      const { description, key, name } = this.schedulePeriods
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
          <div>Role Key: ${key}</div>
          <div>Role Name: ${name}</div>
          <div>Description: ${description}</div>
        `,
        type: 'success'
      })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
