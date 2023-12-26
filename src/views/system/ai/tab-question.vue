<template>
  <div class="tab">
    <div class="head">
      <div class="title">
        <img src="@/assets/ai/robot.png" />
        <div class="hello">您好，我是您的智能助手小雅</div>
      </div>
      <div class="desc">
        作为一个医疗人工智能模型，我已经学习了海量医疗知识，我可以回答您各种场景的问，您可以试着问我：
      </div>
    </div>
    <div class="content">
      <div class="row">
        <div class="card" @click="cardClick('药品查询：阿莫西林')">
          <div class="value">药品查询：阿莫西林</div>
        </div>
        <div class="card" @click="cardClick('知识问答：血常规')">
          <div class="value">知识问答：血常规</div>
        </div>
      </div>
      <div class="row">
        <div class="card" @click="cardClick('疑似诊断：胸痛持续6小时')">
          <div class="value">疑似诊断：胸痛持续6小时</div>
        </div>
        <div class="card" @click="cardClick('药品查询：阿莫西林胶囊')">
          <div class="value">药品查询：阿莫西林胶囊</div>
        </div>
      </div>
      <div class="row">
        <div class="card" @click="cardClick('写摘要：糖尿病，肾病，高血压')">
          <div class="value">写摘要：糖尿病，肾病，高血压</div>
        </div>
        <div class="card" @click="cardClick('生成医嘱：高血压')">
          <div class="value">生成医嘱：高血压</div>
        </div>
      </div>
      <div class="row">
        <div class="card" @click="cardClick('相关指南：糖尿病患者合并心血管疾病诊治专家共识')">
          <div class="value">相关指南：糖尿病患者合并心血管疾病诊治专家共识</div>
        </div>
        <div class="card" @click="cardClick('生成医嘱：急性肺炎')">
          <div class="value">生成医嘱：急性肺炎</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {},
  methods: {
    cardClick(msg) {
      window.frames.aiChat.postMessage(
        {
          type: 'iframe-question-send',
          msg,
        },
        '*'
      )
    },
  },
}
</script>

<style lang="less" scoped>
.tab {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px;
  width: 720px;
  background: #ffffff;
  border-radius: 4px;
  .head {
    .title {
      display: flex;
      align-items: center;
      img {
        margin-right: 10px;
        width: 40px;
        height: 40px;
      }
      .hello {
        font-size: 14px;
        font-weight: 600;
        line-height: 1.5;
        color: #1a1a1a;
      }
    }
    .desc {
      font-size: 12px;
      font-weight: 400;
      line-height: 32px;
      color: #1a1a1a;
    }
  }
  .content {
    padding: 20px 0 30px 0;
    .row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 0 30px;
      .card {
        display: flex;
        align-items: center;
        padding: 0 10px;
        width: 278px;
        height: 48px;
        cursor: pointer;
        background: #d5e9ff;
        border-radius: 4px;
        .value {
          font-size: 12px;
          font-weight: 400;
          line-height: 22px;
          color: #1a1a1a;
        }
      }
    }
  }
}
</style>
