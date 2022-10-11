<template>
  <!-- <a-spin :spinning="confirmLoading"> -->
    <div class="div-project-add">
      <div class="div-pro-up">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">基本信息</span>
        </div>

        <div class="div-hor-wrap"></div>
      </div>

      <div class="div-pro-middle">
        <div class="div-title">
          <div class="div-line-blue"></div>
          <span class="span-title">名单过滤</span>
        </div>

        <div class="div-hor-wrap"></div>
      </div>


      <!-- <add-cha ref="addJianCha" @ok="handleJianCha" /> -->
    </div>
  <!-- </a-spin> -->
</template>

<script>
import { getDepts } from '@/api/modular/system/posManage'

// import addCha from './addJianCha'

export default {
  components: {
    // addCha,
  },

  data() {
    return {
      projectData: {},
      confirmLoading: false,
    }
  },

  created() {
    getDepts().then((res) => {
      if (res.code == 0) {
        this.keshiData = res.data
        this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
      } else {
        // this.$message.error('获取计划列表失败：' + res.message)
      }
    })
  },

  methods: {
    saveProject() {},
  },
}
</script>

<style lang="less">
.div-project-add {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1%;

  .div-title {
    display: flex;
    background-color: #EBEBEB;
    flex-direction: row;
    width: 100%;
    height: 5%;

    .div-line-blue {
      width: 5px;
      background-color: #1890ff;
    }
    .span-title {
      font-size: 14px;
      margin-left: 10px;
      font-weight: bold;
      color: #333;
    }
  }

  .div-pro-up {
    width: 100%;
  }

  .div-pro-middle{
    margin-top: 2%;
  }
}
</style>
