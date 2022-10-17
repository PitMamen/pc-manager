<template>
  <div>
    <a-tabs default-active-key="1" >
      <a-tab-pane key="1" tab="随访方案">
        <service-list ref="serviceList" @ok="handleOk" />
      </a-tab-pane>

      <a-tab-pane key="2" tab="微信模板" force-render>
        <wx-model ref="wxModel" @ok="handleOk" />
        <!-- <a-button type="primary" @click="addwxtemplate">新增微信模板</a-button> -->
      </a-tab-pane>
      
      <a-tab-pane key="3" tab="短信模板" force-render>
        <sm-model ref="smModel" @ok="handleOk" />

      </a-tab-pane>
      <a-tab-pane key="4" tab="随访名单">
        <name-list ref="nameList" @ok="handleOk" />
      </a-tab-pane>


     



    </a-tabs>
  </div>
</template>

<script>
// import { STable } from '@/components'
import {

  deleteAppVersion,
  qryRevisitPatientList,
} from '@/api/modular/system/posManage'


import serviceList from './serviceList'
import nameList from './nameList'
import wxModel from './wxModel'
import smModel from './smModel'



export default {
  components: {
    // STable,
    // addForm,
    // editForm,
    serviceList,
    nameList,
    wxModel,
    smModel,
    // addFormDispatch,
    // editFormDispatch,

    // statDetail,
    // statSolve,
  },

  data() {
    return {
      keshiData:[],
      queryParams:{
        userName:''

      }
     
    }
  },

  created() {

  },

  methods: {

    addwxtemplate (){
      this.$router.push({ name: 'sys_wxtemplate_add', data: null })
    },

    callback(){},
    handleOk(){},

  },
}
</script>

<style lang="less">
.div-service {
  width: 100%;
  overflow: hidden;
  height: 100%;

  .card-right {
    overflow: hidden;
    width: 100% !important;

    .table-operator {
      margin-bottom: 18px;
    }
    button {
      margin-right: 8px;
    }

    .title {
      background: #fff;
      font-size: 18px;
      font-weight: bold;
      color: #000;
    }
  }
}

</style>
