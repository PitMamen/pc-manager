(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-23763956","chunk-37df27bc","chunk-11ec2634"],{"0a1c":function(e,t,a){},"126f":function(e,t,a){"use strict";a.d(t,"e",(function(){return s})),a.d(t,"a",(function(){return n})),a.d(t,"d",(function(){return i})),a.d(t,"b",(function(){return o})),a.d(t,"c",(function(){return c}));var r=a("b775");function s(e){return Object(r["b"])({url:"/info-api/sysDictType/page",method:"get",params:e})}function n(e){return Object(r["b"])({url:"/info-api/sysDictType/add",method:"post",data:e})}function i(e){return Object(r["b"])({url:"/info-api/sysDictType/edit",method:"post",data:e})}function o(e){return Object(r["b"])({url:"/info-api/sysDictType/delete",method:"post",data:e})}function c(e){return Object(r["b"])({url:"/info-api/sysDictType/dropDown",method:"get",params:e})}},2316:function(e,t,a){"use strict";a.d(t,"a",(function(){return s})),a.d(t,"b",(function(){return n})),a.d(t,"d",(function(){return i})),a.d(t,"c",(function(){return o})),a.d(t,"e",(function(){return c}));var r=a("b775");function s(e){return Object(r["b"])({url:"/sysApp/page",method:"get",params:e})}function n(e){return Object(r["b"])({url:"/sysApp/add",method:"post",data:e})}function i(e){return Object(r["b"])({url:"/sysApp/edit",method:"post",data:e})}function o(e){return Object(r["b"])({url:"/sysApp/delete",method:"post",data:e})}function c(e){return Object(r["b"])({url:"/sysApp/setAsDefault",method:"post",data:e})}},"316e":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"新增应用",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{staticStyle:{display:"none"},attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["active"],expression:"['active']"}]})],1),a("a-form-item",{attrs:{label:"应用名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"请输入应用名称！"}]}],expression:"['name', {rules: [{required: true,  message: '请输入应用名称！'}]}]"}],attrs:{placeholder:"请输入应用名称"}})],1),a("a-form-item",{attrs:{label:"唯一编码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["code",{rules:[{required:!0,message:"请输入唯一编码！"}]}],expression:"['code', {rules: [{required: true, message: '请输入唯一编码！'}]}]"}],attrs:{placeholder:"请输入唯一编码"}})],1)],1)],1)],1)},s=[],n=(a("d3b7"),a("2316")),i={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},methods:{add:function(){this.visible=!0,this.form.getFieldDecorator("active",{initialValue:"N"})},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){t?e.confirmLoading=!1:Object(n["b"])(a).then((function(t){e.confirmLoading=!1,t.success?(e.$message.success("新增成功"),e.handleCancel(),e.$emit("ok",a)):e.$message.error("新增失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},o=i,c=a("2877"),l=Object(c["a"])(o,r,s,!1,null,null,null);t["default"]=l.exports},"4fb0":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{attrs:{bordered:!1}},[a("a-spin",{attrs:{spinning:e.loading}},[e.hasPerm("sysApp:page")?a("div",{staticClass:"table-page-search-wrapper"},[a("a-form",{attrs:{layout:"inline"}},[a("a-row",{attrs:{gutter:48}},[a("a-col",{attrs:{md:8,sm:24}},[a("a-form-item",{attrs:{label:"应用名称"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入应用名称"},model:{value:e.queryParam.name,callback:function(t){e.$set(e.queryParam,"name",t)},expression:"queryParam.name"}})],1)],1),a("a-col",{attrs:{md:8,sm:24}},[a("a-form-item",{attrs:{label:"唯一编码"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入唯一编码"},model:{value:e.queryParam.code,callback:function(t){e.$set(e.queryParam,"code",t)},expression:"queryParam.code"}})],1)],1),a("a-col",{attrs:{md:8,sm:24}},[a("span",{staticClass:"table-page-search-submitButtons"},[a("a-button",{attrs:{type:"primary"},on:{click:function(t){return e.$refs.table.refresh(!0)}}},[e._v("查询")]),a("a-button",{staticStyle:{"margin-left":"8px"},on:{click:function(){return e.queryParam={}}}},[e._v("重置")])],1)])],1)],1)],1):e._e(),e.hasPerm("sysApp:add")?a("div",{staticClass:"table-operator"},[e.hasPerm("sysApp:add")?a("a-button",{attrs:{type:"primary",icon:"plus"},on:{click:function(t){return e.$refs.addForm.add()}}},[e._v("新增应用")]):e._e()],1):e._e(),a("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.id},rowSelection:{selectedRowKeys:e.selectedRowKeys,onChange:e.onChange}},scopedSlots:e._u([{key:"active",fn:function(t){return a("span",{},[e._v(" "+e._s(e.activeFilter(t))+" ")])}},{key:"status",fn:function(t){return a("span",{},[e._v(" "+e._s(e.statusFilter(t))+" ")])}},{key:"action",fn:function(t,r){return a("span",{},[e.hasPerm("sysApp:edit")?a("a",{on:{click:function(t){return e.$refs.editForm.edit(r)}}},[e._v("编辑")]):e._e(),e.hasPerm("sysApp:edit")&e.hasPerm("sysApp:delete")?a("a-divider",{attrs:{type:"vertical"}}):e._e(),e.hasPerm("sysApp:delete")?a("a-popconfirm",{attrs:{placement:"topRight",title:"确认删除？"},on:{confirm:function(){return e.sysAppDelete(r)}}},[a("a",[e._v("删除")])]):e._e(),e.hasPerm("sysApp:setAsDefault")&e.hasPerm("sysApp:delete")&"N"==r.active||e.hasPerm("sysApp:edit")&e.hasPerm("sysApp:setAsDefault")&"N"==r.active?a("a-divider",{attrs:{type:"vertical"}}):e._e(),e.hasPerm("sysApp:setAsDefault")&"N"==r.active?a("a-popconfirm",{attrs:{placement:"topRight",title:"设置为默认应用？"},on:{confirm:function(){return e.sysDefault(r)}}},[a("a",[e._v("设为默认")])]):e._e()],1)}}])}),a("add-form",{ref:"addForm",on:{ok:e.handleOk}}),a("edit-form",{ref:"editForm",on:{ok:e.handleOk}})],1)],1)},s=[],n=(a("4de4"),a("d3b7"),a("2af9")),i=a("2316"),o=a("126f"),c=a("6b52"),l=a("316e"),u={components:{STable:n["s"],editForm:c["default"],addForm:l["default"]},data:function(){var e=this;return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:16}},queryParam:{},columns:[{title:"应用名称",dataIndex:"name"},{title:"唯一编码",dataIndex:"code"},{title:"是否默认",dataIndex:"active",scopedSlots:{customRender:"active"}},{title:"状态",dataIndex:"status",scopedSlots:{customRender:"status"}}],loadData:function(t){return Object(i["a"])(Object.assign(t,e.queryParam)).then((function(e){return e.data}))},loading:!1,selectedRowKeys:[],selectedRows:[],statusDict:[],activeDict:[]}},created:function(){this.sysDictTypeDropDown(),(this.hasPerm("sysApp:edit")||this.hasPerm("sysApp:delete")||this.hasPerm("sysApp:setAsDefault"))&&this.columns.push({title:"操作",width:"200px",dataIndex:"action",scopedSlots:{customRender:"action"}})},methods:{activeFilter:function(e){var t=this.activeDict.filter((function(t){return t.code==e}));if(t.length>0)return t[0].value},statusFilter:function(e){var t=this.statusDict.filter((function(t){return t.code==e}));if(t.length>0)return t[0].value},sysDictTypeDropDown:function(){var e=this;Object(o["c"])({code:"yes_or_no"}).then((function(t){e.activeDict=t.data})),Object(o["c"])({code:"common_status"}).then((function(t){e.statusDict=t.data}))},handleOk:function(){this.$refs.table.refresh()},sysDefault:function(e){var t=this;this.loading=!0,Object(i["e"])({id:e.id}).then((function(e){t.loading=!1,e.success?(t.$message.success("设置成功"),t.$refs.table.refresh()):t.$message.error("设置失败："+e.message)}))},sysAppDelete:function(e){var t=this;this.loading=!0,Object(i["c"])(e).then((function(e){t.loading=!1,e.success?(t.$message.success("删除成功"),t.$refs.table.refresh()):t.$message.error("删除失败："+e.message)})).catch((function(e){t.$message.error("删除错误："+e.message)}))},onChange:function(e,t){this.selectedRowKeys=e,this.selectedRows=t}}},d=u,m=(a("70a0"),a("2877")),p=Object(m["a"])(d,r,s,!1,null,"d731c6b2",null);t["default"]=p.exports},"6b52":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"应用编辑",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{staticStyle:{display:"none"},attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["id"],expression:"['id']"}]})],1),a("a-form-item",{staticStyle:{display:"none"},attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["active"],expression:"['active']"}]})],1),a("a-form-item",{attrs:{label:"应用名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"请输入应用名称！"}]}],expression:"['name', {rules: [{required: true,  message: '请输入应用名称！'}]}]"}],attrs:{placeholder:"请输入应用名称"}})],1),a("a-form-item",{attrs:{label:"唯一编码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["code",{rules:[{required:!0,message:"请输入唯一编码！"}]}],expression:"['code', {rules: [{required: true, message: '请输入唯一编码！'}]}]"}],attrs:{placeholder:"请输入唯一编码"}})],1)],1)],1)],1)},s=[],n=(a("b0c0"),a("d3b7"),a("2316")),i={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,visibleDef:!1,form:this.$form.createForm(this)}},methods:{edit:function(e){var t=this;this.visible=!0,setTimeout((function(){t.form.setFieldsValue({id:e.id,name:e.name,code:e.code,active:e.active})}),100)},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){t?e.confirmLoading=!1:Object(n["d"])(a).then((function(t){t.success?(e.$message.success("编辑成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",a)):e.$message.error("编辑失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},o=i,c=a("2877"),l=Object(c["a"])(o,r,s,!1,null,null,null);t["default"]=l.exports},"70a0":function(e,t,a){"use strict";a("0a1c")}}]);