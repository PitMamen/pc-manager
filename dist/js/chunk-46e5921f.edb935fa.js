(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-46e5921f","chunk-7386c3d6"],{"0deb":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{staticClass:"sys-card",attrs:{bordered:!1}},[a("div",{staticClass:"table-page-search-wrapper"},[a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[e._v("姓名:")]),a("a-input",{staticStyle:{width:"140px",height:"28px"},attrs:{"allow-clear":"",placeholder:"输入姓名"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$refs.table.refresh(!0)},search:function(t){return e.$refs.table.refresh(!0)}},model:{value:e.queryParams.userNameOrTel,callback:function(t){e.$set(e.queryParams,"userNameOrTel",t)},expression:"queryParams.userNameOrTel"}})],1),a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[e._v("执行科室:")]),a("a-select",{staticStyle:{width:"120px"},attrs:{placeholder:"请选择科室","allow-clear":""},model:{value:e.queryParams.executeDepartmentId,callback:function(t){e.$set(e.queryParams,"executeDepartmentId",t)},expression:"queryParams.executeDepartmentId"}},e._l(e.originData,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.departmentId}},[e._v(e._s(t.departmentName))])})),1)],1),a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[e._v("发送状态:")]),a("a-select",{staticStyle:{width:"120px"},attrs:{placeholder:"请选择","allow-clear":""},model:{value:e.queryParams.status,callback:function(t){e.$set(e.queryParams,"status",t)},expression:"queryParams.status"}},e._l(e.statusData,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.code}},[e._v(e._s(t.value))])})),1)],1),a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[e._v("发送时间:")]),a("a-range-picker",{attrs:{value:e.createValue},on:{change:e.onChange}})],1),a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[e._v("随访方案:")]),a("a-input",{staticStyle:{width:"120px",height:"28px"},attrs:{"allow-clear":"",placeholder:"输入方案名称"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$refs.table.refresh(!0)},search:function(t){return e.$refs.table.refresh(!0)}},model:{value:e.queryParams.planName,callback:function(t){e.$set(e.queryParams,"planName",t)},expression:"queryParams.planName"}})],1),a("div",{staticClass:"action-row"},[a("span",{staticClass:"buttons",style:{float:"right",overflow:"hidden"}},[a("a-button",{attrs:{type:"primary",icon:"search"},on:{click:function(t){return e.$refs.table.refresh(!0)}}},[e._v("查询")]),a("a-button",{staticStyle:{"margin-left":"8px","margin-right":"0"},attrs:{icon:"undo"},on:{click:function(t){return e.reset()}}},[e._v("重置")])],1)])]),a("s-table",{ref:"table",attrs:{scroll:{x:!0},size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.goCheck(s)}}},[e._v("查看")])])}},{key:"status",fn:function(t,s){return a("span",{},["发送成功"==s.status?a("span",{staticStyle:{color:"green"}},[e._v(e._s(s.status))]):e._e(),"发送失败"==s.status?a("span",{staticStyle:{color:"red"}},[e._v(e._s(s.status))]):e._e()])}}])}),a("log-detail",{ref:"logDetail",on:{ok:e.handleOk}})],1)},r=[],n=(a("d3b7"),a("159b"),a("2af9")),i=a("9179"),l=a("4cab"),c=a("9fb0"),o=a("2b0e"),u={components:{STable:n["s"],logDetail:i["default"]},data:function(){var e=this;return{user:{},keshiData:[],originData:[],idArr:[],queryParams:{executeDepartmentId:-1,executeEndTime:"",executeStartTime:"",planName:"",status:-1,userNameOrTel:void 0},queryParamsOrigin:{executeDepartmentId:-1,executeEndTime:"",executeStartTime:"",planName:"",status:-1,userNameOrTel:void 0},labelCol:{xs:{span:24},sm:{span:5}},statusData:[{code:-1,value:"全部"},{code:1,value:"发送成功"},{code:2,value:"发送失败"}],wrapperCol:{xs:{span:24},sm:{span:15}},confirmLoading:!1,createValue:[],form:this.$form.createForm(this),columns:[{title:"姓名",dataIndex:"userName"},{title:"微信ID",dataIndex:"wxId"},{title:"公众号",dataIndex:"wxName"},{title:"执行科室",dataIndex:"executeDepartmentName"},{title:"随访方案",dataIndex:"planName"},{title:"消息模版",dataIndex:"templateTitle"},{title:"发送时间",dataIndex:"executeTime"},{title:"状态",scopedSlots:{customRender:"status"}},{title:"原因",dataIndex:"errorDesc"},{title:"操作",fixed:"right",width:"100px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(t){var a=JSON.parse(JSON.stringify(e.queryParams));return-1==a.status&&delete a.status,-1==a.executeDepartmentId&&delete a.executeDepartmentId,Object(l["Sb"])(Object.assign(t,a)).then((function(e){if(0==e.code){var a={pageNo:t.pageNo,pageSize:t.pageSize,totalRows:e.data.total,totalPage:e.data.total/t.pageSize,rows:e.data.records};a.rows.forEach((function(e,t){e.executeTime=e.executeTime.substring(0,11)}))}return a}))}}},created:function(){var e=this;this.user=o["a"].ls.get(c["o"]),7==this.user.roleId||"admin"==this.user.roleName?Object(l["eb"])().then((function(t){0==t.code&&(e.originData=t.data,e.originData.unshift({departmentName:"全部",departmentId:-1}),e.$refs.table.refresh(!0))})):Object(l["fb"])().then((function(t){0==t.code&&(e.originData=t.data,e.originData.unshift({departmentName:"全部",departmentId:-1}),e.$refs.table.refresh(!0))}))},methods:{refresh:function(){this.$refs.table.refresh(!0)},editPlan:function(e){this.$router.push({name:"project_edit",query:{planId:e.id}})},onChange:function(e,t){this.createValue=e,this.queryParams.executeStartTime=t[0],this.queryParams.executeEndTime=t[1]},goCheck:function(e){this.$refs.logDetail.add(e,"微信详情")},reset:function(){this.queryParams=JSON.parse(JSON.stringify(this.queryParamsOrigin)),this.createValue=[],this.$refs.table.refresh()},handleOk:function(){this.$refs.table.refresh()}}},d=u,f=(a("2317"),a("2877")),m=Object(f["a"])(d,s,r,!1,null,"c72e2ece",null);t["default"]=m.exports},2317:function(e,t,a){"use strict";a("802b")},"36e7":function(e,t,a){"use strict";a("eb31")},"802b":function(e,t,a){},9179:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:e.title,width:1e3,height:650,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("template",{slot:"footer"},[a("a-button",{on:{click:e.handleCancel}},[e._v("关闭")])],1),a("div",{staticClass:"div-detail"},[e._v(e._s(e.detail))])],2)},r=[],n=(a("d3b7"),a("4cab")),i={components:{},data:function(){return{failShow:!1,confirmLoading:!1,visible:!1,title:"新增名单",detail:"..."}},methods:{add:function(e,t){var a=this;this.record=e,this.title=t,this.visible=!0,this.confirmLoading=!0,Object(n["Wb"])(e.id).then((function(e){a.confirmLoading=!1,0==e.code&&(a.detail=e.data.contentText)})).finally((function(e){a.confirmLoading=!1}))},handleCancel:function(){this.visible=!1},handleSubmit:function(){this.visible=!1}}},l=i,c=(a("36e7"),a("2877")),o=Object(c["a"])(l,s,r,!1,null,"ea0ec382",null);t["default"]=o.exports},eb31:function(e,t,a){}}]);