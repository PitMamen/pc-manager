<template>
  <a-spin :spinning="confirmLoading">
    <div class="wrap-upload">
      <div class="btn-back" @click="goBack">返回</div>

      <div class="btn-out" @click="goBack">重新上传</div>

      <div class="wrap-info" style="margin-top: 20px">
        <div class="info-per">
          <div>姓名：{{ item.userName }}</div>
          <div class="shu-line"></div>
          <div>性别：{{ item.sex }}</div>
          <div class="shu-line"></div>
          <div>年龄：{{ item.age }}</div>
          <div class="shu-line"></div>
          <div>联系方式：{{ item.userPhone }}</div>
        </div>
      </div>

      <div class="wrap-info">
        <div class="info-per">
          <div>机构：{{ item.hospitalName }}</div>
          <div class="shu-line"></div>
          <div>服务医生：{{ item.sex }}</div>
          <div class="shu-line"></div>
          <div>业务类型：{{ item.broadClassifyName }}</div>
          <div class="shu-line"></div>
          <div>服务时间：{{ item.userPhone }}</div>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">预约信息</div>
          <div class="card-status">已上传</div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <div class="wrap-hor">
            <div class="hor-half">
              <div>业务单号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
          </div>

          <div class="wrap-hor" style="margin-top: 20px">
            <div class="hor-half">
              <div>业务单号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
          </div>

          <div style="background-color: #e6e6e6; height: 1px; margin-top: 10px"></div>

          <div class="bottom-content">
            <div>上传记录：</div>
            <a-timeline>
              <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
              <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
              <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
              <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
            </a-timeline>
          </div>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">在线咨询</div>
          <div class="card-status">已上传</div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <div class="wrap-hor">
            <div class="hor-half">
              <div>业务单号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
          </div>

          <div class="wrap-hor" style="margin-top: 20px">
            <div class="hor-half">
              <div>业务单号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
          </div>

          <div style="background-color: #e6e6e6; height: 1px; margin-top: 10px"></div>

          <div class="bottom-content">
            <div>上传记录：</div>
            <a-timeline>
              <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
              <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
              <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
              <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
            </a-timeline>
          </div>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">在线复诊</div>
          <div class="card-status">已上传</div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <div class="wrap-hor">
            <div class="hor-half">
              <div>业务单号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
          </div>

          <div class="wrap-hor" style="margin-top: 20px">
            <div class="hor-half">
              <div>业务单号：</div>
              <div>{{ item.orderId }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
            <div class="hor-half">
              <div>业务类型：</div>
              <div>{{ item.broadClassifyName }}</div>
            </div>
          </div>

          <div style="background-color: #e6e6e6; height: 1px; margin-top: 10px"></div>

          <div class="bottom-content">
            <div>上传记录：</div>
            <a-timeline>
              <a-timeline-item>Create a services site 2015-09-01</a-timeline-item>
              <a-timeline-item>Solve initial network problems 2015-09-01</a-timeline-item>
              <a-timeline-item>Technical testing 2015-09-01</a-timeline-item>
              <a-timeline-item>Network problems being solved 2015-09-01</a-timeline-item>
            </a-timeline>
          </div>
        </div>
      </div>

      <!-- 单个卡片 -->
      <div class="div-card">
        <div class="card-top">
          <div class="cart-title">处方信息</div>
          <div class="card-status">已上传</div>
        </div>
        <div class="div-divider"></div>
        <div class="card-bottom">
          <a-table :columns="columns" :data-source="data">
            <a slot="name" slot-scope="text">{{ text }}</a>
            <span slot="action" slot-scope="text, record">
              <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
            </span>
          </a-table>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import { saveGoodsClass, getDepts } from '@/api/modular/system/posManage'
import { TRUE_USER, ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'

export default {
  components: {},

  data() {
    return {
      item: {
        id: 57,
        broadClassifyName: '咨询服务类',
        rightsId: '708',
        orderId: '1648592815308070914',
        userId: 1841,
        userName: '沈峰',
        userPhone: '13574111026',
        createTime: '2023-06-09 14:17:05',
        uploadUserId: null,
        uploadUserName: null,
        uploadTime: '',
        eventType: '评价自动生成不良事件',
        eventDesc: '服务评价低于三星',
        eventReason: '医生回复超快，解答详细，医术高明。哈哈哈哈哈',
        eventDeal: null,
        eventLevel: null,
        eventImprove: null,
        status: 3,
        uploadFlag: null,
        tenantId: '100000',
        hospitalCode: '444885559',
        hospitalName: '湘雅二医院',
        sex: '男',
        age: '28',
        statusText: '未登记',
      },
      confirmLoading: false,
      columns: [
        {
          title: '处方号',
          dataIndex: 'name',
          key: 'name',
          scopedSlots: { customRender: 'name' },
        },
        {
          title: '处方类型',
          dataIndex: 'age',
          key: 'age',
          width: 80,
        },
        {
          title: '业务类型',
          dataIndex: 'address',
          key: 'address 1',
          ellipsis: true,
        },
        {
          title: '诊断名称',
          dataIndex: 'address',
          key: 'address 2',
          ellipsis: true,
        },
        {
          title: '开方日期',
          dataIndex: 'address',
          key: 'address 3',
          ellipsis: true,
        },
        {
          title: '处方金额',
          dataIndex: 'address',
          key: 'address 3',
          ellipsis: true,
        },
        {
          title: '是否支付',
          dataIndex: 'address',
          key: 'address 3',
          ellipsis: true,
        },
        {
          title: '上传状态',
          dataIndex: 'address',
          key: 'address 3',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
        },
      ],

      data: [
        {
          key: '1',
          name: 'John Brown',
          age: 32,
          address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
        },
        {
          key: '2',
          name: 'Jim Green',
          age: 42,
          address: 'London No. 2 Lake Park, London No. 2 Lake Park',
          tags: ['loser'],
        },
        {
          key: '3',
          name: 'Joe Black',
          age: 32,
          address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
          tags: ['cool', 'teacher'],
        },
      ],
    }
  },

  watch: {
    visible() {},
  },

  created() {
    this.headers.Authorization = Vue.ls.get(ACCESS_TOKEN)
    this.getDeptsOut()
  },

  methods: {
    //返回
    goBack() {
      this.$router.go(-1)
      // this.$router.back()
    },

    getDeptsOut() {
      getDepts().then((res) => {
        if (res.code == 0) {
          this.keshiData = res.data
          this.keshiDataTemp = JSON.parse(JSON.stringify(this.keshiData))
        } else {
          // this.$message.error('获取计划列表失败：' + res.message)
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.wrap-upload {
  background-color: white;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 20px;
  font-size: 12px;

  .btn-back {
    display: inline-block;
    padding: 5px 20px;
    color: #409eff;
    background-color: white;
    border: 1px solid #409eff;
    border-radius: 2px;
    &:hover {
      cursor: pointer;
    }
  }
  .btn-out {
    display: inline-block;
    padding: 5px 20px;
    color: white;
    background-color: #409eff;
    border: 1px solid #409eff;
    border-radius: 2px;
    position: absolute;
    top: 72px;
    right: 20px;
    font-size: 12px;
    &:hover {
      cursor: pointer;
    }
  }

  .wrap-info {
    .info-per {
      display: flex;
      flex-direction: row;
      align-items: center;

      .shu-line {
        margin: 0 8px;
        height: 10px;
        width: 1px;
        background-color: #999;
      }
    }
  }

  .div-card {
    display: flex;
    margin-top: 20px;
    flex-direction: column;
    border: 1px solid #e6e6e6;
    border-radius: #e6e6e6;

    .card-top {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 10px 20px;

      .cart-title {
        font-weight: bold;
        flex: 1;
        font-size: 14px;
        color: #1a1a1a;
      }

      .card-status {
        display: inline-block;
        padding: 5px 20px;
        color: white;
        background-color: #409eff;
        border: 1px solid #409eff;
        border-radius: 2px;
      }
    }

    .div-divider {
      background-color: #e6e6e6;
      height: 1px;
    }

    .card-bottom {
      display: flex;
      flex-direction: column;
      padding: 10px 20px 0 20px;
      .wrap-hor {
        display: flex;
        flex-direction: row;
        align-items: center;

        .hor-half {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 33%;
        }
      }

      .bottom-content {
        display: flex;
        flex-direction: row;
        margin-top: 15px;

        .ant-timeline-item {
          padding-bottom: 10px !important;
        }

        // .ant-timeline-item-last > .ant-timeline-item-content {
        //   min-height: 0 !important;
        // }
      }
    }
  }

  /deep/ .ant-timeline-item-last > .ant-timeline-item-content {
    min-height: 0 !important;
  }
}
</style>
