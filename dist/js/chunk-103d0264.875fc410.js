(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-103d0264","chunk-7dfafe84","chunk-4c467756"],{"1f3a":function(e,t,a){"use strict";a("a5d7")},"4d94":function(e,t,a){"use strict";a("e5ef")},"822a":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:e.title,width:1e3,height:650,visible:e.visible,confirmLoading:!1},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-card",{staticClass:"card-top-pac",attrs:{bordered:!1}},[a("div",{staticClass:"table-page-wrapper",staticStyle:{"margin-top":"-2%"}},[a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 名单描述 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"20%","margin-left":"2%"},attrs:{maxLength:30,"allow-clear":"",placeholder:"请输入内容"},on:{blur:function(t){return e.focus(e.record)}},model:{value:e.metaName,callback:function(t){e.metaName=t},expression:"metaName"}}),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"10%"}},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 数据库表 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"20%","margin-left":"2%"},attrs:{disabled:"",maxLength:30,"allow-clear":""},model:{value:e.record.databaseTableName,callback:function(t){e.$set(e.record,"databaseTableName",t)},expression:"record.databaseTableName"}}),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"10%"}},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 状态 :")]),a("a-switch",{staticStyle:{"margin-left":"1%"},attrs:{checked:e.isOpen},on:{click:e.Enable}})],1)]),a("a-table",{ref:"table",staticStyle:{"margin-top":"2%","overflow-y":"auto",height:"500px"},attrs:{size:"default",scroll:{y:400,x:0},pagination:!1,"data-source":e.loadData,columns:e.columns,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"show",fn:function(t,i){return a("span",{},[a("a-checkbox",{on:{change:function(t){return e.shwoChange(i)}},model:{value:i.show,callback:function(t){e.$set(i,"show",t)},expression:"record.show"}})],1)}},{key:"index",fn:function(t,i){return a("span",{},[a("a-checkbox",{on:{change:function(t){return e.isOnlyIndex(i)}},model:{value:i.wysy,callback:function(t){e.$set(i,"wysy",t)},expression:"record.wysy"}})],1)}},{key:"eleDes",fn:function(t,i){return a("span",{},[null!=i.defaultField&&2==i.defaultField.value?a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"120px","margin-right":"1%"},attrs:{maxLength:30,"allow-clear":""},on:{blur:function(t){return e.changeDes(i)}},model:{value:i.fieldComment,callback:function(t){e.$set(i,"fieldComment",t)},expression:"record.fieldComment"}}):e._e(),null!=i.defaultField&&1==i.defaultField.value?a("span",[e._v(e._s(null!=i.fieldComment?i.fieldComment:""))]):e._e()],1)}},{key:"fileDes",fn:function(t,i){return a("span",{staticStyle:{display:"inline-block"}},[null!=i.defaultField&&2==i.defaultField.value?a("a-select",{staticStyle:{width:"110px","margin-right":"1%"},on:{select:function(t){return e.selectDes(i)}},model:{value:i.fieldArchives.description,callback:function(t){e.$set(i.fieldArchives,"description",t)},expression:"record.fieldArchives.description"}},e._l(e.dazdList,(function(t,i){return a("a-select-option",{key:i,attrs:{value:t.code}},[e._v(e._s(t.value))])})),1):e._e(),null!=i.defaultField&&1==i.defaultField.value?a("span",[e._v(e._s(null!=i.fieldArchives?i.fieldArchives.description:""))]):e._e()],1)}}])})],1)],1)},s=[],n=(a("4de4"),a("d3b7"),a("159b"),a("a4d3"),a("e01a"),a("4cab")),l=a("2af9"),c={components:{STable:l["s"]},data:function(){return{clickTtime:(new Date).getTime(),loadData:[],id:"",isOpen:!1,record:{},metaName:"",queryParams:{databaseTableName:"",metaName:""},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,detailList:[],confirmLoading:!1,form:this.$form.createForm(this),title:"编辑名单",dazdList:[{code:0,value:"无"},{code:1,value:"紧急联系人"},{code:2,value:"紧急电话"},{code:3,value:"微信OpenID"}],columns:[{title:"字段编码",dataIndex:"zdbm"},{title:"字段描述",scopedSlots:{customRender:"eleDes"}},{title:"字段类型",dataIndex:"zdlx",width:100},{title:"字段大小",dataIndex:"fieldLength",width:100},{title:"默认值",dataIndex:"fieldDefaultValue",width:90},{title:"档案字段",scopedSlots:{customRender:"fileDes"}},{title:"显示",dataIndex:"show",scopedSlots:{customRender:"show"},width:90},{title:"唯一索引",dataIndex:"index",scopedSlots:{customRender:"index"},width:90}]}},methods:{check:function(e){var t=this;this.visible=!0,this.record=e,this.metaName=e.metaName,this.id=e.id,this.isOpen=1==e.status.value,this.queryParams.databaseTableName=e.databaseTableName,Object(n["l"])(this.queryParams).then((function(e){if(0==e.code&&e.data.length>0){var a=e.data[0];a.detail=a.detail.filter((function(e){return"id"!=e.tableField})),a.detail.forEach((function(e,a){t.$set(e,"zdbm",e.tableField),t.$set(e,"zdlx",null!=e.fieldType?e.fieldType.description:""),null==e.fieldArchives&&t.$set(e,"fieldArchives",{description:""}),t.$set(e,"show",null!=e.showStatus&&1==e.showStatus.value),t.$set(e,"wysy",null!=e.uniqueIndexStatus&&1==e.uniqueIndexStatus.value)})),t.detailList=a.detail,t.loadData=a.detail}else t.detailList=null,t.loadData=null;return[]}))},focus:function(e){var t={id:e.id,metaName:this.metaName};this.updateMetaConfigure(t)},changeDes:function(e){this.id,e.id,e.fieldComment},selectDes:function(e){},updateMetaConfigure:function(e){var t=this;this.confirmLoading=!0,Object(n["Bd"])(e).then((function(e){e.success?t.$emit("ok"):t.$message.error("编辑失败："+e.message),t.confirmLoading=!1})).finally((function(e){t.confirmLoading=!1}))},saveMetaConfigure:function(e){var t=this;this.confirmLoading=!0,Object(n["ad"])(e).then((function(e){e.success?(t.visible=!1,t.$emit("ok")):t.$message.error("修改失败："+e.message),t.confirmLoading=!1})).finally((function(e){t.confirmLoading=!1}))},shwoChange:function(e){1==e.showStatus.value?this.isShow=!0:this.isShow=!1},isOnlyIndex:function(e){1==e.uniqueIndexStatus.value?this.onlyIndex=!0:this.onlyIndex=!1},Enable:function(){this.isOpen=!this.isOpen,this.isOpen?this.queryParams.status=1:this.queryParams.status=2;var e={id:this.id,status:this.isOpen?1:2};this.updateMetaConfigure(e)},handleCancel:function(){this.form.resetFields(),this.visible=!1},handleSubmit:function(){var e=JSON.parse(JSON.stringify(this.detailList));e.forEach((function(e){e.defaultField=null!=e.defaultField?e.defaultField.value:2,e.id=e.id,e.fieldComment=e.fieldComment;var t=0;null!=e.fieldArchives?("紧急联系人"===e.fieldArchives.description||1==e.fieldArchives.description?t=1:"紧急电话"===e.fieldArchives.description||2==e.fieldArchives.description?t=2:"无"!==e.fieldArchives.description&&0!=e.fieldArchives.description||(t=0),e.fieldArchives=null!=e.fieldArchives?t:""):e.fieldArchives=null!=e.fieldArchives?e.fieldArchives.description:"",e.fieldType=null!=e.fieldType?e.fieldType.value:"",e.showStatus=e.show?1:2,e.uniqueIndexStatus=e.wysy?1:2}));var t={id:this.id,detail:e};this.repeatclickFun()?this.saveMetaConfigure(t):this.$message.error("请勿重复操作!")},repeatclickFun:function(){var e=Date.now()-this.clickTtime;return this.clickTtime=Date.now(),!(e>0&&e<=500)}}},r=c,o=(a("b3b1"),a("2877")),d=Object(o["a"])(r,i,s,!1,null,null,null);t["default"]=d.exports},"9282b":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{staticClass:"card-right-pac",attrs:{bordered:!1}},[a("div",{staticClass:"table-page-search-wrapper"},[a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[e._v("查询条件:")]),a("a-input",{staticStyle:{width:"120px"},attrs:{"allow-clear":"",placeholder:"可输入应用名称查询"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$refs.table.refresh(!0)},search:function(t){return e.$refs.table.refresh(!0)}},model:{value:e.queryParams.metaName,callback:function(t){e.$set(e.queryParams,"metaName",t)},expression:"queryParams.metaName"}})],1),a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[e._v("状态:")]),a("a-switch",{attrs:{checked:e.isOpen},on:{click:e.goOpen}})],1),a("div",{staticClass:"action-row"},[a("span",{staticClass:"buttons",style:{float:"right",overflow:"hidden"}},[a("a-button",{attrs:{type:"primary",icon:"search"},on:{click:function(t){return e.$refs.table.refresh(!0)}}},[e._v("查询")]),a("a-button",{staticStyle:{"margin-left":"8px"},attrs:{icon:"undo"},on:{click:function(t){return e.reset()}}},[e._v("重置")])],1)])]),a("div",{staticClass:"table-operator",staticStyle:{overflow:"hidden"}},[a("a-button",{staticStyle:{float:"right","margin-right":"0"},attrs:{icon:"plus"},on:{click:function(t){return e.addName()}}},[e._v("新增")])],1),a("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(t,i){return a("span",{},[a("a",{on:{click:function(t){return e.$refs.checkIndex.check(i)}}},[e._v("查看")]),a("a-divider",{attrs:{type:"vertical"}}),a("a",{on:{click:function(t){return e.Enable(i)}}},[e._v(e._s(i.enableStatus))])],1)}}])}),a("check-Index",{ref:"checkIndex",on:{ok:e.handleOk}}),a("add-Name",{ref:"addName",on:{ok:e.handleOk}})],1)},s=[],n=(a("d3b7"),a("159b"),a("a4d3"),a("e01a"),a("2af9")),l=a("4cab"),c=a("822a"),r=a("eb8e"),o={components:{STable:n["s"],checkIndex:c["default"],addName:r["default"]},data:function(){var e=this;return{isOpen:!0,datas:[],keshiData:[],queryParams:{metaName:"",status:1},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this),columns:[{title:"名单描述",dataIndex:"metaName",width:100},{title:"数据库表名",dataIndex:"databaseTableName",width:180},{title:"数据库字段",dataIndex:"databaseTableFieldName",ellipsis:!0,maxWidth:180},{title:"状态",dataIndex:"zt",width:80},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(t){return Object(l["tc"])(Object.assign(t,e.queryParams)).then((function(a){var i={pageNo:t.pageNo,pageSize:t.pageSize,totalRows:a.data.totalRows,totalPage:a.data.totalRows/t.pageSize,rows:a.data.rows};return 0==a.code&&a.data.rows.length>0&&i.rows.forEach((function(t,a){e.$set(t,"zt",t.status.description),e.$set(t,"enableStatus",1==t.status.value?"停用":"启用")})),a.data}))}}},methods:{reset:function(){""!=this.queryParams.metaName&&(this.queryParams.metaName="")},Enable:function(e){var t=this;e.status.value=1==e.status.value?2:1,e.enableStatus=1==e.status.value?"停用":"启用";var a={id:e.id,status:e.status.value};Object(l["Bd"])(a).then((function(e){e.success?(t.$message.success("操作成功!"),t.handleOk()):t.$message.error("操作失败!")}))},addName:function(){this.$refs.addName.add()},handleOk:function(){this.$refs.table.refresh()},handleCancel:function(){this.form.resetFields(),this.visible=!1},goOpen:function(){this.isOpen=!this.isOpen,this.isOpen?this.queryParams.status=1:this.queryParams.status=2,this.handleOk()}}},d=o,u=(a("1f3a"),a("4d94"),a("2877")),f=Object(u["a"])(d,i,s,!1,null,"5907b976",null);t["default"]=f.exports},a5d7:function(e,t,a){},b3b1:function(e,t,a){"use strict";a("d6cf")},ce8a:function(e,t,a){},d6cf:function(e,t,a){},e193:function(e,t,a){"use strict";a("ce8a")},e5ef:function(e,t,a){},eb8e:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:e.title,width:1e3,height:650,visible:e.visible,confirmLoading:!1},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-card",{staticClass:"card-top-pac",attrs:{bordered:!1}},[a("div",{staticClass:"table-page-wrapper",staticStyle:{"margin-top":"-1%"}},[a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 名单描述 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"20%","margin-left":"2%"},attrs:{maxLength:30,"allow-clear":"",placeholder:"请输入内容"},on:{blur:function(t){return e.changeName()},keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.changeName()},search:function(t){return e.changeName()}},model:{value:e.metaName,callback:function(t){e.metaName=t},expression:"metaName"}}),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"10%"}},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 数据库表 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"20%","margin-left":"2%"},attrs:{maxLength:30,"allow-clear":""},on:{blur:function(t){return e.focus()},keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.focus()},search:function(t){return e.focus()}},model:{value:e.queryParam.databaseTableName,callback:function(t){e.$set(e.queryParam,"databaseTableName",t)},expression:"queryParam.databaseTableName"}}),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"10%"}},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 状态 :")]),a("a-switch",{staticStyle:{"margin-left":"1%"},attrs:{checked:e.isOpen},on:{click:e.Enable}})],1),a("div",{staticClass:"div-line-wrap"},[a("span",{directives:[{name:"show",rawName:"v-show",value:e.failShow,expression:"failShow"}],staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red","margin-left":"45%"}},[e._v("当前表名不符合名单建立要求,请重新选择")])])])]),a("a-table",{ref:"table",staticStyle:{"margin-top":"2%","overflow-y":"auto",height:"500px"},attrs:{size:"default",scroll:{y:400,x:0},pagination:!1,"data-source":e.loadData,columns:e.columns,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"show",fn:function(t,i){return a("span",{},[a("a-checkbox",{on:{change:function(t){return e.shwoChange(i)}},model:{value:i.show,callback:function(t){e.$set(i,"show",t)},expression:"record.show"}})],1)}},{key:"index",fn:function(t,i){return a("span",{},[a("a-checkbox",{on:{change:function(t){return e.isOnlyIndex(i)}},model:{value:i.wysy,callback:function(t){e.$set(i,"wysy",t)},expression:"record.wysy"}})],1)}},{key:"eleDes",fn:function(t,i){return a("span",{},[null!=i.defaultField&&2==i.defaultField.value?a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"110px","margin-right":"20px"},attrs:{maxLength:30,"allow-clear":""},on:{blur:function(t){return e.changeDes(i)}},model:{value:i.fieldComment,callback:function(t){e.$set(i,"fieldComment",t)},expression:"record.fieldComment"}}):e._e(),null!=i.defaultField&&1==i.defaultField.value?a("span",[e._v(e._s(null!=i.fieldComment?i.fieldComment:""))]):e._e()],1)}},{key:"fileDes",fn:function(t,i){return a("span",{},[null!=i.defaultField&&2==i.defaultField.value?a("a-select",{staticStyle:{width:"110px","margin-right":"20px"},on:{select:function(t){return e.selectDes(i)}},model:{value:i.fieldArchives.description,callback:function(t){e.$set(i.fieldArchives,"description",t)},expression:"record.fieldArchives.description"}},e._l(e.dazdList,(function(t,i){return a("a-select-option",{key:i,attrs:{value:t.code}},[e._v(e._s(t.value))])})),1):e._e(),null!=i.defaultField&&1==i.defaultField.value?a("span",[e._v(e._s(null!=i.fieldArchives?i.fieldArchives.description:""))]):e._e()],1)}}])})],1)],1)},s=[],n=(a("d3b7"),a("4de4"),a("159b"),a("a4d3"),a("e01a"),a("4cab")),l=a("2af9"),c={components:{STable:l["s"]},data:function(){return{clickTtime:(new Date).getTime(),failShow:!1,title:"新增名单",loadData:[],id:"",isOpen:!1,record:{},metaName:"",queryParam:{databaseTableName:"",metaName:""},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,detailList:[],confirmLoading:!1,form:this.$form.createForm(this),dazdList:[{code:0,value:"无"},{code:1,value:"紧急联系人"},{code:2,value:"紧急电话"},{code:3,value:"微信OpenID"}],columns:[{title:"字段编码",dataIndex:"zdbm"},{title:"字段描述",scopedSlots:{customRender:"eleDes"}},{title:"字段类型",dataIndex:"zdlx",width:100},{title:"字段大小",dataIndex:"fieldLength",width:100},{title:"默认值",dataIndex:"DefaultValue",width:100},{title:"档案字段",scopedSlots:{customRender:"fileDes"}},{title:"显示",dataIndex:"show",scopedSlots:{customRender:"show"},width:80},{title:"唯一索引",dataIndex:"index",scopedSlots:{customRender:"index"},width:100}]}},methods:{add:function(){this.visible=!0,this.loadData=null,this.failShow=!1,this.queryParam.databaseTableName=null,this.metaName=""},quryCheckDetail:function(e){var t=this;this.confirmLoading=!0,Object(n["l"])(e).then((function(e){if(t.confirmLoading=!1,0==e.code&&e.data.length>0){t.failShow=!1;var a=e.data[0];t.id=a.id,t.queryParam.metaName=a.metaName,a.detail=a.detail.filter((function(e){return"id"!=e.tableField})),a.detail.forEach((function(e,a){t.$set(e,"zdbm",e.tableField),t.$set(e,"zdlx",null!=e.fieldType?e.fieldType.description:""),null==e.fieldArchives&&t.$set(e,"fieldArchives",{description:""}),t.$set(e,"show",null!=e.showStatus&&1==e.showStatus.value),t.$set(e,"wysy",null!=e.uniqueIndexStatus&&1==e.uniqueIndexStatus.value),t.$set(e,"DefaultValue",null!=e.fieldDefaultValue?e.fieldDefaultValue:"")})),t.detailList=a.detail,t.loadData=a.detail}else t.failShow=!0,t.detailList=null,t.loadData=null;return[]})).finally((function(e){t.confirmLoading=!1}))},focus:function(){var e={databaseTableName:this.queryParam.databaseTableName};this.quryCheckDetail(e)},changeName:function(){this.id,this.metaName},changeDes:function(e){this.id,e.id,e.fieldComment},selectDes:function(e){},updateMetaConfigure:function(e){var t=this;this.confirmLoading=!0,Object(n["Bd"])(e).then((function(e){e.success?t.$emit("ok"):t.$message.error("编辑失败："+e.message),t.confirmLoading=!1})).finally((function(e){t.confirmLoading=!1}))},saveMetaConfigureOut:function(e){var t=this;this.confirmLoading=!0,Object(n["ad"])(e).then((function(e){e.success?(t.$message.success("新增成功"),t.$emit("ok"),t.visible=!1):t.$message.error("新增失败："+e.message)})).finally((function(e){t.confirmLoading=!1}))},shwoChange:function(e){e.showStatus.value},isOnlyIndex:function(e){1==e.uniqueIndexStatus.value?this.onlyIndex=!0:this.onlyIndex=!1},Enable:function(){this.isOpen=!this.isOpen;this.id,this.isOpen},handleCancel:function(){this.form.resetFields(),this.visible=!1},handleSubmit:function(){var e=this,t=JSON.parse(JSON.stringify(this.detailList));t.forEach((function(t,a){t.defaultField=null!=t.defaultField?t.defaultField.value:2,t.fieldComment=t.fieldComment;var i=0;null!=t.fieldArchives?("紧急联系人"===t.fieldArchives.description||1==t.fieldArchives.description?i=1:"紧急电话"===t.fieldArchives.description||2==t.fieldArchives.description?i=2:"无"!==t.fieldArchives.description&&0!=t.fieldArchives.description||(i=0),t.fieldArchives=null!=t.fieldArchives?i:""):t.fieldArchives=null!=t.fieldArchives?t.fieldArchives.description:"",t.status=e.isOpen?1:2,t.fieldType=t.fieldType.value,t.showStatus=t.show?1:2,t.uniqueIndexStatus=t.wysy?1:2,t.metaName=e.metaName}));var a={status:this.isOpen?1:2,databaseTableName:this.queryParam.databaseTableName,metaName:this.metaName,detail:t};if(this.repeatclickFun()){if(null==a.metaName||""==a.metaName)return void this.$message.error("请输入名单描述!");this.saveMetaConfigureOut(a)}else this.$message.error("请勿重复操作!")},repeatclickFun:function(){var e=Date.now()-this.clickTtime;return this.clickTtime=Date.now(),!(e>0&&e<=500)}}},r=c,o=(a("e193"),a("2877")),d=Object(o["a"])(r,i,s,!1,null,null,null);t["default"]=d.exports}}]);