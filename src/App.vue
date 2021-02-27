<template>
  <div id="app" v-loading="loading">
     <el-row  type="flex" justify="start" style="height:60px" align="middle">
       <el-button type="primary" @click="resetPermission" size="small">重置人力资源权限数据</el-button>
     </el-row>
    <el-card>
    <el-table :data="filterList" border stripe="">
      <el-table-column align="center" width="220px" label="名称" prop="name"></el-table-column>
      <el-table-column align="center" width="320px" label="标识" prop="code"></el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.baseURL = '/api'
export default {
  name: 'App',
  data () {
    return {
      defaultList: [{ name: '员工', code: 'employees' },
      { name: '权限', code: 'permissions' },
      { name: '设置', code: 'settings' },{ name: '组织架构', code: 'departments' },
      { name: '审批', code: 'approvals' },{ name: '工资', code: 'salarys' },{ name: '考勤', code: 'attendances' },
      { name: '社保', code: 'social_securitys' }],
      sendList: [],
      list: [],
      token: null,
      loading: false
    }
  },
  async created() {
      this.$notify({
          title: '提示',
          message: '人力资源项目中权限模块表示如不小心被删除，不能显示页面时，可以点击该页面的按钮进行重置数据'
        })
      this.loading = true
       await this.getToken()
      this.getAllPermission(this.token)
  },
  computed: {
    filterList () {
      return this.list.filter(item => item.type === 1)
    }
  },
  methods: {
    // 获取所有权限
    async getAllPermission(){
       const {data: {data: result}} = await axios({ url: '/sys/permission',headers: { Authorization: `Bearer ${this.token}` } }) 
       this.list = result
       this.loading = false
    },
    async getToken () {
     const { data: { data: token } }  =await axios({ url: 'sys/login', method: 'post', data: { mobile: 13800000001, password:'123456' } })
     this.token = token
    },
   async resetPermission() {
     try{
       // 将list进行比较默认列表
      const sendList =  this.defaultList.filter(item => !this.filterList.some(obj => obj.code===item.code))
      
      if(!sendList.length) {
        this.$message.warning("当前数据满足正常需求,无需重置")
        return 
      }
      await this.$confirm(`此次重置将新增${sendList.length}条数据,确定继续？`)
      await this.sendPost(sendList)
      this.$message.success("重置数据成功")
      this.getAllPermission()
     }catch(error) {
       console.log(error)
      //  this.$message.error(error.message)
     }
    },
  async  sendPost (list) {
    this.loading = true
      const tasks = list.map(item => axios({headers: { Authorization: `Bearer ${this.token}` },url: '/sys/permission', method: 'post', data: {...item,pid: '0',type: 1, enVisible: '1' }}))
      await  Promise.all(tasks)
          this.loading = false

    }
  }
}
</script>

<style>
</style>
