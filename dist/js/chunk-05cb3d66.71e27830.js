(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-05cb3d66","chunk-c5dfa258"],{"0299":function(t,a,e){"use strict";e("74f9")},3258:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("a-modal",{attrs:{title:"订单详情",width:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:null},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[e("a-spin",{attrs:{spinning:t.confirmLoading}},[e("div",{staticClass:"div-order-detail"},[e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[t._v("订单编号 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(t.preNo)+" ")]),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 下单日期 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.createTime)+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[t._v(" 登记号 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.papmiNo)+" ")]),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 诊疗卡号 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.cardNo)+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 收货信息 :")])],1),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[t._v(" 姓名 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.userName)+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[t._v(" 电话 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.tel)+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name"},[t._v(" 地址 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.address)+" ")])]),e("div",{staticClass:"div-line-wrap"},[e("a-icon",{attrs:{type:"star",theme:"twoTone","two-tone-color":"#eb2f96"}}),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"1%"}},[t._v(" 处方清单 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(t.detailData.preNo)+" ")])],1),e("div",{directives:[{name:"show",rawName:"v-show",value:t.detailData.list.length>0,expression:"detailData.list.length > 0"}],staticClass:"div-medicine-wrap"},t._l(t.detailData.list,(function(a,s){return e("div",{key:s,staticClass:"div-medicine-item firstItem"},[e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name",staticStyle:{width:"70%"}},[t._v(" "+t._s(a.drugName)+" ")]),e("span",{staticClass:"span-item-value"})]),e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[t._v(" 数量 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(a.num)+" ")])]),e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[t._v(" 规格 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(a.drugSpec)+" ")]),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 价格 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(a.price)+" ")])]),e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[t._v(" 用药方法 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(a.drugUsemethod)+" ")])]),e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[t._v(" 单次用量 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(a.useNum)+" "+t._s(a.useUnit))]),e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 用药频次 :")]),e("span",{staticClass:"span-item-value"},[t._v(t._s(a.useFrequency)+" ")])]),a.remark?e("div",{staticClass:"div-line-medicine"},[e("span",{staticClass:"span-item-name"},[t._v(" 特殊说明 :")]),e("span",{staticClass:"span-item-value",staticStyle:{width:"80%"}},[t._v(t._s(a.remark))])]):t._e()])})),0),e("div",{staticClass:"div-line-wrap"},[e("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"60%",color:"brown"}},[t._v(" 总计 : "+t._s(t.total)+"元")])])])])],1)},i=[],n=(e("d3b7"),e("159b"),e("b680"),e("4cab")),r={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,preNo:0,total:0,detailData:{}}},methods:{edit:function(t){this.detailData={},this.total=0,this.visible=!0,this.preNo=t,this.$set(this.detailData,"preNo",t),this.getFangDetail(t)},getFangDetail:function(t){var a=this;this.confirmLoading=!0,Object(n["qb"])({preNo:t}).then((function(t){t.success?(a.detailData=t.data,a.detailData.list.length>0&&(a.detailData.list.forEach((function(t){a.total=a.total+t.num*t.price})),a.total=a.total.toFixed(2))):a.$message.error("请求失败："+t.message)})).finally((function(t){a.confirmLoading=!1}))},getStatusText:function(t){return 1==t?"待支付":2==t?"已完成":3==t?"部分支付":4==t?"待收货":5==t?"订单取消":void 0},handleSubmit:function(){},handleCancel:function(){this.visible=!1}}},l=r,o=(e("eebb"),e("2877")),c=Object(o["a"])(l,s,i,!1,null,null,null);a["default"]=c.exports},"74f9":function(t,a,e){},ae41:function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"div-yiji-todo"},[e("a-card",{staticClass:"card-right",attrs:{bordered:!1}},[e("div",{staticClass:"table-page-search-wrapper",staticStyle:{"margin-top":"1%"}},[e("a-form",{attrs:{layout:"inline"}},[e("a-row",{attrs:{gutter:48}},[e("a-col",{attrs:{md:7,sm:24}},[e("a-form-item",{attrs:{label:"订单编号"}},[e("a-input-search",{attrs:{"allow-clear":"",placeholder:"请输入订单编号"},on:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.$refs.table.refresh(!0)},search:function(a){return t.$refs.table.refresh(!0)}},model:{value:t.queryParams.orderId,callback:function(a){t.$set(t.queryParams,"orderId",a)},expression:"queryParams.orderId"}})],1)],1),e("a-col",{attrs:{md:7,sm:24}},[e("a-form-item",{attrs:{label:"处方编号"}},[e("a-input-search",{attrs:{"allow-clear":"",placeholder:"请输入处方编号"},on:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.$refs.table.refresh(!0)},search:function(a){return t.$refs.table.refresh(!0)}},model:{value:t.queryParams.preNo,callback:function(a){t.$set(t.queryParams,"preNo",a)},expression:"queryParams.preNo"}})],1)],1),e("a-col",{attrs:{md:6,sm:24}},[e("a-form-item",{attrs:{label:"订单状态"}},[e("a-select",{attrs:{"allow-clear":"",placeholder:"请选择订单状态"},model:{value:t.queryParams.status,callback:function(a){t.$set(t.queryParams,"status",a)},expression:"queryParams.status"}},t._l(t.statusData,(function(a,s){return e("a-select-option",{key:s,attrs:{value:a.code}},[t._v(t._s(a.value))])})),1)],1)],1)],1),e("a-row",{attrs:{gutter:48}},[e("a-col",{attrs:{md:5,sm:24}},[e("a-form-item",{attrs:{label:"下单时间"}},[e("a-range-picker",{attrs:{value:t.createValue},on:{change:t.onChange}})],1)],1),e("a-col",{attrs:{md:5,sm:24}},[e("a-button",{attrs:{type:"primary"},on:{click:function(a){return t.$refs.table.refresh(!0)}}},[t._v("查询")]),e("a-button",{attrs:{type:"primary"},on:{click:t.resetQuery}},[t._v("重置")]),e("a-button",{attrs:{type:"primary"},on:{click:t.exportExcel}},[t._v("导出")])],1)],1)],1)],1),e("s-table",{ref:"table",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.code}},scopedSlots:t._u([{key:"action",fn:function(a,s){return e("span",{},[e("a",{on:{click:function(a){return t.$refs.orderDetail.edit(s.preNo)}}},[t._v("查看")])])}},{key:"update",fn:function(a,s){return e("span",{},[2==s.status?e("a-popconfirm",{attrs:{title:"是否完成发货配送？","ok-text":"确定","cancel-text":"取消"},on:{confirm:function(a){return t.goUpdate(s)}}},[e("a",[t._v(t._s(s.statusText))])]):e("span",[t._v(t._s(s.statusText))])],1)}}])}),e("order-detail",{ref:"orderDetail",on:{ok:t.handleOk}})],1)],1)},i=[],n=(e("4d63"),e("ac1f"),e("25f0"),e("d3b7"),e("3ca3"),e("ddb0"),e("2b3d"),e("9861"),e("5319"),e("2af9")),r=e("4cab"),l=e("3258"),o=e("ca00"),c={components:{STable:n["s"],orderDetail:l["default"]},data:function(){var t=this;return{statusData:[{code:-1,value:"全部"},{code:1,value:"待支付"},{code:2,value:"未配送"},{code:3,value:"支付中"},{code:4,value:"待收货"},{code:5,value:"订单取消"},{code:6,value:"已退款"},{code:7,value:"已配送"}],columns:[{title:"订单编号",dataIndex:"orderId"},{title:"处方编号",dataIndex:"preNo"},{title:"下单日期",dataIndex:"orderTime"},{title:"订单金额（元）",dataIndex:"total"},{title:"订单详情",scopedSlots:{customRender:"action"}},{title:"订单状态",scopedSlots:{customRender:"update"},width:"300px"}],createValue:[],loadData:function(a){var e=JSON.parse(JSON.stringify(Object.assign(a,t.queryParams)));return-1==e.status&&(e.status=""),Object(r["qc"])(e).then((function(a){for(var e=0;e<a.data.rows.length;e++)1==a.data.rows[e].status?t.$set(a.data.rows[e],"statusText","待支付"):2==a.data.rows[e].status?t.$set(a.data.rows[e],"statusText","未配送"):3==a.data.rows[e].status?t.$set(a.data.rows[e],"statusText","支付中"):4==a.data.rows[e].status?t.$set(a.data.rows[e],"statusText","待收货"):5==a.data.rows[e].status?t.$set(a.data.rows[e],"statusText","订单取消"):6==a.data.rows[e].status?t.$set(a.data.rows[e],"statusText","已退款"):7==a.data.rows[e].status&&t.$set(a.data.rows[e],"statusText","已配送");return a.data}))},queryParams:{orderId:"",preNo:"",status:-1,startTime:"",endTime:""},queryParamsOrigin:{orderId:"",preNo:"",status:-1,startTime:"",endTime:""}}},created:function(){},methods:{resetQuery:function(){this.queryParams=JSON.parse(JSON.stringify(this.queryParamsOrigin)),this.createValue=[]},onChange:function(t,a){this.createValue=t,this.queryParams.startTime=a[0],this.queryParams.endTime=a[1]},exportExcel:function(){var t;"test"==o["b"]?t="http://192.168.1.122:8124/excel/exportOrders":"show"==o["b"]?t="http://172.31.160.11:8124/excel/exportOrders":"online"==o["b"]&&(t="http://manager.mclouds.org.cn:8088/api/health-api/excel/exportOrders"),this.downloadUrl(t,"")},downloadUrl:function(t){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"未知文件",e=document.createElement("a");e.style.display="none",e.setAttribute("target","_blank"),a&&e.setAttribute("download",a),e.href=t,document.body.appendChild(e),e.click(),document.body.removeChild(e)},downloadfile:function(t){var a=new Blob([t.data],{type:"application/octet-stream;charset=UTF-8"}),e=t.headers["content-disposition"],s=new RegExp("filename=([^;]+\\.[^\\.;]+);*"),i=s.exec(e),n=i[1],r=document.createElement("a"),l=window.URL.createObjectURL(a),o=/^["](.*)["]$/g;r.style.display="none",r.href=l,r.download=decodeURI(n.replace(o,"$1")),document.body.appendChild(r),r.click(),document.body.removeChild(r),window.URL.revokeObjectURL(l)},goUpdate:function(t){var a=this;2==t.status&&Object(r["od"])({orderId:t.orderId,status:7}).then((function(t){t.success?(a.$message.success("操作成功"),a.$refs.table.refresh()):a.$message.error("操作失败："+t.message)}))},handleOk:function(){this.$refs.table.refresh()}}},d=c,u=(e("0299"),e("2877")),p=Object(u["a"])(d,s,i,!1,null,null,null);a["default"]=p.exports},eebb:function(t,a,e){"use strict";e("f2ab")},f2ab:function(t,a,e){}}]);