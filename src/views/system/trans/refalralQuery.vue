<template>
    <div class="wrap">
      <a-tabs v-model="keyindex" style="margin-left: 20px;">
        <a-tab-pane key="1" tab="转入登记" >
            <!-- <a-icon type="import"></a-icon> -->
          <transfer-Check ref="transferin" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="转出登记" force-render>
            <transferout-Check ref="transferout" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </template>


<script>
import transferCheck from './transferCheck'
import transferoutCheck from './transferoutCheck'
// import orgList from './orgList'

export default {
  components: {
    transferCheck,
    transferoutCheck,
    // orgList,
  },

  data() {
    return {
      keyindex: '1',
    }
  },

  created() {
    console.log(this.$route.query.keyindex)
    if (this.$route.query.keyindex) {
      this.keyindex = this.$route.query.keyindex
    }
  },

  methods: {
    addwxtemplate() {
    //   this.$router.push({ path: './addwxtemplate' })
    },

    callback() {},
    handleOk() {},
  },
}
</script>