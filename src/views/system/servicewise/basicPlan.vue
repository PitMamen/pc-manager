<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div
      class="div-yizhu"
      v-if="insideJbxx.yzxx && insideJbxx.yzxx.length > 0"
      style="padding-right: 10px; padding-bottom: 10px"
    >
      <div class="div-shu" style="overflow-y: auto; height: 370px">
        <!-- <div class="div-shu"> -->
        <a-timeline mode="left" style="margin-left: 5%; margin-top: 5%">
          <a-timeline-item
            v-for="(item, index) in insideJbxx.yzxx"
            :color="item.color"
            :key="index"
            @click="onItemClick(item, index)"
          >
            <div class="div-line-content" :class="{ doubled: item.color == 'blue' }">
              {{ item.timeStr }}
              <!-- <div class="div-name" :title="item.name">
                {{ item.name }}
              </div> -->
            </div></a-timeline-item
          >
        </a-timeline>
      </div>
      <div class="div-janyan" style="overflow-y: auto; height: 370px">
        <a-table
          ref="table"
          :pagination="false"
          style="margin-bottom: 10px"
          size="default"
          :scroll="{ x: true }"
          bordered
          :columns="columns"
          :data-source="insideShowDataYizhu.data"
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
    record: Object,
  },
  data() {
    return {
      insideJbxx: this.jbxx,
      insideShowDataYizhu: this.showData,

      columns: [
        {
          title: '药物名称',
          // innerHeight:20,
          dataIndex: 'yzmxmc',
        },
        {
          title: '药品规格',
          dataIndex: 'ypgg',
          ellipsis: true,
        },
        {
          title: '发药数量',
          // innerHeight:20,
          dataIndex: 'fysl',
        },
        {
          title: '药品用法',
          dataIndex: 'ypyf',
          ellipsis: true,
        },
        {
          title: '每次剂量',
          dataIndex: 'mcjl',
          ellipsis: true,
        },
        {
          title: '每次数量',
          dataIndex: 'mcsl',
          ellipsis: true,
        },
        {
          title: '用药频度',
          dataIndex: 'yypd',
          ellipsis: true,
        },
        {
          title: '用药天数',
          dataIndex: 'yyts',
          ellipsis: true,
        },
      ],
    }
  },

  created() {},
  methods: {
    onItemClick(itemOut, indexOut) {
      for (let index = 0; index < this.insideJbxx.yzxx.length; index++) {
        this.insideJbxx.yzxx[index].color = 'gray'
        if (indexOut == index) {
          this.insideJbxx.yzxx[index].color = 'blue'
        }
      }
      this.insideShowDataYizhu = this.insideJbxx.yzxx[indexOut]
      console.log('this.insideShowDataYizhu', this.insideShowDataYizhu)
    },

    refreshData(insideJbxx, showDataYizhu) {
      this.insideJbxx = insideJbxx
      this.insideShowDataYizhu = showDataYizhu
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

  .div-yizhu {
    display: flex;
    flex-direction: row;

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
