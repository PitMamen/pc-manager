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

      <div class="div-jancha" style="overflow-y: auto; height: 370px">
        <div class="div-line-wrap" style="margin-top: 0">
          <div class="div-item-three" style="color: red">
            科室：<span>{{ insideShowData.data[0].ksmc }}</span>
          </div>
          <div class="div-item-three" style="color: red">
            住院号：<span>{{ insideShowData.data[0].zyh }}</span>
          </div>
          <div class="div-item-three" style="color: red">
            床号：<span>{{ insideShowData.data[0].ch || "-" }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">麻醉方式：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].mzfsmc }}</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">术前诊断：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].ssqzdmc }}</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">术后诊断：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].sshzdmc }}</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">手术名称：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].ssczmc }}</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng" style="width: 88px">手术过程描述：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].ssgcms }}</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng" style="width: 99px">手术及操作方法：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].ssjczff }}</div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-leng">手术过程：</div>
          <div class="div-item-leng-con">{{ insideShowData.data[0].ssgc }}</div>
        </div>

        <div class="div-line-wrap">
          <div style="width: 85%"></div>
          <div style="width: 15%">手术医生姓名：{{ insideShowData.data[0].ssysxm }}</div>
        </div>
        <div class="div-line-wrap">
          <div style="width: 85%"></div>
          <div style="width: 15%">麻醉医师姓名：{{ insideShowData.data[0].mzysxm }}</div>
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

  max-height: 388px;
  // overflow-y: auto;
  // overflow: hidden;
  font-size: 12px;
  padding: 10px;
  // background-color: aquamarine;
  width: 99%;

  .div-surgery {
    overflow-y: auto;
    height: 380px;
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
        margin-top: 12px;
        display: flex;
        font-weight: bold;
        color: #333;
        align-items: center;
        flex-direction: row;

        .div-item-leng {
          width: 62px;
        }
        .div-item-leng-con {
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
