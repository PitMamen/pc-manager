(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-653e5141"],{1183:function(a,t,s){"use strict";s.r(t);var i=function(){var a=this,t=a.$createElement,s=a._self._c||t;return s("a-modal",{attrs:{title:"",width:900,visible:a.visible,confirmLoading:a.confirmLoading,footer:null},on:{ok:a.handleSubmit,cancel:a.handleCancel}},[s("a-spin",{attrs:{spinning:a.confirmLoading}},[s("div",{staticClass:"div-order-detail",attrs:{id:"printContent"}},[s("h2",{staticStyle:{"padding-left":"44%"}},[a._v("处方便笺")]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-top":"6%"}},[s("span",{staticClass:"span-item-name"},[a._v("处方编号 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.preNo)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 开具日期 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.createTime)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[a._v(" 登记号 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.papmiNo)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 诊疗卡号 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.cardNo)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[a._v(" 患者姓名 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.userName)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 患者年龄 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.age)+"岁 ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[a._v(" 患者性别 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.userSex)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[a._v(" 取药地点 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.takeMedicineLocDesc||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name",staticStyle:{width:"13%"}},[a._v(" 主述/现病史 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.presentIllness)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[a._v(" 既往史 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.pastIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[a._v(" 个人史 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.personIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[a._v(" 过敏史 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.allergicIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[a._v(" 家族史 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.familyIllness||"暂无")+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[a._v(" 初步诊断 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.diagnosis)+" ")])],1),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[a._v(" 处理意见 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.suggestion)+" ")])],1),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[a._v(" 处方清单 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.preNo)+" ")])],1),s("div",{staticClass:"div-medicine-fang-wrap"},a._l(a.detailData.list,(function(t,i){return s("div",{key:i,staticClass:"div-medicine-fang-item firstItem"},[s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name",staticStyle:{width:"70%"}},[a._v(" "+a._s(t.drugName)+" ")]),s("span",{staticClass:"span-item-value"})]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[a._v(" 数量 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(t.num)+" ")])]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[a._v(" 规格 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(t.drugSpec)+" ")]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 价格 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(t.price)+" ")])]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[a._v(" 用药方法 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(t.drugUsemethod)+" ")])]),s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[a._v(" 单次用量 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(t.useNum)+" "+a._s(t.useUnit))]),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 用药频次 :")]),s("span",{staticClass:"span-item-value"},[a._v(a._s(t.useFrequency)+" ")])]),t.remark?s("div",{staticClass:"div-line-medicine"},[s("span",{staticClass:"span-item-name"},[a._v(" 特殊说明 :")]),s("span",{staticClass:"span-item-value",staticStyle:{width:"80%"}},[a._v(a._s(t.remark))])]):a._e()])})),0),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"60%",width:"15%",color:"brown"}},[a._v(" 总计 : "+a._s(a.total)+"元")])]),s("div",{staticClass:"div-line-wrap"},[s("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),s("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[a._v(" 医生 :")]),s("span",{staticClass:"sign-name",staticStyle:{"margin-left":"1%"}},[a._v(a._s(a.detailData.docName)+" ")])],1)]),s("a-button",{directives:[{name:"print",rawName:"v-print",value:a.printObj,expression:"printObj"}],staticStyle:{"margin-left":"30%","margin-top":"6%"},attrs:{type:"primary"}},[a._v("打印处方")]),s("div",{staticStyle:{height:"25px",color:"white"}})],1)],1)},e=[],n=(s("d3b7"),s("159b"),s("b680"),s("4cab")),l={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,preNo:0,total:0,detailData:{},printObj:{id:"printContent",popTitle:"　"}}},methods:{edit:function(a){this.detailData={},this.total=0,this.visible=!0,this.preNo=a,this.$set(this.detailData,"preNo",a),this.getFangDetail(a)},getFangDetail:function(a){var t=this;this.confirmLoading=!0,Object(n["sb"])({preNo:a}).then((function(a){a.success?(t.detailData=a.data,t.detailData.list.length>0&&(t.detailData.list.forEach((function(a){t.total=t.total+a.num*a.price})),t.total=t.total.toFixed(2))):t.$message.error("请求失败："+a.message)})).finally((function(a){t.confirmLoading=!1}))},getStatusText:function(a){return 1==a?"待支付":2==a?"已完成":3==a?"部分支付":4==a?"待收货":5==a?"订单取消":void 0},handleSubmit:function(){},handleCancel:function(){this.visible=!1}}},p=l,c=(s("4b39"),s("2877")),v=Object(c["a"])(p,i,e,!1,null,null,null);t["default"]=v.exports},"4b39":function(a,t,s){"use strict";s("704b")},"704b":function(a,t,s){}}]);