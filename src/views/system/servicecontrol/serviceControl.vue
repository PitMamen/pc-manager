<template>
  <div>
    <a-tabs v-model="keyindex">
      <a-tab-pane key="1" tab="院级抽查"> <control-list ref="serviceList" @ok="handleOk" /> </a-tab-pane>
      <a-tab-pane key="2" tab="任务统计"> 
        <task-statistics ref="taskStatistics" @ok="handleOk" />
        <!-- <service-list ref="serviceList" @ok="handleOk" /> -->
        </a-tab-pane
    ></a-tabs>
  </div>
</template>

<script>
import controlList from './controlList'
import taskStatistics from './taskStatistics'

export default {
  components: {
    controlList,
    taskStatistics,
  },

  data() {
    return {
      keyindex: '1',
      keshiData: [],
      queryParams: {
        userName: '',
      },
    }
  },

  created() {
    console.log(this.$route.query.keyindex)
    if (this.$route.query.keyindex) {
      this.keyindex = this.$route.query.keyindex
    }
  },

  methods: {
    callback() {},
    handleOk() {},
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
