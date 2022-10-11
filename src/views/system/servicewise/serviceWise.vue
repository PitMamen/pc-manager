<template>
  <div>
    <!-- <a-tabs default-active-key="1" @change="callback" style="width: 60%"> -->
    <a-tabs default-active-key="1" @change="callback">
      <a-tab-pane key="1" tab="随访方案">
        <service-list ref="serviceList" @ok="handleOk" />
      </a-tab-pane>

      <a-tab-pane key="2" tab="微信模板" force-render>
      </a-tab-pane>

      <a-tab-pane key="3" tab="短信模板">

      </a-tab-pane>
      <a-tab-pane key="4" tab="随访名单"></a-tab-pane>
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



export default {
  components: {
    // STable,
    // addForm,
    // editForm,
    serviceList,
    // addFormDispatch,
    // editFormDispatch,

    // statDetail,
    // statSolve,
  },

  data() {
    return {
     
    }
  },

  created() {

  },

  methods: {
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
