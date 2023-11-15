<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div
      class="div-surgery"
      v-if="insideJbxx.ssxx && insideJbxx.ssxx.length > 0"
      style="padding-right: 10px; padding-bottom: 10px"
    >
      <!-- <div class="div-shu" style="overflow-y: auto; height: 370px">

        <a-timeline mode="left" style="margin-left: 5%; margin-top: 5%">
          <a-timeline-item
            v-for="(item, index) in insideJbxx.ssxx"
            :color="item.color"
            :key="index"
            @click="onItemClick(item, index)"
          >
            <div class="div-line-content" :class="{ doubled: item.color == 'blue' }">
              {{ item.timeStr }}

            </div></a-timeline-item
          >
        </a-timeline>
      </div> -->

      <!-- <div class="div-jancha" style="overflow-y: auto; height: 370px"> -->
      <div class="div-jancha" style="overflow-y: auto; height: 450px">
        <div class="div-line-wrap" style="margin-top: 0">
          <div class="div-item-three" style="color: #999">
            入院日期：<span style="color: #1a1a1a;">{{ insideShowData.data[0].ksmc }}2023-10-11</span>
          </div>
          <div class="div-item-three" style="color: #999">
            出院日期：<span style="color: #1a1a1a;">{{ insideShowData.data[0].ksmc }}2023-10-11</span>
          </div>
          <div class="div-item-three" style="color: #999">
            住院天数：<span style="color: #1a1a1a;">{{ insideShowData.data[0].ksmc }}天</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">入院诊断：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].mzfsmc }}到我的无</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">出院诊断：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].ssqzdmc }}范围分为非</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">术后诊断：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].sshzdmc }}服务而分为热</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">入院时情况：</div>
        </div>
        <div class="div-line-wrap" style="margin-top: 8px;">
          <div class="div-item-leng-con">{{ insideShowData.data[0].ssczmc }}大锅饭二个如果热狗核桃仁和投入韩国人拖后腿然后突然</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">诊疗经过：</div>
        </div>
        <div class="div-line-wrap" style="margin-top: 8px;">
          <div class="div-item-leng-con">{{ insideShowData.data[0].ssczmc }}大锅饭二个如果热狗核桃仁和投入韩国人拖后腿然后突然</div>
        </div>
        
        <div class="div-line-wrap">
          <div class="div-item-leng">出院情况：</div>
        </div>
        <div class="div-line-wrap" style="margin-top: 8px;">
          <div class="div-item-leng-con">{{ insideShowData.data[0].ssczmc }}大锅饭二个如果热狗核桃仁和投入韩国人拖后腿然后突然</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">出院医嘱：</div>
        </div>
        <div class="div-line-wrap" style="margin-top: 8px;">
          <div class="div-item-leng-con" style="white-space: pre-line;">{{ insideShowData.data[0].ssczmc }}1.大锅饭二个如果热狗核桃仁和投入韩国人拖后腿然后突然\n2.发热感染隔热条</div>
        </div>

        <div class="div-line-wrap" style="margin-top: 18px">
          <div class="div-item-three" style="color: #999">
            登记医生：<span style="color: #1a1a1a;">{{ insideShowData.data[0].ksmc }}李二狗</span>
          </div>
          <div class="div-item-three" style="color: #999">
            登记日期：<span style="color: #1a1a1a;">{{ insideShowData.data[0].ksmc }}2023-10-11</span>
          </div>
          <div class="div-item-three" style="color: #999">
            登记机构：<span style="color: #1a1a1a;">{{ insideShowData.data[0].ksmc }}天狗医院</span>
          </div>
        </div>

      </div>
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
    showData: Object,
  },
  data() {
    return {
      insideJbxx: this.jbxx,
      // insideShowData: this.showData,
      insideShowData: { data: [{},{}] },
    };
  },

  created() {},
  methods: {
    onItemClick(itemOut, indexOut) {
      for (let index = 0; index < this.insideJbxx.ssxx.length; index++) {
        this.insideJbxx.ssxx[index].color = "gray";
        if (indexOut == index) {
          this.insideJbxx.ssxx[index].color = "blue";
        }
      }

      this.insideShowData = this.insideJbxx.ssxx[indexOut].data;
      console.log("this.insideShowData", this.insideShowData);
    },

    refreshData(insideJbxx) {
      this.insideJbxx = insideJbxx;
      this.insideShowData = { data: [{},{}] };
    },
    // refreshData(insideJbxx, insideShowData) {
    //   console.log('refreshDataShoushu', this.insideShowData)
    //   this.insideJbxx = insideJbxx
    //   this.insideShowData = insideShowData
    // },
  },
};
</script>
<style lang="less" scoped>
.inner-wrap {
  // font-size: 12px;
  // height: 388px;
  // font-size: 12px;
  // padding: 10px;
  // width: 99%;

  max-height: 488px;
  // overflow-y: auto;
  // overflow: hidden;
  font-size: 12px;
  padding: 10px;
  // background-color: aquamarine;
  width: 99%;

  .div-surgery {
    overflow-y: auto;
    // height: 380px;
    height: 100%;
    padding-right: 10px;

    padding-bottom: 10px;
    display: flex;
    flex-direction: row;

    .div-jancha {
      width: 87%;
      border: 1px #eee solid;
      padding: 10px;
      height: 100%;

      .div-line-wrap {
        font-size: 12px;
        width: 100%;
        margin-top: 17px;
        display: flex;
        font-weight: bold;
        color: #333;
        align-items: center;
        flex-direction: row;

        .div-item-leng {
          // width: 62px;
          color: #999;
        }
        .div-item-leng-con {
          color: #1a1a1a;
          width: 600px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .div-item-four {
          width: 25%;
        }

        .div-item-three {
          width: 32%;
        }

        .div-item-two {
          width: 50%;
        }
      }
    }

    .div-shu {
      font-size: 12px;
      width: 12%;

      /deep/ .ant-timeline-item {
        padding: 0 0 8px 0 !important;
      }

      .div-line-content {
        font-size: 12px;

        .div-name {
          margin-left: 2%;
          margin-top: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &:hover {
          cursor: pointer;
        }
      }

      .doubled {
        color: #1890ff;
      }
    }
  }

  .nodata {
    height: 90%;
    width: 99%;
    text-align: center;
    padding-top: 150px;
  }
}
</style>
