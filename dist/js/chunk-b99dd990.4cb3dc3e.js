(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-b99dd990"],{"02f9":function(t,e,a){},7440:function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-card",{staticClass:"card-right-pac",attrs:{bordered:!1,confirmLoading:t.confirmLoading}},[a("div",{staticClass:"table-page-search-wrapper"},[a("a-form",{attrs:{layout:"inline"}},[a("a-row",{attrs:{gutter:48}},[a("a-col",{attrs:{md:6,sm:24}},[a("a-form-item",{attrs:{label:"查询条件"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"可输入模板名称查询"},on:{blur:function(e){return t.$refs.table.refresh(!0)},keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.$refs.table.refresh(!0)},search:function(e){return t.$refs.table.refresh(!0)}},model:{value:t.queryParams.templateTitle,callback:function(e){t.$set(t.queryParams,"templateTitle",e)},expression:"queryParams.templateTitle"}})],1)],1),a("a-col",{attrs:{md:10,sm:24}},[a("a-button",{staticStyle:{"margin-left":"20%"},attrs:{type:"primary",icon:"search"},on:{click:function(e){return t.$refs.table.refresh(!0)}}},[t._v("查询")]),a("a-button",{staticStyle:{"margin-left":"10%"},attrs:{type:"primary",icon:"reload"},on:{click:function(e){return t.reset()}}},[t._v("重置")])],1)],1)],1),a("div",{staticClass:"div-divider"}),a("a-button",{staticStyle:{"margin-left":"90%","margin-bottom":"1%"},attrs:{type:"primary",icon:"plus"},on:{click:function(e){return t.addModel()}}},[t._v("新增")])],1),a("s-table",{ref:"table",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.code}},scopedSlots:t._u([{key:"action",fn:function(e,n){return a("span",{},[a("a",{attrs:{disabled:2==n.templateStatus},on:{click:function(e){return t.changeModel(n)}}},[t._v("修改")]),a("a-divider",{attrs:{type:"vertical"}}),a("a",{on:{click:function(e){return t.Enable(n)}}},[t._v(t._s(n.enableStatus))])],1)}}])})],1)},r=[],s=(a("d3b7"),a("159b"),a("2af9")),i=a("4cab"),l={components:{STable:s["s"]},data:function(){var t=this;return{datas:[],keshiData:[],queryParams:{templateTitle:""},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this),columns:[{title:"模板名称",dataIndex:"templateTitle"},{title:"内部编码",dataIndex:"templateInsideCode"},{title:"微信平台模板ID",dataIndex:"templateId"},{title:"模板内容",dataIndex:"templateContent"},{title:"状态",dataIndex:"zt",width:80},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(e){return Object(i["Sb"])(Object.assign(e,t.queryParams)).then((function(a){var n={pageNo:e.pageNo,pageSize:e.pageSize,totalRows:a.data.total,totalPage:a.data.pages/e.pageSize,rows:a.data.records};return n.rows.forEach((function(e,a){t.$set(e,"zt",1==e.templateStatus?"正常":"停用"),t.$set(e,"enableStatus",1==e.templateStatus?"停用":"启用")})),n}))}}},methods:{reset:function(){""!=this.queryParams.templateTitle&&(this.queryParams.templateTitle="")},Enable:function(t){var e=this;t.templateStatus=1==t.templateStatus?2:1,t.enableStatus=1==t.templateStatus?"停用":"启用";var a={id:t.id,templateStatus:t.templateStatus};this.confirmLoading=!0,Object(i["k"])(a).then((function(t){t.success?(e.confirmLoading=!1,e.$message.success("操作成功!"),e.handleOk()):e.$message.error("编辑失败："+t.message)}))},addModel:function(){this.$router.push({name:"sys_wxtemplate_add",query:{}})},changeModel:function(t){this.$router.push({name:"sys_wxtemplate_add",query:{id:t.id}})},handleOk:function(){this.$refs.table.refresh()},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},o=l,c=(a("ee4a"),a("2877")),u=Object(c["a"])(o,n,r,!1,null,null,null);e["default"]=u.exports},ee4a:function(t,e,a){"use strict";a("02f9")}}]);