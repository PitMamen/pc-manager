(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-79db58d7","chunk-106e384c","chunk-653e5141"],{"0098":function(t,a,s){"use strict";s("593c")},1183:function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("a-modal",{attrs:{title:"",width:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:null},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[s("a-spin",{attrs:{spinning:t.confirmLoading}},[s("div",{staticClass:"div-order-detail",attrs:{id:"printContent"}},[s("h2",{staticStyle:{"padding-left":"44%"}},[t._v("处方便笺")]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-top":"6%"}},[s("span",{staticClass:"span-item-name"},[t._v("处方编号 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.preNo)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 开具日期 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.createTime)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 登记号 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.papmiNo)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 诊疗卡号 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.cardNo)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 患者姓名 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.userName)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 患者年龄 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.age)+"岁 ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 患者性别 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.userSex)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 取药地点 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.takeMedicineLocDesc||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name",staticStyle:{width:"13%"}},[t._v(" 主述/现病史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.presentIllness)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 既往史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.pastIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 个人史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.personIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 过敏史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.allergicIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 家族史 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.familyIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 初步诊断 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.diagnosis)+" ")])],1),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 处理意见 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.suggestion)+" ")])],1),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 处方清单 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.preNo)+" ")])],1),s("div",{staticClass:"div-medicine-fang-wrap"},t._l(t.detailData.list,(function(a,e){return s("div",{key:e,staticClass:"div-medicine-fang-item firstItem"},[s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name",staticStyle:{width:"70%"}},[t._v(" "+t._s(a.drugName)+" ")]),s("span",{staticClass:"span-item-value"})]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 数量 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.num)+" ")])]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 规格 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.drugSpec)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 价格 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.price)+" ")])]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 用药方法 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.drugUsemethod)+" ")])]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 单次用量 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.useNum)+" "+t._s(a.useUnit))]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 用药频次 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(a.useFrequency)+" ")])]),a.remark?s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[t._v(" 特殊说明 :")]),s("span",{staticClass:"span-item-value",staticStyle:{width:"80%"}},[t._v(t._s(a.remark))])]):t._e()])})),0),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"60%",width:"15%",color:"brown"}},[t._v(" 总计 : "+t._s(t.total)+"元")])]),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 医生 :")]),s("span",{staticClass:"sign-name",staticStyle:{"margin-left":"1%"}},[t._v(t._s(t.detailData.docName)+" ")])],1)]),s("a-button",{directives:[{name:"print",rawName:"v-print",value:t.printObj,expression:"printObj"}],staticStyle:{"margin-left":"30%","margin-top":"6%"},attrs:{type:"primary"}},[t._v("打印处方")]),s("div",{staticStyle:{height:"25px",color:"white"}})],1)],1)},i=[],n=(s("d3b7"),s("159b"),s("b680"),s("4cab")),l={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,preNo:0,total:0,detailData:{},printObj:{id:"printContent",popTitle:"　"}}},methods:{edit:function(t){this.detailData={},this.total=0,this.visible=!0,this.preNo=t,this.$set(this.detailData,"preNo",t),this.getFangDetail(t)},getFangDetail:function(t){var a=this;this.confirmLoading=!0,Object(n["sb"])({preNo:t}).then((function(t){t.success?(a.detailData=t.data,a.detailData.list.length>0&&(a.detailData.list.forEach((function(t){a.total=a.total+t.num*t.price})),a.total=a.total.toFixed(2))):a.$message.error("请求失败："+t.message)})).finally((function(t){a.confirmLoading=!1}))},getStatusText:function(t){return 1==t?"待支付":2==t?"已完成":3==t?"部分支付":4==t?"待收货":5==t?"订单取消":void 0},handleSubmit:function(){},handleCancel:function(){this.visible=!1}}},c=l,o=(s("4b39"),s("2877")),m=Object(o["a"])(c,e,i,!1,null,null,null);a["default"]=m.exports},2808:function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("a-modal",{attrs:{title:t.record.message2,width:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:null},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[s("a-spin",{attrs:{spinning:t.confirmLoading}},["CustomAnalyseMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("病情描述：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.content)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 处置建议：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.msgDetailId)+" ")])])]):"CustomAppointmentTimeMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 工单号：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.tradeId)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("预约时间：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.time)+" ")])])]):"CustomDoctorReceptionMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 工单号：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.tradeId)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 医生：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 科室：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docdeptName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 患者：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.toAccountName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("开始时间：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.time)+" ")])])]):"CustomDoctorRefuseMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 工单号：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.tradeId)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 医生：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 科室：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docdeptName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 患者：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.toAccountName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("拒诊原因：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.reason)+" ")])])]):"CustomIllnessMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("病情描述：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.content)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 预约时间：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.time)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("上传图片：")]),t._l(t.messageContent.imageList.split(","),(function(t,a){return s("img",{key:a,staticStyle:{width:"auto",height:"70px"},attrs:{value:t.code,src:t}})}))],2)]):"FengshikeIllnessMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题1：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.question1||"无")+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题2：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.question2||"无")+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题3：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.question3||"无")+" ")])])]):"Fengshike2IllnessMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题1："+t._s(t.content.data.question1||"无"))]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.answer1||"无")+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题2："+t._s(t.content.data.question2||"无"))]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.answer2||"无")+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("患者问题3："+t._s(t.content.data.question3||"无"))]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.content.data.answer3||"无")+" ")])])]):"CustomDoctorChuFangMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 开方医生：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.docName)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v("初步诊断：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.diagnosis)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 处理意见：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.suggestion)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 开方时间：")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.messageContent.time)+" ")])]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("span",{staticClass:"span-item-name",staticStyle:{"font-weight":"bold"}},[t._v(" 处方详情：")]),s("a",{staticClass:"span-item-value",on:{click:function(a){return t.$refs.fangDetail.edit(t.messageContent.preNo)}}},[t._v("查看")])])]):"CustomArticleMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("a",{staticClass:"span-item-value",on:{click:function(a){return t.goCheckArticle()}}},[t._v("《"+t._s(t.messageContent.content)+"》")])])]):"CustomWenJuanMessage"===t.messageContent.type?s("div",[s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-bottom":"20px"}},[s("a",{staticClass:"span-item-value",on:{click:function(a){return t.goCheckQestion()}}},[t._v("《"+t._s(t.messageContent.name)+"》")])])]):s("div",[s("div",{staticClass:"div-order-detail"},[t._v(t._s(t.record.message))]),s("div",{staticClass:"div-order-detail"},[s("div",{staticStyle:{color:"red","margin-top":"30px"}},[t._v("(注：自定义消息内容为原始数据，暂未解析。)")])])])]),s("fang-detail",{ref:"fangDetail",on:{ok:t.handleOk}})],1)},i=[],n=(s("ac1f"),s("5319"),s("4cab"),s("1183")),l={components:{fangDetail:n["default"]},data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,record:{},messageContent:{type:""}}},methods:{add:function(t){this.record={},this.record=t,this.visible=!0,this.messageContent=JSON.parse(JSON.parse(t.message).data)},goCheckArticle:function(){this.messageContent.articleId=this.messageContent.id,this.$router.push({name:"article_teach_check",query:{recordStr:JSON.stringify(this.messageContent)}})},goCheckQestion:function(){var t=this.messageContent.url;t=t.replace("/r/","/s/"),window.open(t,"_blank")},handleSubmit:function(){this.visible=!1},handleCancel:function(){this.visible=!1}}},c=l,o=(s("6d8e"),s("2877")),m=Object(o["a"])(c,e,i,!1,null,null,null);a["default"]=m.exports},"4b39":function(t,a,s){"use strict";s("704b")},"4d42":function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("a-modal",{attrs:{title:"聊天记录",width:1200,visible:t.visible,confirmLoading:t.confirmLoading,footer:null},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[e("a-spin",{attrs:{spinning:t.confirmLoading}},[e("div",{staticClass:"div-order-detail"},[e("s-table",{ref:"tableInside",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.tradeId}},scopedSlots:t._u([{key:"action",fn:function(a,s){return e("span",{},[e("a",{attrs:{disabled:!s.canAsk},on:{click:function(a){return t.$refs.addForm.add(s)}}},[t._v(t._s(s.btnText))]),e("a",{on:{click:function(a){return t.$refs.recordForm.add(s)}}},[t._v("聊天记录")])])}},{key:"imgArea",fn:function(a,i){return e("span",{},["TIMImageElem"===i.msgType?e("img",{staticStyle:{width:"auto",height:"40px"},attrs:{src:i.message},on:{click:function(a){return t.clickMessage(i.message)}}}):t._e(),"TIMSoundElem"===i.msgType?e("img",{staticStyle:{width:"auto",height:"40px"},attrs:{src:s("84dd")},on:{click:function(a){return t.clickMessage(i.message)}}}):t._e(),"TIMVideoFileElem"===i.msgType?e("img",{staticStyle:{width:"auto",height:"40px"},attrs:{src:s("ebfa")},on:{click:function(a){return t.clickMessage(i.message)}}}):t._e(),"TIMTextElem"===i.msgType?e("span",[t._v(t._s(i.message))]):t._e(),"TIMCustomElem"===i.msgType?e("a",{on:{click:function(a){return t.$refs.customForm.add(i)}}},[t._v(t._s(i.message2)+" ")]):t._e()])}}])}),e("custom-form",{ref:"customForm",on:{ok:t.handleOk}})],1)])],1)},i=[],n=(s("d3b7"),s("2af9")),l=s("4cab"),c=s("9fb0"),o=s("2b0e"),m=s("4151"),p=s("2808"),r={components:{STable:n["s"],Video:m["default"],customForm:p["default"]},data:function(){var t=this;return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,roleName:"",colName1:"",colName2:"",form:this.$form.createForm(this),record:{},queryParams:{fromAccount:"",toAccount:""},columns:[{title:"消息时间",dataIndex:"msgTime",width:"150px"},{title:"发送方",dataIndex:"fromAccountNmae",width:"150px"},{title:"接收方",dataIndex:"toAccountName",width:"150px"},{title:"消息类型",dataIndex:"msgType2",width:"150px"},{title:"消息内容",scopedSlots:{customRender:"imgArea"}}],loadData:function(a){return Object(l["Jc"])(Object.assign(a,t.queryParams)).then((function(a){for(var s=0;s<a.data.rows.length;s++){var e=new Date(Date.parse(a.data.rows[s].msgTime)),i=e.getHours(),n=e.getMinutes();if(i=i<10?"0"+i:i,n=n<10?"0"+n:n,a.data.rows[s].msgTime=a.data.rows[s].msgTime.substring(0,10)+" "+i+":"+n,"TIMCustomElem"===a.data.rows[s].msgType){a.data.rows[s].msgType2="自定义消息";var l=JSON.parse(a.data.rows[s].message);a.data.rows[s].message2=l.desc}else"TIMTextElem"===a.data.rows[s].msgType?a.data.rows[s].msgType2="文本":"TIMImageElem"===a.data.rows[s].msgType?a.data.rows[s].msgType2="图片":"TIMVideoFileElem"===a.data.rows[s].msgType?a.data.rows[s].msgType2="视频":"TIMSoundElem"===a.data.rows[s].msgType&&(a.data.rows[s].msgType2="语音");a.data.rows[s].fromAccount===t.record.userId?(a.data.rows[s].fromAccountNmae=t.record.userName,a.data.rows[s].toAccountName=t.record.execName):(a.data.rows[s].fromAccountNmae=t.record.execName,a.data.rows[s].toAccountName=t.record.userName)}return a.data}))}}},created:function(){var t=o["a"].ls.get(c["p"]);this.roleName=t.roleName},methods:{add:function(t){this.record={},this.record=t,this.visible=!0,this.queryParams.fromAccount=t.userId,this.queryParams.toAccount=t.execUser,this.$refs.tableInside.refresh()},clickMessage:function(t){window.open(t,"_blank")},clickCustomMessage:function(t){},queryHistoryIM:function(){Object(l["Jc"])(this.parameter).then((function(t){}))},handleOk:function(){this.$refs.tableInside.refresh()},handleSubmit:function(){var t=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,s){a?t.confirmLoading=!1:Object(l["qd"])(s).then((function(a){a.success?(t.$message.success("新增成功"),t.visible=!1,t.confirmLoading=!1,t.$emit("ok",s),t.form.resetFields()):t.$message.error("新增失败："+a.message)})).finally((function(a){t.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},d=r,v=(s("0098"),s("2877")),g=Object(v["a"])(d,e,i,!1,null,null,null);a["default"]=g.exports},"593c":function(t,a,s){},"6d8e":function(t,a,s){"use strict";s("c16f")},"704b":function(t,a,s){},"84dd":function(t,a){t.exports="data:image/png;base64,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"},c16f:function(t,a,s){},ebfa:function(t,a,s){t.exports=s.p+"img/msg_sp.4ac71c55.png"}}]);