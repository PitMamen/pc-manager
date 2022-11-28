(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-253dfaea","chunk-653e5141"],{"05c7":function(a,t,e){"use strict";e.r(t);var s=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("div",{staticClass:"div-yiji-todo"},[e("a-card",{staticClass:"card-right",attrs:{bordered:!1}},[e("div",{staticClass:"table-page-search-wrapper",staticStyle:{"margin-top":"1%"}},[e("a-form",{attrs:{layout:"inline"}},[e("a-row",{attrs:{gutter:48}},[e("a-col",{attrs:{md:7,sm:24}},[e("a-form-item",{attrs:{label:"患者"}},[e("a-input-search",{attrs:{"allow-clear":"",placeholder:"请输入患者"},on:{keyup:function(t){return!t.type.indexOf("key")&&a._k(t.keyCode,"enter",13,t.key,"Enter")?null:a.$refs.table.refresh(!0)},search:function(t){return a.$refs.table.refresh(!0)}},model:{value:a.queryParams.userName,callback:function(t){a.$set(a.queryParams,"userName",t)},expression:"queryParams.userName"}})],1)],1),e("a-col",{attrs:{md:7,sm:24}},[e("a-form-item",{attrs:{label:"处方编号"}},[e("a-input-search",{attrs:{"allow-clear":"",placeholder:"请输入处方编号"},on:{keyup:function(t){return!t.type.indexOf("key")&&a._k(t.keyCode,"enter",13,t.key,"Enter")?null:a.$refs.table.refresh(!0)},search:function(t){return a.$refs.table.refresh(!0)}},model:{value:a.queryParams.preNo,callback:function(t){a.$set(a.queryParams,"preNo",t)},expression:"queryParams.preNo"}})],1)],1),e("a-col",{attrs:{md:6,sm:24}},[e("a-form-item",{attrs:{label:"处方状态"}},[e("a-select",{attrs:{"allow-clear":"",placeholder:"请选择处方状态"},model:{value:a.queryParams.checkFlag,callback:function(t){a.$set(a.queryParams,"checkFlag",t)},expression:"queryParams.checkFlag"}},a._l(a.statusData,(function(t,s){return e("a-select-option",{key:s,attrs:{value:t.code}},[a._v(a._s(t.value))])})),1)],1)],1)],1),e("a-row",{attrs:{gutter:48}},[e("a-col",{attrs:{md:5,sm:24}},[e("a-form-item",{attrs:{label:"开具时间"}},[e("a-range-picker",{attrs:{value:a.createValue},on:{change:a.onChange}})],1)],1),e("a-col",{attrs:{md:5,sm:24}},[e("a-button",{attrs:{type:"primary"},on:{click:function(t){return a.$refs.table.refresh(!0)}}},[a._v("查询")]),e("a-button",{attrs:{type:"primary"},on:{click:a.resetQuery}},[a._v("重置")])],1)],1)],1)],1),e("s-table",{ref:"table",attrs:{size:"default",columns:a.columns,data:a.loadData,alert:!0,rowKey:function(a){return a.code}},scopedSlots:a._u([{key:"action",fn:function(t,s){return e("span",{},[e("a",{on:{click:function(t){return a.$refs.fangDetail.edit(s.preNo)}}},[a._v("查看")])])}}])}),e("fang-detail",{ref:"fangDetail",on:{ok:a.handleOk}})],1)],1)},i=[],n=(e("4de4"),e("d3b7"),e("b0c0"),e("2af9")),l=e("4cab"),r=e("1183"),c={components:{STable:n["s"],fangDetail:r["default"]},data:function(){var a=this;return{statusData:[{code:-1,value:"全部"},{code:0,value:"审核中"},{code:1,value:"审核通过-未支付"},{code:2,value:"审核通过-已支付"},{code:3,value:"审核未通过"},{code:4,value:"支付中"},{code:5,value:"已取消"}],columns:[{title:"处方编号",dataIndex:"preNo"},{title:"开具日期",dataIndex:"createTime"},{title:"开具医生",dataIndex:"docName"},{title:"患者姓名",dataIndex:"userName"},{title:"处方详情",dataIndex:"suggestDrug",scopedSlots:{customRender:"action"}},{title:"处方状态",width:"300px",dataIndex:"checkFlagName"}],loadData:function(t){var e=JSON.parse(JSON.stringify(Object.assign(t,a.queryParams)));return-1==e.checkFlag&&delete e.checkFlag,Object(l["sc"])(e).then((function(t){for(var e=0;e<t.data.rows.length;e++)0==t.data.rows[e].checkFlag?a.$set(t.data.rows[e],"checkFlagName","审核中"):1==t.data.rows[e].checkFlag?a.$set(t.data.rows[e],"checkFlagName","审核通过-未支付"):2==t.data.rows[e].checkFlag?a.$set(t.data.rows[e],"checkFlagName","审核通过-已支付"):3==t.data.rows[e].checkFlag?a.$set(t.data.rows[e],"checkFlagName","审核未通过"):4==t.data.rows[e].checkFlag?a.$set(t.data.rows[e],"checkFlagName","支付中"):5==t.data.rows[e].checkFlag&&a.$set(t.data.rows[e],"checkFlagName","已取消");return t.data}))},queryParams:{preNo:"",userName:"",checkFlag:-1,startTime:"",endTime:""},queryParamsOrigin:{preNo:"",userName:"",checkFlag:-1,startTime:"",endTime:""},createValue:[]}},created:function(){},methods:{handleSearch:function(a){a?this.keshiDataTemp=this.originData.filter((function(t){return-1!=t.name.indexOf(a)})):(this.keshiDataTemp=JSON.parse(JSON.stringify(this.originData)),this.queryParams.appointItemName="")},resetQuery:function(){this.queryParams=JSON.parse(JSON.stringify(this.queryParamsOrigin)),this.createValue=[]},onChange:function(a,t){this.createValue=a,this.queryParams.startTime=t[0],this.queryParams.endTime=t[1]},handleOk:function(){this.$refs.table.refresh()}}},o=c,m=(e("3cd3"),e("2877")),d=Object(m["a"])(o,s,i,!1,null,null,null);t["default"]=d.exports},1183:function(a,t,e){"use strict";e.r(t);var s=function(){var a=this,t=a.$createElement,e=a._self._c||t;return e("a-modal",{attrs:{title:"",width:900,visible:a.visible,confirmLoading:a.confirmLoading,footer:null},on:{ok:a.handleSubmit,cancel:a.handleCancel}},[e("a-spin",{attrs:{spinning:a.confirmLoading}},[e("div",{staticClass:"div-order-detail",attrs:{id:"printContent"}},[e("h2",{staticStyle:{"padding-left":"44%"}},[a._v("处方便笺")]),e("div",{staticClass:"div-line-wrap",staticStyle:{"margin-top":"6%"}},[e("span",{staticClass:"span-item-name"},[a._v("处方编号 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.preNo)+" ")]),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 开具日期 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.createTime)+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[a._v(" 登记号 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.papmiNo)+" ")]),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 诊疗卡号 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.cardNo)+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[a._v(" 患者姓名 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.userName)+" ")]),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 患者年龄 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.age)+"岁 ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[a._v(" 患者性别 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.userSex)+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[a._v(" 取药地点 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.takeMedicineLocDesc||"暂无")+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name",staticStyle:{width:"13%"}},[a._v(" 主述/现病史 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.presentIllness)+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[a._v(" 既往史 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.pastIllness||"暂无")+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[a._v(" 个人史 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.personIllness||"暂无")+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[a._v(" 过敏史 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.allergicIllness||"暂无")+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[a._v(" 家族史 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.familyIllness||"暂无")+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[a._v(" 初步诊断 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.diagnosis)+" ")])],1),e("div",{staticClass:"div-line-wrap"},[e("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[a._v(" 处理意见 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.suggestion)+" ")])],1),e("div",{staticClass:"div-line-wrap"},[e("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[a._v(" 处方清单 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(a.detailData.preNo)+" ")])],1),e("div",{staticClass:"div-medicine-fang-wrap"},a._l(a.detailData.list,(function(t,s){return e("div",{key:s,staticClass:"div-medicine-fang-item firstItem"},[e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name",staticStyle:{width:"70%"}},[a._v(" "+a._s(t.drugName)+" ")]),e("span",{staticClass:"span-item-value"})]),e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[a._v(" 数量 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(t.num)+" ")])]),e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[a._v(" 规格 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(t.drugSpec)+" ")]),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 价格 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(t.price)+" ")])]),e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[a._v(" 用药方法 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(t.drugUsemethod)+" ")])]),e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[a._v(" 单次用量 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(t.useNum)+" "+a._s(t.useUnit))]),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[a._v(" 用药频次 :")]),e("span",{staticClass:"span-item-value"},[a._v(a._s(t.useFrequency)+" ")])]),t.remark?e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[a._v(" 特殊说明 :")]),e("span",{staticClass:"span-item-value",staticStyle:{width:"80%"}},[a._v(a._s(t.remark))])]):a._e()])})),0),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"60%",width:"15%",color:"brown"}},[a._v(" 总计 : "+a._s(a.total)+"元")])]),e("div",{staticClass:"div-line-wrap"},[e("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[a._v(" 医生 :")]),e("span",{staticClass:"sign-name",staticStyle:{"margin-left":"1%"}},[a._v(a._s(a.detailData.docName)+" ")])],1)]),e("a-button",{directives:[{name:"print",rawName:"v-print",value:a.printObj,expression:"printObj"}],staticStyle:{"margin-left":"30%","margin-top":"6%"},attrs:{type:"primary"}},[a._v("打印处方")]),e("div",{staticStyle:{height:"25px",color:"white"}})],1)],1)},i=[],n=(e("d3b7"),e("159b"),e("b680"),e("4cab")),l={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,preNo:0,total:0,detailData:{},printObj:{id:"printContent",popTitle:"　"}}},methods:{edit:function(a){this.detailData={},this.total=0,this.visible=!0,this.preNo=a,this.$set(this.detailData,"preNo",a),this.getFangDetail(a)},getFangDetail:function(a){var t=this;this.confirmLoading=!0,Object(n["sb"])({preNo:a}).then((function(a){a.success?(t.detailData=a.data,t.detailData.list.length>0&&(t.detailData.list.forEach((function(a){t.total=t.total+a.num*a.price})),t.total=t.total.toFixed(2))):t.$message.error("请求失败："+a.message)})).finally((function(a){t.confirmLoading=!1}))},getStatusText:function(a){return 1==a?"待支付":2==a?"已完成":3==a?"部分支付":4==a?"待收货":5==a?"订单取消":void 0},handleSubmit:function(){},handleCancel:function(){this.visible=!1}}},r=l,c=(e("4b39"),e("2877")),o=Object(c["a"])(r,s,i,!1,null,null,null);t["default"]=o.exports},3112:function(a,t,e){},"3cd3":function(a,t,e){"use strict";e("3112")},"4b39":function(a,t,e){"use strict";e("704b")},"704b":function(a,t,e){}}]);