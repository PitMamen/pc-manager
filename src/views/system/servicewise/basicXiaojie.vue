<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div v-if="jbxx" style="overflow-y: auto; height: 380px; padding-right: 10px; padding-bottom: 10px">
      
      <div :id="'myHtml' + indexData" v-for="(itemData, indexData) in insideZdxx" ></div>
    </div>

    <div v-else class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div>
  </div>
</template>


<script>

export default {
  components: {},
  props: {
    jbxx: Object,
    patientInfo: Object,
  },
  data() {
    return {
      insideZdxx: this.jbxx,
     
    }
  },

  mounted(){
    this.$nextTick(()=>{
      for (let index = 0; index < this.insideZdxx.length; index++) {
        document.getElementById('myHtml'+index).innerHTML =this.insideZdxx[index].contentHtmDetail
        
      }
     
    })
  },
 
  methods: {
    formatDate(date) {
      date = new Date(date)
      let myyear = date.getFullYear()
      let mymonth = date.getMonth() + 1
      let myweekday = date.getDate()
      mymonth < 10 ? (mymonth = '0' + mymonth) : mymonth
      myweekday < 10 ? (myweekday = '0' + myweekday) : myweekday
      return `${myyear}-${mymonth}-${myweekday}`
    },

    refreshData(zdxx) {
      this.insideZdxx = zdxx
      for (let index = 0; index < this.insideZdxx.length; index++) {
        document.getElementById('myHtml'+index).innerHTML =this.insideZdxx[index].contentHtmDetail
        
      }
    },
  },
}
</script>
<style lang="less" scoped>
.nodata {
  height: 90%;
  width: 99%;
  text-align: center;
  padding-top: 150px;
}

.inner-wrap {
  max-height: 388px;
  // overflow-y: auto;
  // overflow: hidden;
  font-size: 12px;
  padding: 10px;
  // background-color: aquamarine;
  width: 99%;

  .div-title {
    // margin-top: 10px;
    background-color: #ebebeb;
    flex-direction: row;
    width: 100% !important;
    display: flex;
    align-items: center;
    flex-direction: row;
    height: 26px;

    .div-line-blue {
      width: 5px;
      height: 100%;
      background-color: #1890ff;
    }
    .span-title {
      font-size: 12px;
      margin-left: 10px;
      font-weight: bold;
      color: #333;
    }
  }


    // border: #eaeaea solid 1px;
    .div-line-wrap {
      width: 100%;
     
      display: flex;
      align-items: center;
      flex-direction: row;

      .div-item-content {
        margin-bottom: 20px;
        color: #333;
      }

      .div-item-two {
        margin-bottom: 10px;
      }
    }
  
}
</style>
