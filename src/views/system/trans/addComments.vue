<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-wrap">
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">历史评论</span>
      </div>

      <div class="div-comment-item">
        <div style="height: 20px; background-color: #409eff"></div>
        <div class="child-item">
          <div class="child-head">王二</div>
          <div class="child-item-right">
            <div class="item-right-top">
              <div>王二</div>
              <div>【中南大学湘雅】</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import { getCommentList } from "@/api/modular/system/posManage";
import fileZhuyuan from "./fileZhuyuan";

import { TRUE_USER } from "@/store/mutation-types";
import { decodeRecord } from "@/utils/forgeUtils";
import { formatDateFull, formatDate } from "@/utils/util";
import Vue from "vue";
export default {
  components: { fileZhuyuan },
  // props: {
  //   record: Object,
  // },
  data() {
    return {
      activeKey: "1",
      confirmLoading: false,
      record: {},
      //canEdit 表示自己可以修改，切换相关UI  ；isNewComment 在外层表示是新增的评论，里层表示回复
      commentsData: [
        {
          comments: [
            { content: "你不能这样搞的，没床位了", canEdit: false, isNewComment: false },
            { content: "新增一个嘛", canEdit: false, isNewComment: false },
            { content: "", canEdit: false, isNewComment: true },
          ],
        },
        { comments: [{ content: "", canEdit: false, isNewComment: true }] },
      ],
      // commentsData: [
      //   {
      //     content: "你不能这样搞的，没床位了",
      //     canEdit: true,
      //     isNewComment: false,
      //     childList: [{ content: "新增一个嘛", canEdit: false, isNewComment: false }],
      //   },
      //   { content: "", canEdit: false, isNewComment: true, childList: [] },
      // ],
      accountUserId: "", //登录用户的userId
    };
  },

  created() {
    // debugger
    this.user = Vue.ls.get(TRUE_USER);

    //查询系统配置  显示不同档案来源
    // getSysConfigData('MEDICAL_DATA_SOURCE').then((res) => {
    //   this.MEDICAL_DATA_SOURCE = res.data.value || '0'

    //   if (this.MEDICAL_DATA_SOURCE == '1') {
    //     //从emr获取
    //     this.getZyRecordsOut()
    //   } else {
    //     //私有云
    //     this.getFileListOut()
    //   }
    // }).

    //私有云
    // this.getFileListOut();

    // this.getPatientBaseInfo();
  },
  methods: {
    //私有云档案 列表
    getCommentListOut() {
      let param = {
        pageNo: 1,
        pageSize: 1000000,
        // tradeId: this.record.tradeId,
        tradeId: "20231108095148621",
      };
      this.confirmLoading = true;
      // getCommentList({tradeId:this.record.tradeId})
      getCommentList(param)
        .then((res) => {
          if (res.code === 0) {
          } else {
            this.$message.error(res.message);
            this.confirmLoading = false;
          }
        })
        .finally(() => {
          this.confirmLoading = false;
        });
    },

    refreshData(record) {
      this.record = record;
      this.getCommentListOut();
    },

    goCancel() {
      console.log("hdh");
      this.$emit("handleCancel", "");
    },
  },
};
</script>
<style lang="less" scoped>
.div-wrap {
  display: flex;
  height: 450px;
  padding: 20px;
  font-size: 12px;
  flex-direction: column;
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

  .div-comment-item {
    margin-top: 20px;
    display: flex;
    flex-direction: column;

    .child-item {
      display: flex;
      flex-direction: row;
      align-items: center;

      .child-head {
        color: white;
        background-color: #1890ff;
        padding: 6px;
        border-radius: 15px;
      }

      .child-item-right {
        display: flex;
        flex-direction: column;

        .item-right-top {
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
    }

    // .comment-item-top {
    //   display: flex;
    //   flex-direction: row;
    //   align-items: center;
    // }
  }
}
</style>
