<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div
      class="div-yiji"
      v-if="insideJbxx.newArr && insideJbxx.newArr.length > 0"
      style="overflow-y: auto; height: 380px; padding-right: 10px; padding-bottom: 10px"
    >
      <div class="div-jancha" v-if="insideShowType == 'jiancha'">
        <div class="div-line-wrap">
          <div class="div-item-two">
            检查名称：<span style="color: #333">{{ insideShowData.jcmc }}</span>
          </div>
          <div class="div-item-three">
            检查类型：<span style="color: #333">{{ insideShowData.jclx }}</span>
          </div>
          <div class="div-item-three">
            检查部位与方法：<span style="color: #333">{{ insideShowData.jcbwff }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">影响表现或检查所见：</div>
        </div>
        <div class="div-line-wrap">
          <span style="color: #333">{{ insideShowData.yxbxjcsj }}</span>
        </div>
        <div class="div-line-wrap">
          <div class="div-item-two">检查诊断或提示：</div>
        </div>
        <div class="div-line-wrap">
          <span style="color: #333">{{ insideShowData.yxzdts }}</span>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">备注或建议：</div>
        </div>
        <div class="div-line-wrap">
          <span style="color: #333">{{ insideShowData.bzhjy }}</span>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-three">
            检查日期：<span style="color: #333">{{ insideShowData.jcmc }}</span>
          </div>
          <div class="div-item-three">
            报告日期：<span style="color: #333">{{ insideShowData.jclx }}</span>
          </div>
        </div>
      </div>

      <div class="div-janyan" v-if="insideShowType == 'jianyan'">
        <div class="div-line-wrap">
          <div class="div-item-two">
            项目名称：<span style="color: #333">{{ insideShowData.bgdlb }}</span>
          </div>
          <div class="div-item-four">
            标本名称：<span style="color: #333">{{ insideShowData.bbmc }}</span>
          </div>
        </div>

        <a-table
          ref="table"
          :pagination="false"
          style="margin-top: 10px; margin-bottom: 10px"
          size="default"
          :scroll="{ x: true }"
          bordered
          :columns="columns"
          :data-source="insideShowData.jyjgzb"
          :alert="true"
          :rowKey="(record) => record.code"
        >
          <span slot="wrong" slot-scope="text, record">
            <span v-if="record.ycts == 1">正常</span>
            <a-icon v-else-if="record.ycts == 3" style="color: red" type="arrow-up" />
            <a-icon v-else-if="record.ycts == 4" style="color: red" type="arrow-down" />
            <span v-else>-</span>
            <!-- <a-icon type="arrow-down" /> -->
          </span>
        </a-table>
      </div>

      <div class="div-shu" style="overflow-y: auto; height: 370px">
        <!-- <div class="div-shu"> -->
        <a-timeline mode="left" style="margin-left: 5%; margin-top: 5%">
          <a-timeline-item
            v-for="(item, index) in insideJbxx.newArr"
            :color="item.color"
            :key="index"
            @click="onItemClick(item, index)"
          >
            <div class="div-line-content" :class="{ doubled: item.color == 'blue' }">
              {{ item.timeStr }}
              <div class="div-name" :title="item.name">
                {{ item.name }}
              </div>
            </div></a-timeline-item
          >
        </a-timeline>
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
    showType: String,
    showData: Object,
  },
  data() {
    return {
      // showType: '',
      insideJbxx: this.jbxx,
      insideShowType: this.showType,
      insideShowData: this.showData,
      // insideShowType: 'jiancha',

      columns: [
        {
          title: '序号',
          // innerHeight:20,
          dataIndex: 'xh',
        },
        {
          title: '代码',
          dataIndex: 'jczbdm',
          ellipsis: true,
        },
        {
          title: '名称',
          // innerHeight:20,
          dataIndex: 'jczbmc',
        },
        {
          title: '结果',
          dataIndex: 'jybgjg',
          ellipsis: true,
        },
        {
          title: '异常提示',
          // dataIndex: 'ycts',
          scopedSlots: { customRender: 'wrong' },
          // ellipsis: true,
        },
        {
          title: '单位',
          dataIndex: 'jldw',
          ellipsis: true,
        },
        {
          title: '参考范围',
          dataIndex: 'ckz',
          ellipsis: true,
        },
      ],
    }
  },

  created() {},
  methods: {
    onItemClick(itemOut, indexOut) {
      for (let index = 0; index < this.insideJbxx.newArr.length; index++) {
        this.insideJbxx.newArr[index].color = 'gray'
        if (indexOut == index) {
          this.insideJbxx.newArr[index].color = 'blue'
        }
      }

      this.insideShowType = this.insideJbxx.newArr[indexOut].type

      this.insideShowData = this.insideJbxx.newArr[indexOut].data
      console.log('this.insideShowData', this.insideShowData)
    },

    refreshData(insideJbxx, insideShowType, insideShowData) {
      this.insideJbxx = insideJbxx
      this.insideShowType = insideShowType
      this.insideShowData = insideShowData
    },
  },
}
</script>
<style lang="less" scoped>
.inner-wrap {
  font-size: 12px;
  height: 388px;
  font-size: 12px;
  padding: 10px;
  width: 99%;

  .div-yiji {
    display: flex;
    flex-direction: row;

    .div-jancha {
      width: 87%;
      height: 100%;
    }

    .div-line-wrap {
      width: 100%;
      // margin-top: 10px;
      display: flex;
      align-items: center;
      flex-direction: row;

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

    .div-janyan {
      width: 87%;
      height: 100%;
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
