<template>
  <a-modal
    title="张三 | 男 | 35岁"
    :width="1500"
    :visible="visible"
    
    @cancel="handleCancel"
  >
      <a-tabs v-model="activeKey" type="line" style="margin-top: -24px;">
        <!-- <a-tab-pane key="1">
          <template #tab>
            <span>
              <img v-show="activeKey!='1'" src="~@/assets/icons/jkda.png"  class="icon"/>
              <img v-show="activeKey=='1'" src="~@/assets/icons/jkda1.png"  class="icon"/>
              健康档案
            </span>
          </template>
          健康档案
        </a-tab-pane> -->
        <a-tab-pane key="2">
          <template #tab>
            <span>
              <img v-show="activeKey!='2'" src="~@/assets/icons/lsjl.png"  class="icon"/>
              <img v-show="activeKey=='2'" src="~@/assets/icons/lsjl1.png"  class="icon"/>
              历史记录
            </span>
          </template>
          <histroy-solve ref="histroySolve"  :record="record"/>
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #tab>
            <span>
              <img v-show="activeKey!='3'" src="~@/assets/icons/bcsf.png"  class="icon"/>
              <img v-show="activeKey=='3'" src="~@/assets/icons/bcsf1.png"  class="icon"/>
              本次随访
            </span>
          </template>
          <tel-solve ref="telSolve"  :record="record"/>
         
        </a-tab-pane>
      </a-tabs>
    

  </a-modal>
</template>


<script>

import telSolve from './telSolve'
import histroySolve from './histroySolve'
export default {
  components: {
    telSolve,
    histroySolve
  },

  data() {
    return {
      activeKey:'3',
      visible:false,
      record:Object
    }
  },
  mounted() {
  

  },

  methods: {
   //随访
   doDeal(record) {
    this.activeKey='3'
    this.visible=true
    this.record=record
   },
   handleCancel() {
     
      this.visible = false
    },
  },
}
</script>
<style lang="less">
  .icon{
    width: 17px; height: 18px;margin-bottom: 3px;
  }
</style>
