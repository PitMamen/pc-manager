(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7dfafe84"],{ce8a:function(e,t,a){},e193:function(e,t,a){"use strict";a("ce8a")},eb8e:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:e.title,width:1e3,height:650,visible:e.visible,confirmLoading:!1},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-card",{staticClass:"card-top-pac",attrs:{bordered:!1}},[a("div",{staticClass:"table-page-wrapper",staticStyle:{"margin-top":"-1%"}},[a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 名单描述 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"20%","margin-left":"2%"},attrs:{maxLength:30,"allow-clear":"",placeholder:"请输入内容"},on:{blur:function(t){return e.changeName()},keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.changeName()},search:function(t){return e.changeName()}},model:{value:e.metaName,callback:function(t){e.metaName=t},expression:"metaName"}}),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"10%"}},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 数据库表 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"20%","margin-left":"2%"},attrs:{maxLength:30,"allow-clear":""},on:{blur:function(t){return e.focus()},keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.focus()},search:function(t){return e.focus()}},model:{value:e.queryParam.databaseTableName,callback:function(t){e.$set(e.queryParam,"databaseTableName",t)},expression:"queryParam.databaseTableName"}}),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"10%"}},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 状态 :")]),a("a-switch",{staticStyle:{"margin-left":"1%"},attrs:{checked:e.isOpen},on:{click:e.Enable}})],1),a("div",{staticClass:"div-line-wrap"},[a("span",{directives:[{name:"show",rawName:"v-show",value:e.failShow,expression:"failShow"}],staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red","margin-left":"45%"}},[e._v("当前表名不符合名单建立要求,请重新选择")])])])]),a("a-table",{ref:"table",staticStyle:{"margin-top":"2%","overflow-y":"auto",height:"500px"},attrs:{size:"default",scroll:{y:400,x:600},pagination:!1,"data-source":e.loadData,columns:e.columns,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"show",fn:function(t,i){return a("span",{},[a("a-checkbox",{on:{change:function(t){return e.shwoChange(i)}},model:{value:i.show,callback:function(t){e.$set(i,"show",t)},expression:"record.show"}})],1)}},{key:"index",fn:function(t,i){return a("span",{},[a("a-checkbox",{on:{change:function(t){return e.isOnlyIndex(i)}},model:{value:i.wysy,callback:function(t){e.$set(i,"wysy",t)},expression:"record.wysy"}})],1)}},{key:"eleDes",fn:function(t,i){return a("span",{},[null!=i.defaultField&&2==i.defaultField.value?a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"110px","margin-right":"20px"},attrs:{maxLength:30,"allow-clear":""},on:{blur:function(t){return e.changeDes(i)}},model:{value:i.fieldComment,callback:function(t){e.$set(i,"fieldComment",t)},expression:"record.fieldComment"}}):e._e(),null!=i.defaultField&&1==i.defaultField.value?a("span",[e._v(e._s(null!=i.fieldComment?i.fieldComment:""))]):e._e()],1)}},{key:"fileDes",fn:function(t,i){return a("span",{},[null!=i.defaultField&&2==i.defaultField.value?a("a-select",{staticStyle:{width:"110px","margin-right":"20px"},on:{select:function(t){return e.selectDes(i)}},model:{value:i.fieldArchives.description,callback:function(t){e.$set(i.fieldArchives,"description",t)},expression:"record.fieldArchives.description"}},e._l(e.dazdList,(function(t,i){return a("a-select-option",{key:i,attrs:{value:t.code}},[e._v(e._s(t.value))])})),1):e._e(),null!=i.defaultField&&1==i.defaultField.value?a("span",[e._v(e._s(null!=i.fieldArchives?i.fieldArchives.description:""))]):e._e()],1)}}])})],1)],1)},n=[],l=(a("d3b7"),a("4de4"),a("159b"),a("a4d3"),a("e01a"),a("4cab")),s=a("2af9"),c={components:{STable:s["s"]},data:function(){return{clickTtime:(new Date).getTime(),failShow:!1,title:"新增名单",loadData:[],id:"",isOpen:!1,record:{},metaName:"",queryParam:{databaseTableName:"",metaName:""},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,detailList:[],confirmLoading:!1,form:this.$form.createForm(this),dazdList:[{code:0,value:"无"},{code:1,value:"紧急联系人"},{code:2,value:"紧急电话"},{code:3,value:"微信OpenID"}],columns:[{title:"字段编码",dataIndex:"zdbm"},{title:"字段描述",scopedSlots:{customRender:"eleDes"}},{title:"字段类型",dataIndex:"zdlx",width:100},{title:"字段大小",dataIndex:"fieldLength",width:100},{title:"默认值",dataIndex:"DefaultValue",width:100},{title:"档案字段",scopedSlots:{customRender:"fileDes"}},{title:"显示",dataIndex:"show",scopedSlots:{customRender:"show"},width:80},{title:"唯一索引",dataIndex:"index",scopedSlots:{customRender:"index"},width:100}]}},methods:{add:function(){this.visible=!0,this.loadData=null,this.failShow=!1,this.queryParam.databaseTableName=null,this.metaName=""},quryCheckDetail:function(e){var t=this;this.confirmLoading=!0,Object(l["l"])(e).then((function(e){if(t.confirmLoading=!1,0==e.code&&e.data.length>0){t.failShow=!1;var a=e.data[0];t.id=a.id,t.queryParam.metaName=a.metaName,a.detail=a.detail.filter((function(e){return"id"!=e.tableField})),a.detail.forEach((function(e,a){t.$set(e,"zdbm",e.tableField),t.$set(e,"zdlx",null!=e.fieldType?e.fieldType.description:""),null==e.fieldArchives&&t.$set(e,"fieldArchives",{description:""}),t.$set(e,"show",null!=e.showStatus&&1==e.showStatus.value),t.$set(e,"wysy",null!=e.uniqueIndexStatus&&1==e.uniqueIndexStatus.value),t.$set(e,"DefaultValue",null!=e.fieldDefaultValue?e.fieldDefaultValue:"")})),t.detailList=a.detail,t.loadData=a.detail}else t.failShow=!0,t.detailList=null,t.loadData=null;return[]})).finally((function(e){t.confirmLoading=!1}))},focus:function(){var e={databaseTableName:this.queryParam.databaseTableName};this.quryCheckDetail(e)},changeName:function(){this.id,this.metaName},changeDes:function(e){this.id,e.id,e.fieldComment},selectDes:function(e){},updateMetaConfigure:function(e){var t=this;this.confirmLoading=!0,Object(l["nd"])(e).then((function(e){e.success?t.$emit("ok"):t.$message.error("编辑失败："+e.message),t.confirmLoading=!1})).finally((function(e){t.confirmLoading=!1}))},saveMetaConfigureOut:function(e){var t=this;this.confirmLoading=!0,Object(l["Oc"])(e).then((function(e){e.success?(t.$message.success("新增成功"),t.$emit("ok"),t.visible=!1):t.$message.error("新增失败："+e.message)})).finally((function(e){t.confirmLoading=!1}))},shwoChange:function(e){e.showStatus.value},isOnlyIndex:function(e){1==e.uniqueIndexStatus.value?this.onlyIndex=!0:this.onlyIndex=!1},Enable:function(){this.isOpen=!this.isOpen;var e={id:this.id,status:this.isOpen?1:2};this.updateMetaConfigure(e)},handleCancel:function(){this.form.resetFields(),this.visible=!1},handleSubmit:function(){var e=this,t=JSON.parse(JSON.stringify(this.detailList));t.forEach((function(t,a){t.defaultField=null!=t.defaultField?t.defaultField.value:2,t.fieldComment=t.fieldComment;var i=0;null!=t.fieldArchives?("紧急联系人"===t.fieldArchives.description||1==t.fieldArchives.description?i=1:"紧急电话"===t.fieldArchives.description||2==t.fieldArchives.description?i=2:"无"!==t.fieldArchives.description&&0!=t.fieldArchives.description||(i=0),t.fieldArchives=null!=t.fieldArchives?i:""):t.fieldArchives=null!=t.fieldArchives?t.fieldArchives.description:"",t.fieldType=t.fieldType.value,t.showStatus=t.show?1:2,t.uniqueIndexStatus=t.wysy?1:2,t.metaName=e.metaName}));var a={status:this.isOpen?1:2,databaseTableName:this.queryParam.databaseTableName,metaName:this.metaName,detail:t};if(this.repeatclickFun()){if(null==a.metaName||""==a.metaName)return void this.$message.error("请输入名单描述!");this.saveMetaConfigureOut(a)}else this.$message.error("请勿重复操作!")},repeatclickFun:function(){var e=Date.now()-this.clickTtime;return this.clickTtime=Date.now(),!(e>0&&e<=500)}}},o=c,d=(a("e193"),a("2877")),r=Object(d["a"])(o,i,n,!1,null,null,null);t["default"]=r.exports}}]);