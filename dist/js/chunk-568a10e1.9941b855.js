(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-568a10e1","chunk-590d66ea","chunk-5b5e3f79","chunk-51eafcd7","chunk-01b737a6"],{"126f":function(e,t,a){"use strict";a.d(t,"e",(function(){return n})),a.d(t,"a",(function(){return o})),a.d(t,"d",(function(){return s})),a.d(t,"b",(function(){return i})),a.d(t,"c",(function(){return l}));var r=a("b775");function n(e){return Object(r["b"])({url:"/info-api/sysDictType/page",method:"get",params:e})}function o(e){return Object(r["b"])({url:"/info-api/sysDictType/add",method:"post",data:e})}function s(e){return Object(r["b"])({url:"/info-api/sysDictType/edit",method:"post",data:e})}function i(e){return Object(r["b"])({url:"/info-api/sysDictType/delete",method:"post",data:e})}function l(e){return Object(r["b"])({url:"/info-api/sysDictType/dropDown",method:"get",params:e})}},"25fa":function(e,t,a){"use strict";a.d(t,"b",(function(){return n})),a.d(t,"a",(function(){return o}));var r=a("b775");function n(e){return Object(r["b"])({url:"/sysOrg/tree",method:"get",params:e})}function o(e){return Object(r["b"])({url:"/sysOrg/list",method:"get",params:e})}},"50e7":function(e,t,a){},"70eb":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{attrs:{bordered:!1}},[e.hasPerm("sysRole:page")?a("div",{staticClass:"table-page-search-wrapper"},[a("a-form",{attrs:{layout:"inline"}},[a("a-row",{attrs:{gutter:48}},[a("a-col",{attrs:{md:8,sm:24}},[a("a-form-item",{attrs:{label:"角色名"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入角色名"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$refs.table.refresh(!0)}},model:{value:e.queryParam.name,callback:function(t){e.$set(e.queryParam,"name",t)},expression:"queryParam.name"}})],1)],1),a("a-col",{attrs:{md:8,sm:24}},[a("a-form-item",{attrs:{label:"唯一编码"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入唯一编码"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$refs.table.refresh(!0)}},model:{value:e.queryParam.code,callback:function(t){e.$set(e.queryParam,"code",t)},expression:"queryParam.code"}})],1)],1),a("a-col",{attrs:{md:8,sm:24}},[a("a-button",{attrs:{type:"primary"},on:{click:function(t){return e.$refs.table.refresh(!0)}}},[e._v("查询")]),a("a-button",{staticStyle:{"margin-left":"8px"},on:{click:function(){return e.queryParam={}}}},[e._v("重置")])],1)],1)],1)],1):e._e(),e.hasPerm("sysRole:add")?a("div",{staticClass:"table-operator"},[e.hasPerm("sysRole:add")?a("a-button",{attrs:{type:"primary",icon:"plus"},on:{click:function(t){return e.$refs.addForm.add()}}},[e._v("新增角色")]):e._e()],1):e._e(),a("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.code},rowSelection:{selectedRowKeys:e.selectedRowKeys,onChange:e.onSelectChange}},scopedSlots:e._u([{key:"action",fn:function(t,r){return a("span",{},[e.hasPerm("sysRole:edit")?a("a",{on:{click:function(t){return e.$refs.editForm.edit(r)}}},[e._v("编辑")]):e._e(),e.hasPerm("sysRole:edit")?a("a-divider",{attrs:{type:"vertical"}}):e._e(),e.hasPerm("sysRole:grantMenu")||e.hasPerm("sysRole:grantData")||e.hasPerm("sysRole:delete")?a("a-dropdown",[a("a",{staticClass:"ant-dropdown-link"},[e._v(" 更多 "),a("a-icon",{attrs:{type:"down"}})],1),a("a-menu",{attrs:{slot:"overlay"},slot:"overlay"},[e.hasPerm("sysRole:grantMenu")?a("a-menu-item",[a("a",{on:{click:function(t){return e.$refs.roleMenuForm.roleMenu(r)}}},[e._v("授权菜单")])]):e._e(),e.hasPerm("sysRole:grantData")?a("a-menu-item",[a("a",{on:{click:function(t){return e.$refs.roleOrgForm.roleOrg(r)}}},[e._v("授权数据")])]):e._e(),e.hasPerm("sysRole:delete")?a("a-menu-item",[a("a-popconfirm",{attrs:{placement:"topRight",title:"确认删除？"},on:{confirm:function(){return e.sysRoleDelete(r)}}},[a("a",[e._v("删除")])])],1):e._e()],1)],1):e._e()],1)}}])}),a("add-form",{ref:"addForm",on:{ok:e.handleOk}}),a("edit-form",{ref:"editForm",on:{ok:e.handleOk}}),a("role-menu-form",{ref:"roleMenuForm",on:{ok:e.handleOk}}),a("role-org-form",{ref:"roleOrgForm",on:{ok:e.handleOk}})],1)},n=[],o=a("2af9"),s=a("a240"),i=a("a49c"),l=a("9888"),c=a("985f"),d=a("e35e"),u={components:{STable:o["s"],addForm:i["default"],editForm:l["default"],roleMenuForm:c["default"],roleOrgForm:d["default"]},data:function(){var e=this;return{queryParam:{},columns:[{title:"角色名",dataIndex:"name"},{title:"唯一编码",dataIndex:"code"},{title:"排序",dataIndex:"sort"}],loadData:function(t){return Object(s["a"])(Object.assign(t,e.queryParam)).then((function(e){return e.data}))},selectedRowKeys:[],selectedRows:[]}},created:function(){(this.hasPerm("sysRole:edit")||this.hasPerm("sysRole:grantMenu")||this.hasPerm("sysRole:grantData")||this.hasPerm("sysRole:delete"))&&this.columns.push({title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}})},methods:{sysRoleDelete:function(e){var t=this;Object(s["c"])(e).then((function(e){e.success?(t.$message.success("删除成功"),t.$refs.table.refresh()):t.$message.error("删除失败："+e.message)})).catch((function(e){t.$message.error("删除错误："+e.message)}))},handleOk:function(){this.$refs.table.refresh()},onSelectChange:function(e,t){this.selectedRowKeys=e,this.selectedRows=t}}},m=u,f=(a("d6a3"),a("2877")),p=Object(f["a"])(m,r,n,!1,null,null,null);t["default"]=p.exports},"985f":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"授权菜单",width:600,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.formLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"菜单权限",labelCol:e.labelCol,wrapperCol:e.wrapperCol}},[a("a-tree",{attrs:{multiple:"",checkable:"",checkStrictly:"","auto-expand-parent":e.autoExpandParent,"expanded-keys":e.expandedKeys,"tree-data":e.menuTreeData,"selected-keys":e.selectedKeys,replaceFields:e.replaceFields},on:{expand:e.onExpand,select:e.onSelect,check:e.treeCheck},model:{value:e.checkedKeys,callback:function(t){e.checkedKeys=t},expression:"checkedKeys"}})],1)],1)],1)],1)},n=[],o=(a("d3b7"),a("159b"),a("0bfe")),s=a("a240"),i={data:function(){return{labelCol:{style:{"padding-right":"20px"},xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},menuTreeData:[],expandedKeys:[],checkedKeys:[],visible:!1,confirmLoading:!1,formLoading:!0,autoExpandParent:!0,selectedKeys:[],subValues:[],roleEntity:[],replaceFields:{key:"id"},form:this.$form.createForm(this)}},methods:{roleMenu:function(e){this.formLoading=!0,this.roleEntity=e,this.visible=!0,this.getMenuTree(),this.expandedMenuKeys(e)},getMenuTree:function(){var e=this;Object(o["a"])().then((function(t){t.success&&(e.menuTreeData=t.data,e.menuTreeData.forEach((function(t){e.expandedKeys.push(t.id)})))}))},expandedMenuKeys:function(e){var t=this;Object(s["h"])({id:e.id}).then((function(e){e.success&&(t.checkedKeys=e.data),t.formLoading=!1}))},treeCheck:function(e){},onExpand:function(e){this.expandedKeys=e,this.autoExpandParent=!1},onCheck:function(e){this.checkedKeys=e},onSelect:function(e,t){this.selectedKeys=e},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){t?e.confirmLoading=!1:Object(s["f"])({id:e.roleEntity.id,grantMenuIdList:e.checkedKeys.checked}).then((function(t){t.success?(e.$message.success("授权成功"),e.confirmLoading=!1,e.$emit("ok",a),e.handleCancel()):e.$message.error("授权失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}))},handleCancel:function(){this.checkedKeys=[],this.expandedKeys=[],this.visible=!1}}},l=i,c=a("2877"),d=Object(c["a"])(l,r,n,!1,null,null,null);t["default"]=d.exports},9888:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"角色编辑",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{staticStyle:{display:"none"},attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["id"],expression:"['id']"}]})],1),a("a-form-item",{attrs:{label:"角色名",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"请输入角色名！"}]}],expression:"['name', {rules: [{required: true, message: '请输入角色名！'}]}]"}],attrs:{placeholder:"请输入角色名"}})],1),a("a-form-item",{attrs:{label:"唯一编码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["code",{rules:[{required:!0,message:"请输入唯一编码！"}]}],expression:"['code', {rules: [{required: true,  message: '请输入唯一编码！'}]}]"}],attrs:{placeholder:"请输入唯一编码"}})],1),a("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"排序","has-feedback":""}},[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["sort",{initialValue:100}],expression:"['sort', { initialValue: 100 }]"}],staticStyle:{width:"100%"},attrs:{placeholder:"请输入排序",min:1,max:1e3}})],1),a("a-form-item",{attrs:{label:"备注",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{rows:4,placeholder:"请输入备注"}})],1)],1)],1)],1)},n=[],o=(a("b0c0"),a("4e82"),a("d3b7"),a("a240")),s={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},methods:{edit:function(e){var t=this;this.visible=!0,setTimeout((function(){t.form.setFieldsValue({id:e.id,name:e.name,code:e.code,sort:e.sort,remark:e.remark})}),100)},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){t?e.confirmLoading=!1:Object(o["d"])(a).then((function(t){t.success?(e.$message.success("编辑成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",a),e.form.resetFields()):e.$message.error("编辑失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},i=s,l=a("2877"),c=Object(l["a"])(i,r,n,!1,null,null,null);t["default"]=c.exports},a240:function(e,t,a){"use strict";a.d(t,"a",(function(){return n})),a.d(t,"b",(function(){return o})),a.d(t,"d",(function(){return s})),a.d(t,"c",(function(){return i})),a.d(t,"h",(function(){return l})),a.d(t,"f",(function(){return c})),a.d(t,"g",(function(){return d})),a.d(t,"e",(function(){return u}));var r=a("b775");function n(e){return Object(r["b"])({url:"/sysRole/page",method:"get",params:e})}function o(e){return Object(r["b"])({url:"/sysRole/add",method:"post",data:e})}function s(e){return Object(r["b"])({url:"/sysRole/edit",method:"post",data:e})}function i(e){return Object(r["b"])({url:"/sysRole/delete",method:"post",data:e})}function l(e){return Object(r["b"])({url:"/sysRole/ownMenu",method:"get",params:e})}function c(e){return Object(r["b"])({url:"/sysRole/grantMenu",method:"post",data:e})}function d(e){return Object(r["b"])({url:"/sysRole/ownData",method:"get",params:e})}function u(e){return Object(r["b"])({url:"/sysRole/grantData",method:"post",data:e})}},a49c:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"新增角色",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"角色名",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"请输入角色名！"}]}],expression:"['name', {rules: [{required: true, message: '请输入角色名！'}]}]"}],attrs:{placeholder:"请输入角色名"}})],1),a("a-form-item",{attrs:{label:"唯一编码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["code",{rules:[{required:!0,message:"请输入唯一编码！"}]}],expression:"['code', {rules: [{required: true,  message: '请输入唯一编码！'}]}]"}],attrs:{placeholder:"请输入唯一编码"}})],1),a("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"排序"}},[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["sort",{initialValue:100}],expression:"['sort', { initialValue: 100 }]"}],staticStyle:{width:"100%"},attrs:{placeholder:"请输入排序",min:1,max:1e3}})],1),a("a-form-item",{attrs:{label:"备注",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{rows:4,placeholder:"请输入备注"}})],1)],1)],1)],1)},n=[],o=(a("d3b7"),a("a240")),s={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},methods:{add:function(e){this.visible=!0},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){t?e.confirmLoading=!1:Object(o["b"])(a).then((function(t){t.success?(e.$message.success("新增成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",a),e.form.resetFields()):e.$message.error("新增失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},i=s,l=a("2877"),c=Object(l["a"])(i,r,n,!1,null,null,null);t["default"]=c.exports},d6a3:function(e,t,a){"use strict";a("50e7")},e35e:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"授权数据",width:600,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.formLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"授权范围",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["dataScopeType",{rules:[{required:!0,message:"请选择授权范围！"}]}],expression:"['dataScopeType', {rules: [{ required: true, message: '请选择授权范围！' }]}]"}],staticStyle:{width:"100%"},attrs:{placeholder:"请选择授权范围"}},e._l(e.dataScopeTypeData,(function(t,r){return a("a-select-option",{key:r,attrs:{value:t.code},on:{click:function(a){return e.handleChange(t.code)}}},[e._v(e._s(t.value))])})),1)],1),a("div",{directives:[{name:"show",rawName:"v-show",value:e.orgTreeShow,expression:"orgTreeShow"}]},[a("a-form-item",{attrs:{label:"选择机构",labelCol:e.labelCol,wrapperCol:e.wrapperCol}},[a("a-tree",{attrs:{checkable:"",checkStrictly:"","auto-expand-parent":e.autoExpandParent,"expanded-keys":e.expandedKeys,"tree-data":e.orgTreeData,"selected-keys":e.selectedKeys,replaceFields:e.replaceFields},on:{expand:e.onExpand,select:e.onSelect},model:{value:e.checkedKeys,callback:function(t){e.checkedKeys=t},expression:"checkedKeys"}})],1)],1)],1)],1)],1)},n=[],o=(a("d3b7"),a("25f0"),a("159b"),a("25fa")),s=a("a240"),i=a("126f"),l={data:function(){return{labelCol:{style:{"padding-right":"20px"},xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},orgTreeData:[],expandedKeys:[],checkedKeys:[],visible:!1,confirmLoading:!1,formLoading:!0,autoExpandParent:!0,selectedKeys:[],subValues:[],roleEntity:[],dataScopeTypeData:[],orgTreeShow:!1,replaceFields:{key:"id"},form:this.$form.createForm(this)}},methods:{roleOrg:function(e){this.roleEntity=e,this.visible=!0,this.formLoading=!0,this.sysDictTypeDropDown(),this.form.getFieldDecorator("dataScopeType",{initialValue:e.dataScopeType.toString()}),this.handleChange(e.dataScopeType)},sysDictTypeDropDown:function(){var e=this;Object(i["c"])({code:"data_scope_type"}).then((function(t){e.dataScopeTypeData=t.data,e.formLoading=!1}))},handleChange:function(e){"5"==e?(this.formLoading=!0,this.orgTreeShow=!0,this.getOrgTree(),this.sysRoleOwnData(this.roleEntity)):(this.orgTreeShow=!1,this.checkedKeys=[])},getOrgTree:function(){var e=this;Object(o["b"])().then((function(t){t.success&&(e.orgTreeData=t.data,e.orgTreeData.forEach((function(t){e.expandedKeys.push(t.id)})))}))},sysRoleOwnData:function(e){var t=this;Object(s["g"])({id:e.id}).then((function(e){e.success&&(t.checkedKeys=e.data),t.formLoading=!1}))},onExpand:function(e){this.expandedKeys=e,this.autoExpandParent=!1},onCheck:function(e){this.checkedKeys=e},onSelect:function(e,t){this.selectedKeys=e},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){if(t)e.confirmLoading=!1;else{var r=void 0===e.checkedKeys.checked?e.checkedKeys:e.checkedKeys.checked;Object(s["e"])({id:e.roleEntity.id,grantOrgIdList:r,dataScopeType:a.dataScopeType}).then((function(t){e.confirmLoading=!1,t.success?(e.$message.success("授权成功"),e.$emit("ok",a),e.handleCancel()):e.$message.error("授权失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}}))},handleCancel:function(){this.form.resetFields(),this.checkedKeys=[],this.expandedKeys=[],this.visible=!1,this.orgTreeShow=!1}}},c=l,d=a("2877"),u=Object(d["a"])(c,r,n,!1,null,null,null);t["default"]=u.exports}}]);