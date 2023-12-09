<template>
  <div class="tab">
    <div class="top">
      <img src="@/assets/ai/robot.png" />
      <div class="welcome">
        <div class="value">尊敬的用户：</div>
        <div class="value">您好！请在左侧输入框里模拟输入门诊病历，我可以基于输入的病历内容自动生成疑似诊断，快来试试吧！</div>
      </div>
    </div>
    <div class="bottom">
      <div class="head">
        <div class="title">门诊病历</div>
        <div class="btn" @click="clear()">清空内容</div>
      </div>
      <div class="content">
        <div class="row row1">
          <div class="form">
            <div class="name">性别<span class="red">*</span></div>
            <div class="action">
              <a-radio-group v-model="params.sex">
                <a-radio value="男性">男性</a-radio>
                <a-radio value="女性">女性</a-radio>
              </a-radio-group>
            </div>
          </div>
          <div class="form">
            <div class="name">年龄</div>
            <div class="action">
              <a-input
                v-model="params.ageNum"
                placeholder="请输入年龄"
              />
              <a-select
                v-model="params.ageUnit"
                placeholder="请选择"
              >
                <a-select-option value="岁">岁</a-select-option>
                <a-select-option value="月">月</a-select-option>
              </a-select>
            </div>
          </div>
        </div>
        <div class="row row2">
          <div class="form">
            <div class="name">主诉<span class="red">*</span></div>
            <div class="action">
              <a-textarea
                v-model="params.complaint"
                :maxLength="200"
                :autoSize="{minRows: 2,maxRows: 6}"
                placeholder="请输入主诉,限512字符内"
              ></a-textarea>
              <div class="abs-count">{{(params.complaint||'').length}}/512</div>
            </div>
          </div>
        </div>
        <div class="row row2">
          <div class="form">
            <div class="name">现病史</div>
            <div class="action">
              <a-textarea
                v-model="params.presentIllnessHistory"
                :maxLength="200"
                :autoSize="{minRows: 2,maxRows: 6}"
                placeholder="请输入现病史,限512字符内"
              ></a-textarea>
              <div class="abs-count">{{(params.presentIllnessHistory||'').length}}/512</div>
            </div>
          </div>
        </div>
        <div class="row row2">
          <div class="form">
            <div class="name">既往病史</div>
            <div class="action">
              <a-textarea
                v-model="params.pastMedicalHistory"
                :maxLength="200"
                :autoSize="{minRows: 2,maxRows: 6}"
                placeholder="请输入既往病史,限512字符内"
              ></a-textarea>
              <div class="abs-count">{{(params.pastMedicalHistory||'').length}}/512</div>
            </div>
          </div>
        </div>
        <div class="row row2">
          <div class="form">
            <div class="name">体格检查</div>
            <div class="action">
              <a-textarea
                v-model="params.exam"
                :maxLength="200"
                :autoSize="{minRows: 2,maxRows: 6}"
                placeholder="请输入体格检查信息,限1024字符内"
              ></a-textarea>
              <div class="abs-count">{{(params.exam||'').length}}/1024</div>
            </div>
          </div>
        </div>
        <div class="row row3">
          <div class="form">
            <div class="name">诊断</div>
            <div class="action">
              <a-select
                v-model="diagnose"
                mode="tags"
                :tokenSeparators="[',']"
                @change="change"
              >
              </a-select>
              <div class="btn" @click="handleSubmit()">疑似诊断</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        diagnose: [],
        params: {
          type: 4,
          ageUnit: '岁'
        }
      }
    },
    props: {
			conversationId: {
				type: String,
				default: ''
			}
		},
    created() {
    },
    methods: {
      clear() {
        this.params = {
          type: 4,
          ageUnit: '岁'
        };
      },
      change(evt) {},
      handleSubmit() {}
    }
  }
</script>

<style lang="less" scoped>
  .tab {
    .top {
      img {}
      .welcome {
        .value {}
      }
    }
    .bottom {
      .head {
        .title {}
        .btn {}
      }
      .content {
        .row {
          .form {
            .name {
              .red {}
            }
            .action {}
          }
        }
        .row1 {
          .form {
            .name {}
            .action {
              .ant-radio-group {}
              .ant-input {}
              .ant-select {}
            }
          }
        }
        .row2 {
          .form {
            .name {}
            .action {
              .ant-input {}
              .abs-count {}
            }
          }
        }
        .row3 {
          .form {
            .name {}
            .action {
              .ant-select {}
              .btn {}
            }
          }
        }
      }
    }
  }
</style>
