<template>
  <a-modal
    title="录音播放"
    :width="500"
    :visible="visible"
    :footer="null"
    @cancel="handleCancel"
    :maskClosable="false"
    :destroyOnClose="true"
    :mask="false"
    :dialogStyle="dialogStyle"
  >

<audio class="audio"  controls src="http://develop.mclouds.org.cn:8009/content-api/file/S20220928110502547T4PSXJVUOGKFJY-tmp_8ca1a0e623c088975dc24d12a49bedf5e8f8f0731e094df7.mp3" autoplay></audio>
  </a-modal>
</template>


<script>

export default {
  components: {

   
  },

  data() {
    return {
      dialogStyle:{
        top:0
      },
      visible: false,
    }
  },
  created() {
   
  },

  methods: {
   
    doDeal(record) {
     this.visible=true
    },
    handleCancel() {
      this.visible = false
    },
  },
}
</script>
<style lang="less">
.icon {
  width: 17px;
  height: 18px;
  margin-bottom: 3px;
}

</style>
