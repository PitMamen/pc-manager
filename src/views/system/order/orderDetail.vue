<template>
    <a-spin :spinning="confirmLoading">

        <div
          class="div-choose-ke"
          v-for="(itemOut, indexOut) in configData.tasksKe"
          :key="indexOut"
          :value="itemOut.id"
        ></div>
    </a-spin>
  </template>
  
  <script>
  import {
    getCommodityPkgDetailByid,
    qryServiceItemList,
    delCollectionItemByid,
    delCommodityPkgCollectionByid,
    getDictData,
    saveCommodityPkgCollection,
  } from '@/api/modular/system/posManage'
  import moment from 'moment'
  import { TRUE_USER } from '@/store/mutation-types'
  import Vue from 'vue'
  import { formatDate, formatDateFull } from '@/utils/util'
  
  export default {
    components: {},
  
    data() {
      return {
        user: {},
        keshiData: {},
        deptUsers: {},
        record: undefined,
        commodityPkgId: undefined,
        serviceData: [],
        serviceTypes: [],
  
        confirmLoading: false,
        configData: {
          tasksKe: [{ itemsKe: [{ quantity: 1, saleAmount: undefined, isHeadImg: true }] }],
          tasksBi: [{ quantity: 1, saleAmount: undefined, isHeadImg: true }],
        },
  
      }
    },
  
    created() {
      this.user = Vue.ls.get(TRUE_USER)
  
    },
  
    watch: {
      $route(to, from) {
        // console.log('watch----configEdit out', to, from)
        // if (to.path.indexOf('configEdit') > -1) {
        //   console.log('watch----configEdit', to, from)
        //   this.record = JSON.parse(this.$route.query.recordStr)
        //   this.qryServiceItemListOut('', true)
        // }
      },
    },
  
    methods: {
      moment,
  
      //入口
      detail(record){
       console.log("KKKK:",record)
      },







      
      },

    }
  </script>
  
  <style lang="less" scoped>
  .div-config-edit {
    background-color: white;
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 1%;
    padding-bottom: 2%;
  
    span {
      font-size: 12px;
    }
  
    .div-add-empty {
      width: 100%;
      margin-top: 18px;
      .span-empty {
        padding: 4px 15px;
        // background-color: yellow;
        // width: 100px;
        display: inline-block;
        color: #1890ff;
        border: 1px solid #1890ff;
        // border: 2px solid #1890ff;
        // border: 2px solid #01AFF4;
        // border-radius: 8px;
        margin-left: 30px;
  
        &:hover {
          cursor: pointer;
        }
      }
    }
  
    .div-title {
      display: flex;
      background-color: #ebebeb;
      flex-direction: row;
      width: 100%;
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
  
    .div-pro-up {
      width: 100%;
  
      .div-up-content {
        width: 100%;
        display: flex;
        padding-left: 8px;
        padding-top: 1%;
        flex-direction: row;
  
        .div-up-left {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          flex: 1;
        }
  
        .div-up-right {
          display: flex;
  
          flex-direction: row;
          align-items: center;
        }
        .span-item-name {
          display: inline-block;
          margin-left: 50px;
          color: #000;
          font-size: 12px;
          text-align: left;
        }
        .span-item-value {
          // width: 38%;
          color: #333;
          text-align: left;
          padding-left: 8px;
          font-size: 12px;
          display: inline-block;
  
          //限制一行
          overflow: hidden; //溢出隐藏
          text-overflow: ellipsis; //超出省略号显示
          white-space: nowrap; //文字不换行
        }
      }
    }
  
    .div-pro-middle {
      margin-top: 1%;
      .div-choose-item {
        border: 1px solid #e6e6e6;
        border-radius: 6px;
        margin-top: 10px;
        .mission-top {
          margin-top: 10px;
          width: 100%;
          display: flex;
          flex-direction: row;
          align-items: center;
  
          .div-img {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-right: 15px;
            &:hover {
              cursor: pointer;
            }
          }
          .mission-top-left {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex: 1;
            /deep/ .ant-time-picker-input {
              height: 28px !important;
            }
  
            .mid-select-one.ant-select {
              width: 10% !important;
              margin-left: 1% !important;
            }
            .mid-select-two.ant-select {
              width: 10% !important;
              margin-left: 1% !important;
            }
  
            .end-btn-stop {
              display: flex;
              flex-direction: row;
              align-items: center;
  
              &:hover {
                cursor: pointer;
              }
            }
          }
        }
  
        .mission-bottom-bi {
          margin-top: 5px;
          margin-bottom: 5px;
          width: 99%;
          display: flex;
          flex-direction: row;
          align-items: center;
  
          .end-btn {
            display: flex;
            flex-direction: row;
            align-items: center;
  
            &:hover {
              cursor: pointer;
            }
          }
  
          .end-btn-task {
            display: flex;
            flex-direction: row;
            align-items: center;
  
            .span-end {
              padding: 4px 15px;
              // background-color: yellow;
              // width: 100px;
              display: inline-block;
              color: #1890ff;
              border: 1px solid #1890ff;
              // border: 2px solid #1890ff;
              // border: 2px solid #01AFF4;
              // border-radius: 8px;
              margin-left: 2%;
  
              &:hover {
                cursor: pointer;
              }
            }
          }
  
          .mission-bottom-left {
            width: 100%;
            display: flex;
            flex: 1;
            flex-direction: row;
            align-items: center;
  
            .mid-select-one.ant-select {
              width: 12% !important;
              margin-left: 1% !important;
            }
            .mid-select-two.ant-select {
              width: 80px !important;
              margin-left: 1% !important;
            }
          }
        }
  
        .div-divider {
          margin: 10px 0% 0% 1%;
          width: 98%;
          background-color: #e6e6e6;
          height: 1px;
        }
      }
      .div-choose-ke {
        border-radius: 6px;
        padding: 10px;
        margin-top: 10px;
        border: 1px solid #e6e6e6;
        width: 100%;
  
        .end-btn-choose {
          display: flex;
          margin-top: 20px;
          margin-left: 87.3%;
          margin-bottom: 10px;
          flex-direction: row;
          align-items: center;
  
          .span-end {
            padding: 4px 15px;
            width: 92px;
            display: inline-block;
            // background-color: yellow;
            // width: 100px;
            color: #1890ff;
            border: 1px solid #1890ff;
            // border: 2px solid #1890ff;
            // border: 2px solid #01AFF4;
            // border-radius: 8px;
            margin-left: 2%;
  
            &:hover {
              cursor: pointer;
            }
          }
        }
  
        .mission-bottom {
          margin-top: 5px;
          margin-bottom: 5px;
          width: 99%;
          display: flex;
          flex-direction: row;
          align-items: center;
  
          .end-btn {
            display: flex;
            flex-direction: row;
            align-items: center;
  
            &:hover {
              cursor: pointer;
            }
          }
  
          .end-btn-task {
            display: flex;
            flex-direction: row;
            align-items: center;
  
            .span-end {
              padding: 4px 15px;
              // background-color: yellow;
              // width: 100px;
              display: inline-block;
              color: #1890ff;
              border: 1px solid #1890ff;
              // border: 2px solid #1890ff;
              // border: 2px solid #01AFF4;
              // border-radius: 8px;
              margin-left: 2%;
  
              &:hover {
                cursor: pointer;
              }
            }
          }
  
          .mission-bottom-left {
            width: 100%;
            display: flex;
            flex: 1;
            flex-direction: row;
            align-items: center;
  
            .mid-select-one.ant-select {
              width: 12% !important;
              margin-left: 1% !important;
            }
            .mid-select-two.ant-select {
              width: 80px !important;
              margin-left: 1% !important;
            }
          }
        }
      }
    }
  
    .div-pro-btn {
      display: flex;
      flex-direction: row;
      align-items: center;
  
      margin-top: 3%;
    }
  }
  </style>
  