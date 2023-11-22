<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-wrap">
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">历史评论</span>
      </div>

      <!-- v-if="commentsData.length > 0" -->
      <div
        v-if="commentsData.length > 0"
        class="div-comment-item"
        v-for="(item, index) in commentsData"
        :key="index"
      >
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
                <!-- <div class="btn-no" v-if="item.self != 'yes'"> -->
                <div class="btn-no">
                  <img src="@/assets/icons/huifu.png" style="width: 12px; height: 12px" />
                  <div style="color: #409eff; margin-left: 5px">回复</div>
                </div>
                <div class="btn-no" v-if="item.self == 'yes'">
                  <a-icon type="edit" style="color: #409eff; margin-left: 20px" />
                  <div style="color: #409eff; margin-left: 5px">编辑</div>
                </div>

                <a-popconfirm
                  placement="topRight"
                  title="确认删除吗？"
                  @confirm="() => deleteCommentOut(item.id)"
                >
                  <div class="btn-no" v-if="item.self == 'yes'">
                    <a-icon type="delete" style="color: #409eff; margin-left: 20px" />
                    <div style="color: #409eff; margin-left: 5px">删除</div>
                  </div>
                </a-popconfirm>
              </div>
            </div>

            <div class="comment-content">{{ item.text }}</div>
            <div
              v-if="item.listChild.length > 0"
              style="height: 1px; background-color: #e6e6e6"
            ></div>
          </div>
        </div>

        <div
          class="div-comment-child"
          v-for="(child, indexChild) in item.listChild"
          :key="indexChild"
        >
          <div class="comment-child-bottom">
            <div class="data-head-child">{{ child.userName }}</div>
            <div class="data-child-right">
              <div class="child-right-top">
                <div>{{ child.userName }}</div>
                <div style="margin-left: 10px">【{{ child.userHospitalName }}】</div>
                <div style="margin-left: 10px">{{ child.createTime }}</div>

                <div style="flex: 1"></div>
                <div class="btn-div">
                  <div class="btn-no" v-if="item.self != 'yes'">
                    <img
                      src="@/assets/icons/huifu.png"
                      style="width: 12px; height: 12px"
                    />
                    <div style="color: #409eff; margin-left: 5px">回复</div>
                  </div>
                  <div class="btn-no" v-if="item.self == 'yes'">
                    <a-icon type="edit" style="color: #409eff; margin-left: 20px" />
                    <div style="color: #409eff; margin-left: 5px">编辑</div>
                  </div>
                  <div class="btn-no" v-if="item.self == 'yes'">
                    <a-icon type="delete" style="color: #409eff; margin-left: 20px" />
                    <div style="color: #409eff; margin-left: 5px">删除</div>
                  </div>
                </div>
              </div>

              <div
                :class="
                  indexChild == item.listChild.length - 1
                    ? 'comment-content-child-last'
                    : 'comment-content-child'
                "
              >
                {{ child.text }}
              </div>
              <!-- <div style="height: 1px; background-color: #e6e6e6"></div> -->
            </div>
          </div>
        </div>
      </div>

      <div class="div-add-coment">
        <div style="height: 20px; background-color: #409eff"></div>
        <div class="add-coment-bottom">
          <div class="add-coment-head">{{ user.userName }}</div>
          <div class="add-coment-right">
            <a-textarea
              :rows="2"
              v-model="newcommet"
              :maxlength="300"
              placeholder="请输入评论"
            ></a-textarea>

            <div class="div-comment-handle">
              <div style="flex: 1"></div>
              <a-button
                type="primary"
                :loading="submitLoading"
                @click="addCommentOut(0, newcommet)"
                style="margin-right: 20px"
              >
                保存
              </a-button>
              <a-button @click="() => (newcommet = '')">取消</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script>
import {
  getCommentList,
  addComment,
  deleteComment,
  modifyComment,
} from "@/api/modular/system/posManage";
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
      newcommet: "",
      confirmLoading: false,
      submitLoading: false,
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
      user: {},
    };
  },

  created() {
    // debugger
    this.user = Vue.ls.get(TRUE_USER);
    console.log("dddddddddddddddddddddddddd", this.user);
  },
  methods: {
    //获取评论列表
    getCommentListOut() {
      let param = {
        pageNo: 1,
        pageSize: 1000,
        tradeId: this.record.tradeId,
        // tradeId: "20231108095148621",
      };
      this.confirmLoading = true;
      debugger;
      getCommentList(param)
        .then((res) => {
          debugger;
          if (res.code === 0) {
            if (res.data && res.data.records) {
              this.commentsData = res.data.records;
            } else {
              this.commentsData = [];
            }
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

      // getCommentList({ pageNo: 1, pageSize: 100, tradeId: "20231108095148621" }).then(
      //   (res) => {
      //     if (res.code == 0) {
      //       // this.commentsData = res.data.records
      //     } else {
      //       this.$message.error(res.message);
      //     }
      //     this.confirmLoading = false;
      //   }
      // );
    },

    /**
     * {
	"pid": 0,  第一级就是0，如果是第二级，就是上一条记录的id
	"text": "内容",
	"tradeId": 工单id
}
     */
    addCommentOut(pid, text) {
      if (!text) {
        this.$message.error("请输入评论内容");
        return;
      }
      this.submitLoading = true;
      // addComment({ pid: pid, text: text, tradeId: "20231108095148621" }).then(
      addComment({ pid: pid, text: text, tradeId: this.record.tradeId })
        .then((res) => {
          if (res.code == 0) {
            // this.commentsData = res.data.records
            this.newcommet = "";
            this.getCommentListOut();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitLoading = false;
        });
    },

    /**
     *
     */
    deleteCommentOut(id) {
      this.confirmLoading = true;
      deleteComment(id)
        .then((res) => {
          if (res.code == 0) {
            // this.commentsData = res.data.records
            this.$message.success("删除成功");
            this.getCommentListOut();
          } else {
            this.$message.error(res.message);
          }
          this.confirmLoading = false;
        })
        .finally(() => {
          this.submitLoading = false;
        });
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

  // 第一级评论样式
  .div-comment-item {
    margin-top: 20px;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    box-shadow: 0px 0px 2px 2px #e6e6e6 inset;
    border-radius: 4px;

    .comment-item-bottom {
      display: flex;
      flex-direction: row;
      // align-items: center;
      padding-right: 30px;
      padding-left: 10px;
      margin-top: 10px;

      .data-head {
        color: white;
        background-color: #1890ff;
        padding: 6px;
        height: 30px;
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
          margin-bottom: 10px;
        }
      }
    }

    // 第二级评论样式
    .div-comment-child {
      // margin-top: 20px;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      // box-shadow: 0px 0px 2px 2px #e6e6e6 inset;
      // border-radius: 4px;

      .comment-child-bottom {
        display: flex;
        flex-direction: row;
        // align-items: center;
        padding-right: 30px;
        padding-left: 10px;
        margin-top: 10px;

        .data-head-child {
          color: white;
          height: 30px;
          background-color: #1890ff;
          padding: 6px;
          border-radius: 15px;
        }

        .data-child-right {
          display: flex;
          margin-left: 10px;
          flex: 1;
          flex-direction: column;

          .child-right-top {
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

          .comment-content-child {
            border-bottom: 1px solid #e6e6e6;
            margin-left: 10px;
            margin-top: 20px;
            padding-bottom: 10px;
          }
          .comment-content-child-last {
            margin-left: 10px;
            margin-top: 20px;
            padding-bottom: 10px;
          }
        }
      }
    }
  }

  .div-add-coment {
    margin-top: 20px;
    display: flex;
    overflow: hidden;
    flex-direction: column;
    box-shadow: 0px 0px 2px 2px #e6e6e6 inset;
    border-radius: 4px;
    .add-coment-bottom {
      display: flex;
      flex-direction: row;
      // align-items: center;
      padding-right: 30px;
      padding-left: 10px;
      margin-top: 10px;
      .add-coment-head {
        color: white;
        height: 30px;
        background-color: #1890ff;
        padding: 6px;
        border-radius: 15px;
      }

      .add-coment-right {
        display: flex;
        margin-left: 10px;
        flex: 1;
        flex-direction: column;

        .div-comment-handle {
          padding: 8px;
          display: flex;
          flex-direction: row;
          align-items: center;
        }
      }
    }
  }
}
</style>
