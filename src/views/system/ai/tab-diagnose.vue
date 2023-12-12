<template>
  <div class="tab">
    <div class="top">
      <img src="@/assets/ai/robot.png" />
      <div class="welcome">
        <div class="value">尊敬的用户：</div>
        <div class="value">
          您好！请在左侧输入框里模拟输入门诊病历，我可以基于输入的病历内容自动生成疑似诊断，快来试试吧！
        </div>
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
            <div class="name"><span class="red">*</span>性别</div>
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
              <a-input v-model="params.ageNum" :maxLength="3" placeholder="请输入年龄" />
              <a-select v-model="params.ageUnit" placeholder="请选择">
                <a-select-option value="岁">岁</a-select-option>
                <a-select-option value="月">月</a-select-option>
              </a-select>
            </div>
          </div>
        </div>
        <div class="row row2">
          <div class="form">
            <div class="name"><span class="red">*</span>主诉</div>
            <div class="action">
              <a-textarea v-model="params.complaint" :maxLength="512" placeholder="请输入主诉,限512字符内"></a-textarea>
              <div class="abs-count">{{ (params.complaint || '').length }}/512</div>
            </div>
          </div>
        </div>
        <div class="row row2">
          <div class="form">
            <div class="name">现病史</div>
            <div class="action">
              <a-textarea
                v-model="params.presentIllnessHistory"
                :maxLength="512"
                placeholder="请输入现病史,限512字符内"
              ></a-textarea>
              <div class="abs-count">{{ (params.presentIllnessHistory || '').length }}/512</div>
            </div>
          </div>
        </div>
        <div class="row row2">
          <div class="form">
            <div class="name">既往病史</div>
            <div class="action">
              <a-textarea
                v-model="params.pastMedicalHistory"
                :maxLength="512"
                placeholder="请输入既往病史,限512字符内"
              ></a-textarea>
              <div class="abs-count">{{ (params.pastMedicalHistory || '').length }}/512</div>
            </div>
          </div>
        </div>
        <div class="row row2">
          <div class="form">
            <div class="name">体格检查</div>
            <div class="action">
              <a-textarea
                v-model="params.exam"
                :maxLength="1024"
                placeholder="请输入体格检查信息,限1024字符内"
              ></a-textarea>
              <div class="abs-count">{{ (params.exam || '').length }}/1024</div>
            </div>
          </div>
        </div>
        <div class="row row3">
          <div class="form">
            <div class="name">诊断</div>
            <div class="action">
              <a-select
                v-model="diseases"
                mode="tags"
                :maxTagCount="3"
                :maxTagTextLength="6"
                :tokenSeparators="[',']"
                @change="change"
              >
                <a-select-option v-for="item in list" :key="item.icd10Code" :value="item.name">{{
                  item.name
                }}</a-select-option>
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
import { genDiagnosis, queryDiagnose } from '@/api/modular/system/posManage'

export default {
  data() {
    return {
      imported: true,
      flag: false,
      list: [],
      diseases: [],
      params: {
        type: 4,
        sex: '男性',
        ageUnit: '岁',
      },
    }
  },
  props: {
    conversationId: {
      type: String,
      default: '',
    },
  },
  created() {
    this.getList()
    window.addEventListener('message', this.diseasesHandler)
  },
  methods: {
    getList() {
      queryDiagnose({
        queryText: '',
      }).then((res) => {
        if (res.code == 0) {
          this.list = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    clear() {
      this.params = {
        type: 4,
        sex: '男性',
        ageUnit: '岁',
      }
      this.diseases = []
    },
    change(value) {
      this.diseasesChange(value)
    },
    diseasesChange(value) {
      window.frames.aiChat.postMessage(
        JSON.stringify({
          type: 'iframe-diseases-change',
          diseases: value,
        }),
        '*'
      )
    },
    diseasesHandler(evt) {
      if (evt.data) {
        const data = JSON.parse(evt.data)
        if (data.type === 'parent-diseases-gene') {
          this.imported = true
          this.diseases = data.diseases
          this.diseasesChange(data.diseases)
        }
      }
    },
    handleSubmit() {
      if (this.params.ageNum && !/^[1-9]\d*$/.test(this.params.ageNum)) {
        this.$message.error('请输入正确的年龄')
        return
      }
      if (this.params.ageNum && parseInt(this.params.ageNum) > 140) {
        this.$message.error('年龄不能大于140')
        return
      }
      if (!this.params.complaint) {
        this.$message.error('请输入主诉')
        return
      }
      if (!this.imported) {
        this.$message.error('诊断正在生成，请稍后')
        return
      }
      const params_ = {
        conversationId: this.conversationId,
        sex: this.params.sex,
        exam: this.params.exam,
        type: this.params.type,
        complaint: this.params.complaint,
        pastMedicalHistory: this.params.pastMedicalHistory,
        presentIllnessHistory: this.params.presentIllnessHistory,
      }
      if (this.params.ageNum) {
        params_.age = this.params.ageNum + this.params.ageUnit
      }
      if (this.flag) {
        return
      }
      this.flag = true
      genDiagnosis(params_)
        .then((res) => {
          if (res.code == 0) {
            this.imported = false
            this.$message.success('诊断生成中...')
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.flag = false
        })
    },
  },
}
</script>

<style lang="less" scoped>
.tab {
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  .top {
    display: flex;
    align-items: center;
    flex-direction: column;
    img {
      position: relative;
      left: -2px;
      margin-bottom: 10px;
      width: 58px;
      height: 58px;
    }
    .welcome {
      position: relative;
      margin-bottom: 20px;
      padding: 20px 20px;
      width: 720px;
      background: #ffffff;
      border-radius: 4px;
      &::before {
        position: absolute;
        top: -2px;
        left: 50%;
        content: '';
        width: 15px;
        height: 15px;
        transform: rotate(45deg) translateX(-50%);
        background: #ffffff;
      }
      .value {
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
        color: #1a1a1a;
      }
    }
  }
  .bottom {
    width: 720px;
    background: #ffffff;
    border-radius: 4px;
    .head {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      height: 52px;
      border-bottom: 1px solid #e6e6e6;
      .title {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.5;
        color: #1a1a1a;
      }
      .btn {
        position: absolute;
        top: 50%;
        right: 42px;
        transform: translateY(-50%);
        width: 68px;
        font-size: 12px;
        font-weight: 400;
        line-height: 28px;
        text-align: center;
        color: #409eff;
        cursor: pointer;
        border: 1px solid #409eff;
        border-radius: 2px;
      }
    }
    .content {
      padding: 10px 42px 10px 0;
      .row {
        margin-bottom: 10px;
        .form {
          display: flex;
          .name {
            width: 72px;
            font-size: 12px;
            font-weight: 400;
            line-height: 22px;
            text-align: right;
            color: #1a1a1a;
            .red {
              color: #f5222d;
            }
          }
          .action {
            margin-left: 10px;
          }
        }
      }
      .row1 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .form {
          align-items: center;
          .action {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .ant-radio-group {
              /deep/ .ant-radio-wrapper {
                font-size: 12px;
              }
            }
            .ant-input {
              width: 82px;
            }
            .ant-select {
              position: relative;
              top: 1px;
              margin-left: 5px;
              width: 52px;
            }
          }
        }
      }
      .row2 {
        .form {
          align-items: flex-start;
          .name {
            position: relative;
            top: -4px;
          }
          .action {
            position: relative;
            flex: 1;
            .ant-input {
              width: 100%;
              height: 62px !important;
              overflow-y: auto;
            }
            .abs-count {
              display: none;
              position: absolute;
              right: 18px;
              bottom: 2px;
              font-size: 12px;
              font-weight: 400;
              line-height: 20px;
              color: #999999;
            }
          }
        }
      }
      .row3 {
        .form {
          align-items: center;
          .action {
            display: flex;
            align-items: center;
            flex: 1;
            .ant-select {
              width: 500px;
              /deep/ .ant-select-selection--multiple {
                height: 32px !important;
              }
              /deep/ .ant-select-selection__rendered {
                height: 32px;
                white-space: nowrap;
                overflow-x: hidden;
              }
            }
            .btn {
              margin-left: 10px;
              width: 86px;
              font-size: 12px;
              font-weight: 400;
              line-height: 32px;
              text-align: center;
              color: #ffffff;
              cursor: pointer;
              background: #409eff;
              border-radius: 2px;
            }
          }
        }
      }
    }
  }
}
</style>
