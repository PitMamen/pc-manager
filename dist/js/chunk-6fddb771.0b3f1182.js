(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6fddb771","chunk-248974cc"],{"0eab":function(t,e,s){},"62c9":function(t,e,s){"use strict";s("0eab")},ab07:function(t,e,s){},abe3:function(t,e,s){"use strict";s("ab07")},b3b0:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"div-service-pac"},[s("a-card",{staticClass:"card-right-pac",attrs:{bordered:!1}},[s("div",{staticClass:"table-page-search-wrapper"},[s("a-form",{attrs:{layout:"inline"}},[s("a-row",{attrs:{gutter:48}},[s("a-col",{attrs:{md:6,sm:24}},[s("a-form-item",{attrs:{label:"科室"}},[s("a-select",{attrs:{"allow-clear":"",placeholder:"请选择科室"},model:{value:t.queryParams.departmentId,callback:function(e){t.$set(t.queryParams,"departmentId",e)},expression:"queryParams.departmentId"}},t._l(t.keshiData,(function(e,a){return s("a-select-option",{key:a,attrs:{value:e.departmentId}},[t._v(t._s(e.departmentName))])})),1)],1)],1),s("a-col",{attrs:{md:6,sm:24}},[s("a-form-item",{attrs:{label:"关键字"}},[s("a-input",{attrs:{"allow-clear":"",placeholder:"请输入医生姓名"},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.$refs.table.refresh(!0)},search:function(e){return t.$refs.table.refresh(!0)}},model:{value:t.queryParams.userName,callback:function(e){t.$set(t.queryParams,"userName",e)},expression:"queryParams.userName"}})],1)],1),s("a-col",{attrs:{md:3,sm:24}},[s("span",{staticClass:"table-page-search-submitButtons",style:t.advanced&&{float:"right",overflow:"hidden"}||{}},[s("a-button",{attrs:{type:"primary"},on:{click:function(e){return t.$refs.table.refresh(!0)}}},[t._v("查询")])],1)])],1)],1)],1),s("s-table",{ref:"table",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.code}},scopedSlots:t._u([{key:"action",fn:function(e,a){return s("span",{},[s("a",{on:{click:function(e){return t.$refs.addForm.edit(a)}}},[t._v("配置")])])}}])}),s("add-form",{ref:"addForm",on:{ok:t.handleOk}})],1)],1)},i=[],n=s("2af9"),r=s("b95f"),c=s("4cab"),o={components:{STable:n["s"],addForm:r["default"]},computed:{rowSelection:function(){return{onChange:this.onSelectChange,getCheckboxProps:function(t){return{props:{disabled:!t.userId,name:t.userId}}}}},hasSelected:function(){return this.selectedRowKeys.length>0}},data:function(){var t=this;return{selectedRowKeys:[],advanced:!1,dataList:[],keshiData:[],partChoose:"",queryParams:{departmentId:"",userName:"",status:2,roleId:3},columns:[{title:"序号",dataIndex:"xh"},{title:"医生姓名",dataIndex:"docName"},{title:"所属科室",dataIndex:"deptName"},{title:"职级",dataIndex:"Rank"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(e){return Object(c["Ac"])(Object.assign(e,t.queryParams)).then((function(e){if(0==e.code){for(var s=0;s<e.data.rows.length;s++)t.$set(e.data.rows[s],"xh",s+1+(e.data.pageNo-1)*e.data.pageSize),t.$set(e.data.rows[s],"docName",e.data.rows[s].userName),t.$set(e.data.rows[s],"deptName",e.data.rows[s].departmentName),t.$set(e.data.rows[s],"Rank",e.data.rows[s].professionalTitle);return e.data}t.$message.error(e.message)}))}}},created:function(){var t=this;Object(c["eb"])().then((function(e){0==e.code&&(t.keshiData=e.data,e.data.unshift({departmentId:"",departmentName:"全部",hospitalId:1,parentId:0,children:null}),t.keshiDataTemp=JSON.parse(JSON.stringify(t.keshiData)))}))},methods:{onSelectChange:function(t){this.selectedRowKeys=t},handleOk:function(){this.$refs.table.refresh()}}},p=o,d=(s("62c9"),s("2877")),l=Object(d["a"])(p,a,i,!1,null,null,null);e["default"]=l.exports},b95f:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("a-modal",{attrs:{title:"",width:900,visible:t.visible,confirmLoading:t.confirmLoading},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[s("a-spin",{attrs:{spinning:t.confirmLoading}},[s("div",{staticClass:"div-order-detail",attrs:{id:"printContent"}},[s("h2",{staticStyle:{"padding-left":"0%"}},[t._v("配置")]),s("div",{staticClass:"div-line-wrap",staticStyle:{"margin-top":"6%"}},[s("span",{staticClass:"span-item-name"},[t._v("医生姓名 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.docName)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 所属科室 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.departmentName)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 职级 :")]),s("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.professionalTitle)+" ")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 服务配置 :")])]),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 图文咨询 :")]),s("a-popconfirm",{staticClass:"switch-button",attrs:{title:t.isTuwenOpenText,"ok-text":"确定","cancel-text":"取消"},on:{confirm:function(e){return t.gotuwenOpen()}}},[s("a-switch",{attrs:{checked:t.isTuwenOpen}})],1)],1),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 电话咨询 :")]),s("a-popconfirm",{staticClass:"switch-button",attrs:{title:t.isDianhuaOpenText,"ok-text":"确定","cancel-text":"取消"},on:{confirm:function(e){return t.godianhuaOpen()}}},[s("a-switch",{attrs:{checked:t.isDianhuaOpen}})],1)],1),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 视频咨询 :")]),s("a-popconfirm",{staticClass:"switch-button",attrs:{title:t.isShipinOpenText,"ok-text":"确定","cancel-text":"取消"},on:{confirm:function(e){return t.goshipinOpen()}}},[s("a-switch",{attrs:{checked:t.isShipinOpen}})],1)],1),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" 复诊开方 :")]),s("a-popconfirm",{staticClass:"switch-button",attrs:{title:t.isKaifOpenText,"ok-text":"确定","cancel-text":"取消"},on:{confirm:function(e){return t.gokaifOpen()}}},[s("a-switch",{attrs:{checked:t.isKaifOpen}})],1)],1),s("div",{staticClass:"div-line-wrap"},[s("span",{staticClass:"span-item-name"},[t._v(" MDT会诊 :")]),s("a-popconfirm",{staticClass:"switch-button",attrs:{title:t.isMdtOpenText,"ok-text":"确定","cancel-text":"取消"},on:{confirm:function(e){return t.gomdtOpen()}}},[s("a-switch",{attrs:{checked:t.isMdtOpen}})],1)],1)]),s("div",{staticStyle:{height:"25px",color:"white"}})])],1)},i=[],n=(s("caad"),s("2532"),s("4cab")),r={data:function(){return{isTuwenOpenText:"确定开启吗",isTuwenOpen:!1,isDianhuaOpen:!1,isDianhuaOpenText:"确定开启吗",isShipinOpenText:"确定开启吗",isShipinOpen:!1,isKaifOpen:!1,isKaifOpenText:"确定开启吗",isMdtOpen:!1,isMdtOpenText:"确定开启吗",record:null,labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,preNo:0,total:0}},methods:{edit:function(t){this.record=t,this.visible=!0,this.isTuwenOpen=!!t.registerTypeOptions.includes("textNum"),this.isDianhuaOpen=!!t.registerTypeOptions.includes("telNum"),this.isShipinOpen=!!t.registerTypeOptions.includes("videoNum"),this.isKaifOpen=!!t.registerTypeOptions.includes("appointNum"),this.isMdtOpen=!!t.registerTypeOptions.includes("consult"),this.isTuwenOpenText=this.isTuwenOpen?"确认关闭吗？":"确认开启吗？",this.isDianhuaOpenText=this.isDianhuaOpen?"确认关闭吗？":"确认开启吗？",this.isShipinOpenText=this.isShipinOpen?"确认关闭吗？":"确认开启吗？",this.isKaifOpenText=this.isKaifOpen?"确认关闭吗？":"确认开启吗？",this.isMdtOpenText=this.isMdtOpen?"确认关闭吗？":"确认开启吗？"},gotuwenOpen:function(){var t=this;this.isTuwenOpen?this.isTuwenOpen=!1:this.isTuwenOpen=!0,setTimeout((function(){t.isTuwenOpenText=t.isTuwenOpen?"确定关闭吗？":"确定开启吗？"}),200)},godianhuaOpen:function(){var t=this;this.isDianhuaOpen?this.isDianhuaOpen=!1:this.isDianhuaOpen=!0,setTimeout((function(){t.isDianhuaOpenText=t.isDianhuaOpen?"确定关闭吗？":"确定开启吗？"}),200)},goshipinOpen:function(){var t=this;this.isShipinOpen?this.isShipinOpen=!1:this.isShipinOpen=!0,setTimeout((function(){t.isShipinOpenText=t.isShipinOpen?"确定关闭吗？":"确定开启吗？"}),200)},gokaifOpen:function(){var t=this;this.isKaifOpen?this.isKaifOpen=!1:this.isKaifOpen=!0,setTimeout((function(){t.isKaifOpenText=t.isKaifOpen?"确定关闭吗？":"确定开启吗？"}),200)},gomdtOpen:function(){var t=this;this.isMdtOpen?this.isMdtOpen=!1:this.isMdtOpen=!0,setTimeout((function(){t.isMdtOpenText=t.isMdtOpen?"确定关闭吗？":"确定开启吗？"}),200)},handleSubmit:function(){var t=this,e="";this.isTuwenOpen&&(e="textNum,"),this.isShipinOpen&&(e+="videoNum,"),this.isDianhuaOpen&&(e+="telNum,"),this.isKaifOpen&&(e+="appointNum,"),this.isMdtOpen&&(e+="consult");var s={userId:this.record.userId,registerTypeOptions:e};Object(n["pd"])(s).then((function(e){0==e.code?(t.$message.success(e.message),t.visible=!1,t.$emit("ok")):t.$message.success(e.message)}))},handleCancel:function(){this.visible=!1}}},c=r,o=(s("abe3"),s("2877")),p=Object(o["a"])(c,a,i,!1,null,null,null);e["default"]=p.exports}}]);