<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-wrap">
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">历史评论</span>
      </div>

      <div class="div-comment-item" v-for="(item, index) in commentsData" :key="index">
        <div style="height: 20px; background-color: #409eff"></div>
        <div class="comment-item-bottom">
          <div class="data-head">{{ item.userName }}</div>
          <div class="data-item-right">
            <div class="item-right-top">
              <div>{{ item.userName }}</div>
              <div style="margin-left: 10px">【{{ item.userHospitalName }}】</div>
              <div style="margin-left: 10px">{{ item.createTime }}</div>

              <div style="flex: 1"></div>
              <div class="btn-div">
                <div class="btn-no">
                  <img src="@/assets/icons/huifu.png" style="width: 12px; height: 12px" />
                  <div style="color: #409eff; margin-left: 5px">回复</div>
                </div>
                <div class="btn-no">
                  <a-icon type="edit" style="color: #409eff; margin-left: 20px" />
                  <div style="color: #409eff; margin-left: 5px">编辑</div>
                </div>
                <div class="btn-no">
                  <a-icon type="delete" style="color: #409eff; margin-left: 20px" />
                  <div style="color: #409eff; margin-left: 5px">删除</div>
                </div>
              </div>
            </div>

            <div class="comment-content">{{ item.text }}</div>
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
          id: 12,
          userId: 1,
          userName: "管理员",
          userHospitalCode: "444885559",
          userHospitalName: "中南大学湘雅二医院",
          createTime: 1700557618000,
          text: "5555555",
          tradeId: 20231108095148621,
          atName: "",
          listChild: [],
          self: "yes",
          pid: 0,
        },
        {
          id: 11,
          userId: 1,
          userName: "管理员",
          userHospitalCode: "444885559",
          userHospitalName: "中南大学湘雅二医院",
          createTime: 1700557612000,
          text: "4444",
          tradeId: 20231108095148621,
          atName: "",
          listChild: [
            {
              id: 14,
              userId: 1,
              userName: "管理员",
              userHospitalCode: "444885559",
              userHospitalName: "中南大学湘雅二医院",
              createTime: 1700557888000,
              text: "66666_66",
              tradeId: 20231108095148621,
              atName: "管理员",
              listChild: null,
              self: null,
              pid: 11,
            },
            {
              id: 15,
              userId: 1,
              userName: "管理员",
              userHospitalCode: "444885559",
              userHospitalName: "中南大学湘雅二医院",
              createTime: 1700557920000,
              text: "66666_6677",
              tradeId: 20231108095148621,
              atName: "管理员",
              listChild: null,
              self: null,
              pid: 11,
            },
          ],
          self: "yes",
          pid: 0,
        },
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
  },
  methods: {
    //获取评论列表
    getCommentListOut() {
      // let param = {
      //   pageNo: 1,
      //   pageSize: 100,
      //   // tradeId: this.record.tradeId,
      //   tradeId: "20231108095148621",
      // };
      let param = {
        pageNo: 1,
        pageSize: 1000,
        tradeId: "20231108095148621",
      };
      this.confirmLoading = true;
      debugger;
      getCommentList(param)
        .then((res) => {
          debugger;
          if (res.code === 0) {
            // this.commentsData = res.data.records
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
      // this.getCommentListOut();

      getCommentList({ pageNo: 1, pageSize: 100, tradeId: "20231108095148621" }).then(
        (res) => {
          if (res.code == 0) {
            // this.commentsData = res.data.records
          } else {
            this.$message.error(res.message);
          }
          this.confirmLoading = false;
        }
      );
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
    padding-bottom: 10px;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    box-shadow: 0px 0px 2px 2px #e6e6e6 inset;
    border-radius: 4px;

    .comment-item-bottom {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding-right: 30px;
      padding-left: 10px;
      margin-top: 10px;

      .data-head {
        color: white;
        background-color: #1890ff;
        padding: 6px;
        border-radius: 15px;
      }

      .data-item-right {
        display: flex;
        margin-left: 10px;
        flex: 1;
        flex-direction: column;

        .item-right-top {
          display: flex;
          margin-left: 10px;
          flex-direction: row;
          align-items: center;

          .btn-div {
            display: flex;
            flex-direction: row;
            align-items: center;

            .btn-no {
              display: flex;
              flex-direction: row;
              align-items: center;

              &:hover {
                cursor: pointer;
              }
            }
          }
        }

        .comment-content {
          margin-left: 10px;
          margin-top: 20px;
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
