(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-106e384c","chunk-653e5141"],{1183:function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("a-modal",{attrs:{title:"",width:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:null},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[s("a-spin",{attrs:{spinning:t.confirmLoading}},[s("div",{staticClass:"div-order-detail",attrs:{id:"printContent"}},[s("h2",{staticStyle:{"padding-left":"44%"}},[t._v("处方便笺")]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-top":"6%"}},[s("span",{staticClass:"span-item-name"},[t._v("处方编号 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.preNo)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 开具日期 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.createTime)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 登记号 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.papmiNo)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 诊疗卡号 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.cardNo)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 患者姓名 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.userName)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 患者年龄 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.age)+"岁 ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 患者性别 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.userSex)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 取药地点 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.takeMedicineLocDesc||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name",staticStyle:{width:"13%"}},[t._v(" 主述/现病史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.presentIllness)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 既往史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.pastIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 个人史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.personIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 过敏史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.allergicIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 家族史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.familyIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 初步诊断 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.diagnosis)+" ")])],1),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 处理意见 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.suggestion)+" ")])],1),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 处方清单 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.preNo)+" ")])],1),s("div",{staticClass:"div-medicine-fang-wrap"},t._l(t.detailData.list,(function(a,e){return s("div",{key:e,staticClass:"div-medicine-fang-item firstItem"},[s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name",staticStyle:{width:"70%"}},[t._v(" "+t._s(a.drugName)+" ")]),s("span",{staticClass:"span-item-value"})]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 数量 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.num)+" ")])]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 规格 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.drugSpec)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 价格 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.price)+" ")])]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 用药方法 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.drugUsemethod)+" ")])]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 单次用量 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.useNum)+" "+t._s(a.useUnit))]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 用药频次 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.useFrequency)+" ")])]),a.remark?s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 特殊说明 :")]),s("span",{staticClass:"span-item-value",staticStyle:{width:"80%"}},[t._v(t._s(a.remark))])]):t._e()])})),0),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"60%",width:"15%",color:"brown"}},[t._v(" 总计 : "+t._s(t.total)+"元")])]),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 医生 :")]),s("span",{staticClass:"sign-name",staticStyle:{"margin-left":"1%"}},[t._v(t._s(t.detailData.docName)+" ")])],1)]),s("a-button",{directives:[{name:"print",rawName:"v-print",value:t.printObj,expression:"printObj"}],staticStyle:{"margin-left":"30%","margin-top":"6%"},attrs:{type:"primary"}},[t._v("打印处方")]),s("div",{staticStyle:{height:"25px",color:"white"}})],1)],1)},i=[],n=(s("d3b7"),s("159b"),s("b680"),s("4cab")),l={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,preNo:0,total:0,detailData:{},printObj:{id:"printContent",popTitle:"　"}}},methods:{edit:function(t){this.detailData={},this.total=0,this.visible=!0,this.preNo=t,this.$set(this.detailData,"preNo",t),this.getFangDetail(t)},getFangDetail:function(t){var a=this;this.confirmLoading=!0,Object(n["qb"])({preNo:t}).then((function(t){t.success?(a.detailData=t.data,a.detailData.list.length>0&&(a.detailData.list.forEach((function(t){a.total=a.total+t.num*t.price})),a.total=a.total.toFixed(2))):a.$message.error("请求失败："+t.message)})).finally((function(t){a.confirmLoading=!1}))},getStatusText:function(t){return 1==t?"待支付":2==t?"已完成":3==t?"部分支付":4==t?"待收货":5==t?"订单取消":void 0},handleSubmit:function(){},handleCancel:function(){this.visible=!1}}},c=l,p=(s("4b39"),s("2877")),o=Object(p["a"])(c,e,i,!1,null,null,null);a["default"]=o.exports},2808:function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("a-modal",{attrs:{title:t.record.message2,width:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:null},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[s("a-spin",{attrs:{spinning:t.confirmLoading}},["CustomAnalyseMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("病情描述：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.content)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 处置建议：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.msgDetailId)+" ")])])]):"CustomAppointmentTimeMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 工单号：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.tradeId)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("预约时间：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.time)+" ")])])]):"CustomDoctorReceptionMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 工单号：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.tradeId)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 医生：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 科室：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docdeptName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 患者：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.toAccountName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("开始时间：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.time)+" ")])])]):"CustomDoctorRefuseMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 工单号：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.tradeId)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 医生：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 科室：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docdeptName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 患者：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.toAccountName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("拒诊原因：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.reason)+" ")])])]):"CustomIllnessMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("病情描述：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.content)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 预约时间：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.time)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("上传图片：")]),t._l(t.messageContent.imageList.split(","),(function(t,a){return s("img",{key:a,staticStyle:{width:"auto",height:"70px"},attrs:{value:t.code,src:t}})}))],2)]):"FengshikeIllnessMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题1：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.question1||"无")+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题2：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.question2||"无")+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题3：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.question3||"无")+" ")])])]):"Fengshike2IllnessMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题1："+t._s(t.content.data.question1||"无"))]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.answer1||"无")+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题2："+t._s(t.content.data.question2||"无"))]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.answer2||"无")+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题3："+t._s(t.content.data.question3||"无"))]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.answer3||"无")+" ")])])]):"CustomDoctorChuFangMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 开方医生：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("初步诊断：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.diagnosis)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 处理意见：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.suggestion)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 开方时间：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.time)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 处方详情：")]),s("a",{staticClass:"span-item-value",on:{click:function(a){return t.$refs.fangDetail.edit(t.messageContent.preNo)}}},[t._v("查看")])])]):"CustomArticleMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("a",{staticClass:"span-item-value",on:{click:function(a){return t.goCheckArticle()}}},[t._v("《"+t._s(t.messageContent.content)+"》")])])]):"CustomWenJuanMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("a",{staticClass:"span-item-value",on:{click:function(a){return t.goCheckQestion()}}},[t._v("《"+t._s(t.messageContent.name)+"》")])])]):s("div",[s("div",{staticClass:"div-order-detail"},[t._v(t._s(t.record.message))]),s("div",{staticClass:"div-order-detail"},[s("div",{staticStyle:{color:"red","margin-top":"30px"}},[t._v("(注：自定义消息内容为原始数据，暂未解析。)")])])])]),s("fang-detail",{ref:"fangDetail",on:{ok:t.handleOk}})],1)},i=[],n=(s("ac1f"),s("5319"),s("4cab"),s("1183")),l={components:{fangDetail:n["default"]},data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,record:{},messageContent:{type:""}}},methods:{add:function(t){this.record={},this.record=t,this.visible=!0,this.messageContent=JSON.parse(JSON.parse(t.message).data)},goCheckArticle:function(){this.messageContent.articleId=this.messageContent.id,this.$router.push({name:"article_teach_check",query:{recordStr:JSON.stringify(this.messageContent)}})},goCheckQestion:function(){var t=this.messageContent.url;t=t.replace("/r/","/s/"),window.open(t,"_blank")},handleSubmit:function(){this.visible=!1},handleCancel:function(){this.visible=!1}}},c=l,p=(s("6d8e"),s("2877")),o=Object(p["a"])(c,e,i,!1,null,null,null);a["default"]=o.exports},"4b39":function(t,a,s){"use strict";s("704b")},"6d8e":function(t,a,s){"use strict";s("c16f")},"704b":function(t,a,s){},c16f:function(t,a,s){}}]);