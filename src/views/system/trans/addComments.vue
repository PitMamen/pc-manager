<template>
  <a-spin :spinning="confirmLoading">
    <div class="div-wrap">
      <div class="div-title">
        <div class="div-line-blue"></div>
        <span class="span-title">历史评论</span>
      </div>

      <div
        v-if="commentsData.length > 0"
        class="div-comment-item"
        v-for="(item, index) in commentsData"
        :key="index"
      >
        <div style="height: 20px; background-color: #409eff"></div>
        <div class="comment-item-bottom">
          <div class="data-head">{{ item.userName.substring(0, 2) }}</div>
          <div class="data-item-right">
            <div class="item-right-top">
              <div style="font-size: 14px; font-weight: bold; color: #1a1a1a">
                {{ item.userName }}
              </div>
              <div
                style="
                  margin-left: 10px;
                  font-size: 14px;
                  font-weight: bold;
                  color: #1a1a1a;
                "
              >
                【{{ item.userHospitalName }}】
              </div>
              <div style="margin-left: 10px; color: #999">{{ item.createTime }}</div>

              <div style="flex: 1"></div>
              <div class="btn-div">
                <!-- <div class="btn-no" v-if="item.self != 'yes'"> -->
                <div
                  class="btn-no"
                  v-if="item.self != 'yes'"
                  @click="addAnswer(item, undefined)"
                >
                  <img src="@/assets/icons/huifu.png" style="width: 12px; height: 12px" />
                  <div style="color: #409eff; margin-left: 5px">回复</div>
                </div>
                <div class="btn-no" v-if="item.self == 'yes'" @click="goEdit(item)">
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

            <div v-show="!item.isEdit" class="comment-content">{{ item.text }}</div>
            <!-- <div class="add-coment-right"></div> -->
            <div v-show="item.isEdit" class="edit-area">
              <!-- 动态设置ref 动态设置ref-->
              <!-- :ref="`textarea${item.id}`" -->
              <a-textarea
                :rows="2"
                :ref="'textarea' + item.id"
                v-model="item.text"
                :maxLength="300"
                placeholder="请输入评论"
              ></a-textarea>

              <div class="div-comment-handle">
                <div style="flex: 1"></div>
                <a-button
                  type="primary"
                  :loading="item.submitLoading"
                  @click="editCommentOut(item)"
                  style="margin-right: 20px"
                >
                  保存
                </a-button>
                <a-button @click="editCancel(item)">取消</a-button>
              </div>
            </div>
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
            <div class="data-head-child">{{ child.userName.substring(0, 2) }}</div>
            <div class="data-child-right" v-show="!child.isNewAnswer">
              <div class="child-right-top">
                <div style="font-size: 14px; font-weight: bold; color: #1a1a1a">
                  {{ child.userName }}
                </div>
                <div style="margin-left: 10px; font-weight: bold; color: #1a1a1a">
                  【{{ child.userHospitalName }}】
                </div>
                <div style="margin-left: 10px; color: #999">{{ child.createTime }}</div>

                <div style="flex: 1"></div>
                <div class="btn-div">
                  <div
                    class="btn-no"
                    v-if="child.self != 'yes'"
                    @click="addAnswer(item, child)"
                  >
                    <img
                      src="@/assets/icons/huifu.png"
                      style="width: 12px; height: 12px"
                    />
                    <div style="color: #409eff; margin-left: 5px">回复</div>
                  </div>

                  <div class="btn-no" v-if="child.self == 'yes'" @click="goEdit(child)">
                    <a-icon type="edit" style="color: #409eff; margin-left: 20px" />
                    <div style="color: #409eff; margin-left: 5px">编辑</div>
                  </div>

                  <a-popconfirm
                    placement="topRight"
                    title="确认删除吗？"
                    @confirm="() => deleteCommentOut(child.id)"
                  >
                    <div class="btn-no" v-if="child.self == 'yes'">
                      <a-icon type="delete" style="color: #409eff; margin-left: 20px" />
                      <div style="color: #409eff; margin-left: 5px">删除</div>
                    </div>
                  </a-popconfirm>

                  <!-- <div class="btn-no" v-if="child.self == 'yes'">
                    <a-icon type="delete" style="color: #409eff; margin-left: 20px" />
                    <div style="color: #409eff; margin-left: 5px">删除</div>
                  </div> -->
                </div>
              </div>

              <div v-show="!child.isEdit" class="content-show-area">
                <div class="at-area" v-show="child.atName">@{{ child.atName }}</div>
                <div
                  :class="
                    indexChild == item.listChild.length - 1
                      ? 'comment-content-child-last'
                      : 'comment-content-child'
                  "
                >
                  {{ child.text }}
                </div>
              </div>

              <div v-show="child.isEdit" class="edit-area-child">
                <!-- 动态设置ref 动态设置ref-->
                <!-- :ref="`textarea${item.id}`" -->
                <a-textarea
                  :rows="2"
                  :ref="'textarea' + child.id"
                  v-model="child.text"
                  :maxLength="300"
                  placeholder="请输入评论"
                ></a-textarea>

                <div class="div-comment-handle">
                  <div style="flex: 1"></div>
                  <a-button
                    type="primary"
                    :loading="child.submitLoading"
                    @click="editCommentOut(child)"
                    style="margin-right: 20px"
                  >
                    保存
                  </a-button>
                  <a-button @click="editCancel(child)">取消</a-button>
                </div>
              </div>
            </div>

            <div class="add-answer-right" v-show="child.isNewAnswer">
              <a-textarea
                :rows="2"
                v-model="newAnswer"
                :maxLength="300"
                placeholder="请输入评论"
              ></a-textarea>

              <div class="div-answer-handle">
                <div style="flex: 1"></div>
                <a-button
                  type="primary"
                  :loading="submitLoadingAnswer"
                  @click="addCommentAnswer(item, child)"
                  style="margin-right: 20px"
                >
                  保存
                </a-button>
                <a-button @click="cancelAnswer(item, indexChild)">取消</a-button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="div-add-coment">
        <div style="height: 20px; background-color: #409eff"></div>
        <div class="add-coment-bottom">
          <div class="add-coment-head">{{ user.userName.substring(0, 2) }}</div>
          <div class="add-coment-right">
            <a-textarea
              :rows="2"
              v-model="newcommet"
              :maxLength="300"
              placeholder="请输入评论"
            ></a-textarea>

            <div class="div-comment-handle">
              <div style="flex: 1"></div>
              <a-button
                type="primary"
                :loading="submitLoading"
                @click="addCommentOut(0, newcommet, undefined)"
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
      newcommet: "",
      newAnswer: "",
      confirmLoading: false,
      //新增提交用
      submitLoading: false,
      //回复提交用  item.submitLoading修改用
      submitLoadingAnswer: false,
      record: {},
      commentsData: [],
      // commentsData: [
      //   {
      //     id: 12,
      //     userId: 1,
      //     userName: "管理员",
      //     userHospitalCode: "444885559",
      //     userHospitalName: "中南大学湘雅二医院",
      //     createTime: 1700557618000,
      //     text: "5555555",
      //     tradeId: 20231108095148621,
      //     atName: "",
      //     listChild: [],
      //     self: "yes",
      //     pid: 0,
      //   },
      //   {
      //     id: 11,
      //     userId: 1,
      //     userName: "管理员",
      //     userHospitalCode: "444885559",
      //     userHospitalName: "中南大学湘雅二医院",
      //     createTime: 1700557612000,
      //     text: "4444",
      //     tradeId: 20231108095148621,
      //     atName: "",
      //     listChild: [
      //       {
      //         id: 14,
      //         userId: 1,
      //         userName: "管理员",
      //         userHospitalCode: "444885559",
      //         userHospitalName: "中南大学湘雅二医院",
      //         createTime: 1700557888000,
      //         text: "66666_66",
      //         tradeId: 20231108095148621,
      //         atName: "管理员",
      //         listChild: null,
      //         self: null,
      //         pid: 11,
      //       },
      //       {
      //         id: 15,
      //         userId: 1,
      //         userName: "管理员",
      //         userHospitalCode: "444885559",
      //         userHospitalName: "中南大学湘雅二医院",
      //         createTime: 1700557920000,
      //         text: "66666_6677",
      //         tradeId: 20231108095148621,
      //         atName: "管理员",
      //         listChild: null,
      //         self: null,
      //         pid: 11,
      //       },
      //     ],
      //     self: "yes",
      //     pid: 0,
      //   },
      // ],

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
      getCommentList(param)
        .then((res) => {
          if (res.code === 0) {
            if (res.data && res.data.records) {
              this.commentsData = res.data.records;

              for (let index = 0; index < this.commentsData.length; index++) {
                this.$set(this.commentsData[index], "isEdit", false);
                this.$set(this.commentsData[index], "submitLoading", false);
                this.commentsData[index].listChild.forEach((element) => {
                  this.$set(element, "isEdit", false);
                  this.$set(element, "submitLoading", false);
                  this.$set(element, "isNewAnswer", false);
                });
              }
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
    },

    goEdit(item) {
      item.isEdit = true;
      this.$set(item, "oldText", item.text);
      // <!-- 动态设置ref 动态设置ref-->
      this.$refs[`textarea${item.id}`][0].focus();
      console.log("goEdit item", item);
      console.log("goEdit this.$refs", this.$refs[`textarea${item.id}`][0]);
    },

    /**
     * {
	"pid": 0,  第一级就是0，如果是第二级，就是上一条记录的id
	"text": "内容",
	"tradeId": 工单id
}
     */
    addCommentOut(pid, text, atName) {
      if (!text) {
        this.$message.error("请输入评论内容");
        return;
      }
      if (atName) {
        this.submitLoadingAnswer = true;
      } else {
        this.submitLoading = true;
      }
      let param;
      if (atName) {
        param = { pid: pid, text: text, tradeId: this.record.tradeId, atName: atName };
      } else {
        param = { pid: pid, text: text, tradeId: this.record.tradeId };
      }
      // addComment({ pid: pid, text: text, tradeId: "20231108095148621" }).then(
      addComment(param)
        .then((res) => {
          if (res.code == 0) {
            // this.commentsData = res.data.records
            if (atName) {
              this.newAnswer = "";
            } else {
              this.newcommet = "";
            }
            this.getCommentListOut();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          if (atName) {
            this.newAnswer = "";
          } else {
            this.newcommet = "";
          }
          if (atName) {
            this.submitLoadingAnswer = false;
          } else {
            this.submitLoading = false;
          }
        });
    },

    /**
     * 添加回复是在父级 item 的 listChild 里面加一个表示回复的空对象
     *
     * child 为 undefined ,则新增的回复atName为item的userName;child 不为 undefined ,则新增的回复atName为child的userName
     */
    addAnswer(item, child) {
      //先清空已打开的回复
      for (let index = 0; index < this.commentsData.length; index++) {
        this.commentsData[index].listChild.forEach((element, num) => {
          if (element.isNewAnswer) {
            this.commentsData[index].listChild.splice(num, 1);
          }
        });
      }

      item.listChild.push({
        text: "",
        isNewAnswer: true,
        pid: item.id,
        userName: this.user.userName,
        atName: child ? child.userName : item.userName,
      });
    },

    /**
     * 添加回复是在父级 item 的 listChild 里面加一个表示回复的空对象
     */
    addCommentAnswer(item, child) {
      if (!this.newAnswer) {
        this.$message.error("请输入回复内容");
        return;
      }
      this.addCommentOut(item.id, this.newAnswer, child.atName);
      // this.addCommentOut(item.id, this.newAnswer, child.userName);
    },

    /**
     *
     */
    cancelAnswer(item, indexChild) {
      item.listChild.splice(indexChild, 1);
      this.newAnswer = "";
    },

    editCommentOut(item) {
      if (!item.text) {
        this.$message.error("请输入评论内容");
        return;
      }
      item.submitLoading = true;
      // addComment({ pid: pid, text: text, tradeId: "20231108095148621" }).then(
      modifyComment({ id: item.id, text: item.text })
        .then((res) => {
          if (res.code == 0) {
            // this.commentsData = res.data.records
            // this.newcommet = "";
            // this.getCommentListOut();

            this.$message.success("修改成功");
          } else {
            item.text = item.oldText;
            // this.$message.error(res.message);
          }
        })
        .finally(() => {
          item.submitLoading = false;
          item.isEdit = false;
        });
    },

    editCancel(item) {
      console.log("editCancel", item);
      item.text = item.oldText;
      item.isEdit = false;
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
          // this.confirmLoading = false;
        })
        .finally(() => {
          // this.submitLoading = false;
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
          color: #1a1a1a;
          margin-top: 15px;
          margin-bottom: 10px;
        }

        .edit-area {
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

          .content-show-area {
            display: flex;
            flex-direction: row;

            .at-area {
              color: white;
              background-color: #1890ff;
              height: 25px;
              margin-top: 10px;
              text-align: center;
              padding: 3px 10px;
              border-radius: 10px;
            }
          }

          .edit-area-child {
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

          .comment-content-child {
            border-bottom: 1px solid #e6e6e6;
            margin-left: 10px;
            color: #1a1a1a;
            flex: 1;
            margin-top: 15px;
            padding-bottom: 10px;
          }
          .comment-content-child-last {
            margin-left: 10px;
            color: #1a1a1a;
            flex: 1;
            margin-top: 15px;
            padding-bottom: 10px;
          }
        }

        .add-answer-right {
          display: flex;
          margin-left: 10px;
          flex: 1;
          flex-direction: column;
          .div-answer-handle {
            padding: 8px;
            display: flex;
            flex-direction: row;
            align-items: center;
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
