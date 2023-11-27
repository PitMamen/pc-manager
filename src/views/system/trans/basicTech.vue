<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <!-- v-if="insideJbxx.newArr && insideJbxx.newArr.length > 0" -->
  <div class="inner-wrap">
    <div v-if="!jianchaDataShow || !jianyanDataShow" class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div>
    <div class="div-yiji" style="padding-right: 10px; padding-bottom: 10px">
      <div class="kuang-content" v-if="insideShowType == 'jiancha' && jianchaDataShow">
        <div class="div-jancha" style="overflow-y: auto; height: 450px">
          <div class="div-line-wrap">
            <div class="div-item-two">
              检查名称：<span style="color: #1a1a1a; font-weight: bold">{{ jianchaSingeData.jcmc }}</span>
            </div>
            <div class="div-item-three">
              检查类型：<span style="color: #1a1a1a; font-weight: bold">{{ jianchaSingeData.examtype }}</span>
            </div>
            <div class="div-item-three">
              检查部位与方法：<span style="color: #1a1a1a; font-weight: bold">{{ jianchaSingeData.jcbw }}</span>
            </div>
          </div>

          <div class="div-line-wrap" style="margin-top: 20px">
            <div class="div-item-two">影像表现或检查所见：</div>
          </div>

          <!-- <div class="div-line-wrap" style="margin-top: 20px">
            <div style="font-weight: bold; color: black" class="div-item-two">{{ insideShowData[0].xybx }}</div>
          </div> -->

          <div class="div-line-wrap">
            <span style="color: #1a1a1a; font-weight: bold">{{ jianchaSingeData.yxbx }}</span>
          </div>
          <div class="div-line-wrap" style="margin-top: 20px">
            <div class="div-item-two">检查诊断或提示：</div>
          </div>
          <div class="div-line-wrap">
            <span style="color: #1a1a1a; font-weight: bold">{{ jianchaSingeData.yxzd }}</span>
          </div>

          <div class="div-line-wrap" style="margin-top: 20px">
            <div class="div-item-two">备注或建议：</div>
          </div>
          <div class="div-line-wrap">
            <span style="color: #1a1a1a; font-weight: bold">{{ jianchaSingeData.bzhjy }}</span>
          </div>

          <div class="div-line-wrap" style="margin-top: 20px">
            <div class="div-item-three">
              检查日期：<span style="color: #1a1a1a; font-weight: bold">{{ jianchaSingeData.jysj }}</span>
            </div>
            <div class="div-item-three">
              报告日期：<span style="color: #1a1a1a; font-weight: bold">{{ jianchaSingeData.bgrq }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="kuang-content" v-if="insideShowType == 'jianyan'&&jianyanDataShow">
        <div class="div-janyan" style="overflow-y: auto; height: 450px">
          <div class="div-line-wrap">
            <div class="div-item-two">
              项目名称：<span style="color: #333; font-weight: bold">{{ jianyanSingeData.bgdlb }}</span>
            </div>
            <div class="div-item-two">
              标本名称：<span style="color: #333; font-weight: bold">{{ jianyanSingeData.bbmc }}</span>
            </div>
            <div class="div-item-two">
              报告日期：<span style="color: #333; font-weight: bold">{{ jianyanSingeData.jyrq }}</span>
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
            :data-source="bacteriaInfo"
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

      <!-- 检验报告时间轴 -->
      <div class="div-shu" style="height: 450px" v-if="insideShowType == 'jianyan'">
        <a-timeline mode="left" style="margin-left: 5%; margin-top: 5%">
          <a-timeline-item
            v-for="(item, index) in jianyanDataShow"
            :color="item.color"
            :key="index"
            @click="onItemClick(item, index)"
          >
            <div class="div-line-content" :class="{ doubled: item.color == 'blue' }">
              {{ item.jyrq }}
              <div class="div-name" :title="item.name">
                {{ item.bgdlb }}
              </div>
            </div></a-timeline-item
          >
        </a-timeline>
      </div>

      <!-- 检查报告时间轴 -->

      <div class="div-shu" style="height: 450px" v-if="insideShowType == 'jiancha'">
        <a-timeline mode="left" style="margin-left: 5%; margin-top: 5%">
          <a-timeline-item
            v-for="(item, index) in jianchaDataShow"
            :color="item.color"
            :key="index"
            @click="onItemClickJiancha(item, index)"
          >
            <div class="div-line-content" :class="{ doubled: item.color == 'blue' }">
              {{ item.jysj || '2023-10-12' }}
              <div class="div-name" :title="item.name">
                {{ item.jcmc || '脑部CT' }}
              </div>
            </div></a-timeline-item
          >
        </a-timeline>
      </div>
    </div>

    <!-- <div v-if="!jianchaDataShow || !jianyanDataShow" class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div> -->
  </div>
</template>


<script>
import { formatDateFull, formatDate, countAge } from '@/utils/util'
export default {
  components: {},
  props: {
    // jbxx: Object,
    // showType: String,
    // showData: Object,
  },
  data() {
    return {
      insideShowType: '',
      jianchaDataShow: [],
      jianyanDataShow: [],
      bacteriaInfo: [],

      jianyanSingeData: {},
      jianchaSingeData: {},

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
          dataIndex: 'jczbjg',
          ellipsis: true,
        },
        {
          title: '异常提示',
          dataIndex: 'ycts',
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

  mounted() {},

  methods: {
    // 检验报告时间轴点击
    onItemClick(itemOut, indexOut) {
      for (let index = 0; index < this.jianyanDataShow.length; index++) {
        this.jianyanDataShow[index].color = 'gray'
        if (indexOut == index) {
          this.jianyanDataShow[index].color = 'blue'
        }
      }
      this.bacteriaInfo = this.jianyanDataShow[indexOut].indicatorInfo
      if (this.bacteriaInfo) {
        this.bacteriaInfo.forEach((item, index) => {
          this.$set(item, 'xh', index + 1)
        })
      }
      this.jianyanSingeData = this.jianyanDataShow[indexOut]
    },

    // 检查报告时间轴点击
    onItemClickJiancha(itemOut, indexOut) {
      for (let index = 0; index < this.jianchaDataShow.length; index++) {
        this.jianchaDataShow[index].color = 'gray'
        if (indexOut == index) {
          this.jianchaDataShow[index].color = 'blue'
        }
      }
      // this.bacteriaInfo = this.jianchaDataShow[indexOut].indicatorInfo
      this.jianchaSingeData = this.jianchaDataShow[indexOut]
    },

    resetData() {
      this.jianyanDataShow = []
      this.jianchaDataShow = []
      this.bacteriaInfo = []
      this.jianyanSingeData = {}
      this.jianchaDataShow = {}
    },

    refreshData(insideJbxx, insideShowType) {
      this.insideShowType = insideShowType
      this.resetData()
      console.log('showType:', insideJbxx, this.insideShowType)
      if (insideShowType == 'jianyan') {
        this.jianyanDataShow = insideJbxx
        if (this.jianyanDataShow && this.jianyanDataShow.length > 0) {
          this.jianyanDataShow.forEach((item, index) => {
            this.$set(item, 'jyrq', formatDateFull(item.jyrq).substring(0, 10))
            // this.$set(item, 'color', 'gray')
            this.$set(item, 'color', index == 0 ? 'blue' : 'gray')
          })

          this.bacteriaInfo = this.jianyanDataShow[0].indicatorInfo
          this.jianyanSingeData = this.jianyanDataShow[0]
          if (this.bacteriaInfo) {
            this.bacteriaInfo.forEach((item, index) => {
              this.$set(item, 'xh', index + 1)
            })
          }
        }
      } else if (insideShowType == 'jiancha') {
        this.jianchaDataShow = insideJbxx
        if (this.jianchaDataShow && this.jianchaDataShow.length > 0) {
          this.jianchaDataShow.forEach((item, index) => {
            this.$set(item, 'color', index == 0 ? 'blue' : 'gray')
            if (item.jysj) {
              this.$set(item, 'jysj', formatDateFull(item.jysj).substring(0, 10))
            }
            if (item.bgrq) {
              this.$set(item, 'bgrq', item.bgrq.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'))
            }
          })

          this.jianchaSingeData = this.jianchaDataShow[0]
        }
      }
    },
  },
}
</script>
<style lang="less" scoped>
.inner-wrap {
  font-size: 12px;
  height: 488px;
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
      // justify-content: space-between;

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

    .kuang-content {
      width: 90%;
      padding: 20px;
      background: #ffffff;
      border: 1px solid #e6e6e6;
      height: 470px;

      .div-janyan {
        // width: 87%;
        height: 100%;
      }
    }

    .div-shu {
      font-size: 12px;
      // margin-right: 1%;
      margin-left: 20px;
      // width: 12%;

      /deep/ .ant-timeline-item {
        padding: 0 0 8px 0 !important;
      }

      .div-line-content {
        width: 100px;
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
