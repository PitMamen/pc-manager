<template>
  <!-- <div style="height: 500px; width: 100%"> -->
  <div class="inner-wrap">
    <div v-if="jbxx" style="overflow-y: auto; height: 380px;padding-right: 10px;padding-bottom: 10px;">
      <!-- <span>{{ jbxx.name }}</span> -->
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">患者信息</span>
      </div>
      <div class="div-basic">
        <div class="div-line-wrap">
          <div class="div-item-four">
            姓名：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            性别：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            出生日期：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            年龄：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            民族：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            民族：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            新生儿出生体重：<span style="text-decoration: underline">{{ jbxx.name }}</span
            >&nbsp;克
          </div>
          <div class="div-item-four">
            新生儿入院体重：<span style="text-decoration: underline">{{ jbxx.name }}</span
            >&nbsp;克
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">
            出生地址：<span style="text-decoration: underline; width: 200px; display: inline-block">{{
              jbxx.name
            }}</span>
            <!-- 出生地址：<span style="border-bottom: 1px solid #333; width: 200px; display: inline-block">{{ -->
            <!-- jbxx.name
            }}</span> -->
          </div>

          <div class="div-item-four">
            <span style="text-decoration: underline"></span>
          </div>
          <div class="div-item-four">
            籍贯：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            身份证号：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            职业：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            婚姻：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">
            户籍地址：<span style="text-decoration: underline; width: 200px; display: inline-block"
              >飞飞飞哥哥哥日哥哥和认同和{{ jbxx.name }}</span
            >
            <!-- 出生地址：<span style="border-bottom: 1px solid #333; width: 200px; display: inline-block">{{ -->
            <!-- jbxx.name
            }}</span> -->
          </div>

          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-two">
            现居地址：<span style="text-decoration: underline; width: 200px; display: inline-block">{{
              jbxx.name
            }}</span>
          </div>
          <div class="div-item-four">
            电话：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
        </div>
        <div class="div-line-wrap">
          <div class="div-item-two">
            工作单位及地址：<span style="text-decoration: underline; width: 200px; display: inline-block">{{
              jbxx.name
            }}</span>
          </div>
          <div class="div-item-four">
            单位电话：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            邮编：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            联系人姓名：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            关系：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            地址：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            电话：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            入院途径：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            入院时间：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            入院科别：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            病房：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            转科：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four"></div>
          <div class="div-item-four"></div>
          <div class="div-item-four"></div>
        </div>

        <div class="div-line-wrap">
          <div class="div-item-four">
            出院时间：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            出院科别：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            病房：<span style="text-decoration: underline">{{ jbxx.name }}</span>
          </div>
          <div class="div-item-four">
            实际住院：<span style="text-decoration: underline">{{ jbxx.name }}</span
            >&nbsp;天
          </div>
        </div>
      </div>

      <div class="div-title" style="margin-top:10px">
        <div class="div-line-blue"></div>
        <span class="span-title">患者诊断</span>
      </div>
      <!-- :scroll="{ x: true }" -->
      <!-- style="margin-left: 2%; min-height: 450px; overflow-y: auto" -->
      <a-table
        ref="table"
        :pagination="false"
        style="margin-top:10px"
        size="default"
        bordered
        :columns="columns"
        :data-source="data"
        :alert="true"
        :rowKey="(record) => record.code"
      >
      </a-table>
    </div>

    <div v-else class="nodata">
      <img src="~@/assets/icons/img_nodata.png" />
    </div>
  </div>
</template>


<script>
import { getSoundRecordingList } from '@/api/modular/system/posManage'
//这里单独注册组件，可以考虑全局注册Vue.use(TimeLine)
import { Timeline } from 'ant-design-vue'

export default {
  components: {
    [Timeline.Item.name]: Timeline.Item,
  },
  props: {
    jbxx: Object,
  },
  data() {
    return {
      showResultInfo: false,
      audioSrc: '',
      data: [
        { id: 1, name: '检查' },
        { id: 2, name: '检验' },
      ],
      columns: [
        {
          title: '医院诊断类别名称',
          width: 60,
          // innerHeight:20,
          dataIndex: 'name',
        },
        {
          title: '诊断编码',
          width: 100,
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '诊断时间',
          width: 100,
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '主要诊断标志',
          width: 100,
          dataIndex: 'userName',
          ellipsis: true,
        },
        {
          title: '疑似诊断标志',
          width: 100,
          dataIndex: 'userName',
          ellipsis: true,
        },
      ],
    }
  },

  created() {
    // followPlanPhoneHistory(this.record.userId).then((res) => {
    //   if (res.code === 0) {
    //     this.historyList = res.data
    //     if (res.data && res.data.length > 0) {
    //       this.onHistoryItemClick(res.data[0].id)
    //     }
    //   } else {
    //     this.$message.error(res.message)
    //   }
    // })
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
  },
}
</script>
<style lang="less">
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

  .div-basic {
    padding: 0 10px 10px 10px;
    margin-top: 8px;
    color: #333;
    border: #eaeaea solid 1px;
    .div-line-wrap {
      width: 100%;
      margin-top: 10px;
      display: flex;
      align-items: center;
      flex-direction: row;

      .div-item-four {
        width: 25%;
      }

      .div-item-two {
        width: 50%;
      }
    }
  }
}
</style>
