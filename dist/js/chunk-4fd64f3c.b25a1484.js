(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4fd64f3c","chunk-2d216f1a","chunk-2d0ceef2"],{"4e5f":function(e,a,t){},6222:function(e,a,t){"use strict";t.r(a);var r=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-modal",{attrs:{title:"修改医生用户",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[t("a-spin",{attrs:{spinning:e.confirmLoading}},[t("a-form",{attrs:{form:e.form}},[t("a-form-item",{staticStyle:{display:"none"},attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["id"],expression:"['id']"}]})],1),t("a-form-item",{attrs:{label:"姓名",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["xm",{rules:[{required:!0,message:"请输入姓名！"}]}],expression:"['xm', { rules: [{ required: true, message: '请输入姓名！' }] }]"}],attrs:{disabled:"",placeholder:"请输入姓名"}})],1),t("a-form-item",{attrs:{label:"性别",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["xb",{rules:[{required:!0,message:"请选择性别！"}]}],expression:"['xb', { rules: [{ required: true, message: '请选择性别！' }] }]"}],attrs:{name:"radioGroup","default-value":1}},[t("a-radio",{attrs:{value:1}},[e._v(" 男 ")]),t("a-radio",{staticStyle:{width:"100px"},attrs:{value:2}},[e._v(" 女 ")])],1)],1),t("a-form-item",{attrs:{label:"所属机构科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["jg",{rules:[{required:!0,message:"请选择机构"}]}],expression:"['jg', { rules: [{ required: true, message: '请选择机构' }] }]"}],attrs:{"allow-clear":"",placeholder:"湘雅附二医院"}},e._l(e.hosData,(function(a,r){return t("a-select-option",{key:r,attrs:{value:a.code}},[e._v(e._s(a.value))])})),1)],1),t("a-form-item",{attrs:{label:"科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["ssks",{rules:[{required:!0,message:"请选择科室"}]}],expression:"['ssks', { rules: [{ required: true, message: '请选择科室' }] }]"}],attrs:{"allow-clear":"",placeholder:"请选择科室"},on:{select:e.onSelected}},e._l(e.keshiData,(function(a,r){return t("a-select-option",{key:r,attrs:{value:a.yyksdm}},[e._v(e._s(a.yyksmc))])})),1)],1),t("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"职称","has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["zhic",{rules:[{required:!0,message:"请输入职称！"}]}],expression:"['zhic', { rules: [{ required: true, message: '请输入职称！' }] }]"}],attrs:{placeholder:"请输入职称"}})],1),t("a-form-item",{attrs:{label:"手机号码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["tel",{rules:[{required:!0,message:"请输入手机号码！"}]}],expression:"['tel', { rules: [{ required: true, message: '请输入手机号码！' }] }]"}],attrs:{placeholder:"请输入手机号码"}})],1)],1)],1)],1)},s=[],i=(t("99af"),t("d3b7"),t("4cab")),o={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},keshiData:[],hosData:[{code:"444885559",value:"湘雅附二医院"}],visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},created:function(){this.getKeShi()},methods:{edit:function(e){var a=this;this.visible=!0,setTimeout((function(){a.form.setFieldsValue({id:e.id,xm:e.xm,jg:"湘雅附二医院",ssks:e.ssks,zhic:e.zhic,tel:e.tel}),"男"!=e.xb&&e.xb?a.form.setFieldsValue({xb:2}):a.form.setFieldsValue({xb:1})}),100)},onSelected:function(e){for(var a=0;a<this.keshiData.length;a++)this.keshiData[a].yyksdm==e&&(this.seletSsksName=this.keshiData[a].yyksmc)},getKeShi:function(){var e=this;Object(i["pb"])({hospitalCode:"444885559"}).then((function(a){if(a.success){for(var t=[],r=0;r<a.data.length;r++)a.data[r].departmentList&&a.data[r].departmentList.length>0&&(t=t.concat(a.data[r].departmentList));e.keshiData=t}})).catch((function(e){}))},handleSubmit:function(){var e=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,t){a?e.confirmLoading=!1:(1==t.xb?t.xb="男":t.xb="女",t.ssksName=e.seletSsksName,delete t.jg,Object(i["i"])(t).then((function(a){a.success?(e.$message.success("编辑成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",t),e.form.resetFields()):e.$message.error("编辑失败："+a.message)})).finally((function(a){e.confirmLoading=!1})))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},n=o,l=t("2877"),c=Object(l["a"])(n,r,s,!1,null,null,null);a["default"]=c.exports},"9d6b":function(e,a,t){"use strict";t.r(a);var r=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-card",{staticClass:"sys-card",attrs:{bordered:!1}},[t("a-tabs",{staticStyle:{"margin-top":"-17px"},attrs:{"default-active-key":"1"},on:{change:e.callback}},[t("a-tab-pane",{key:"1",attrs:{tab:"问卷列表"}},[t("div",{staticClass:"table-page-search-wrapper"},[t("div",{staticClass:"search-row"},[t("span",{staticClass:"name"},[e._v("科室:")]),t("a-select",{staticStyle:{"min-width":"120px"},attrs:{maxTagCount:1,"collapse-tags":!0,"allow-clear":"",mode:"multiple",placeholder:"请选择科室"},model:{value:e.idArr,callback:function(a){e.idArr=a},expression:"idArr"}},e._l(e.originData,(function(a,r){return t("a-select-option",{key:r,attrs:{value:a.departmentName}},[e._v(e._s(a.departmentName))])})),1)],1),t("div",{staticClass:"action-row"},[t("span",{staticClass:"buttons",style:{float:"right",overflow:"hidden"}},[t("a-button",{attrs:{type:"primary",icon:"search"},on:{click:function(a){return e.$refs.table.refresh(!0)}}},[e._v("查询")]),t("a-button",{staticStyle:{"margin-left":"8px","margin-right":"0"},attrs:{icon:"undo"},on:{click:e.reset}},[e._v("重置")])],1)])]),t("div",{staticClass:"table-operator",staticStyle:{overflow:"hidden"}},[t("a",{attrs:{href:"http://hmg.mclouds.org.cn/login",target:"_blank"}},[t("a-button",{staticStyle:{float:"right","margin-right":"0"},attrs:{icon:"plus"}},[e._v("新增")])],1)]),t("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(a,r){return t("span",{},[t("a",{attrs:{href:r.questUrl+"?userId=0&showsubmitbtn=hide",target:"_blank"}},[e._v("查看")])])}}])}),t("add-form",{ref:"addForm",on:{ok:e.handleOk}}),t("edit-form",{ref:"editForm",on:{ok:e.handleOk}})],1),t("a-tab-pane",{key:"2",attrs:{tab:"问卷统计"}},[t("div",{staticClass:"table-page-search-wrapper"},[t("div",{staticClass:"search-row"},[t("span",{staticClass:"name"},[e._v("科室:")]),t("a-select",{staticStyle:{"min-width":"120px"},attrs:{maxTagCount:1,"collapse-tags":!0,"allow-clear":"",mode:"multiple",placeholder:"请选择科室"},model:{value:e.idArrStat,callback:function(a){e.idArrStat=a},expression:"idArrStat"}},e._l(e.originDataStat,(function(a,r){return t("a-select-option",{key:r,attrs:{value:a.departmentName}},[e._v(e._s(a.departmentName))])})),1)],1),t("div",{staticClass:"action-row"},[t("span",{staticClass:"buttons",style:{float:"right",overflow:"hidden"}},[t("a-button",{attrs:{type:"primary",icon:"search"},on:{click:function(a){return e.$refs.tableStat.refresh(!0)}}},[e._v("查询")]),t("a-button",{staticStyle:{"margin-left":"8px","margin-right":"0"},attrs:{icon:"undo"},on:{click:e.resetStat}},[e._v("重置")])],1)])]),t("s-table",{ref:"tableStat",attrs:{scroll:{x:!0},size:"default",columns:e.columnsStat,data:e.loadDataStat,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(a,r){return t("span",{},[t("a",{on:{click:function(a){return e.goCheck(r)}}},[e._v("查看")])])}}])}),t("add-form",{ref:"addForm",on:{ok:e.handleOk}}),t("edit-form",{ref:"editForm",on:{ok:e.handleOk}})],1)],1)],1)},s=[],i=(t("d3b7"),t("159b"),t("b0c0"),t("2af9")),o=t("4cab"),n=t("9fb0"),l=t("2b0e"),c=t("c52d"),d=t("6222"),m={components:{STable:i["s"],addForm:c["default"],editForm:d["default"]},data:function(){var e=this;return{advanced:!1,hosData:[{code:"444885559",value:"湘雅附二医院"}],queryParam:{typeName:""},queryParamStat:{typeName:""},idArr:[],idArrStat:[],originData:[],originDataStat:[],labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:11}},columns:[{title:"序号",dataIndex:"xh"},{title:"问卷名称",dataIndex:"name"},{title:"科室",dataIndex:"type_name"},{title:"发布时间",dataIndex:"update_time"},{title:"创建时间",dataIndex:"create_time"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],columnsStat:[{title:"序号",dataIndex:"xh"},{title:"问卷名称",dataIndex:"name"},{title:"科室",dataIndex:"type_name"},{title:"计划名称",dataIndex:"plan_name"},{title:"计划分配科室",dataIndex:"type_nameOut"},{title:"操作",fixed:"right",width:"80px",dataIndex:"action",scopedSlots:{customRender:"action"}}],keshiData:[],loadData:function(a){var t=JSON.parse(JSON.stringify(e.queryParam));return e.idArr.length>0&&e.idArr.forEach((function(a,r){r!=e.idArr.length-1?t.typeName=t.typeName+a+",":t.typeName=t.typeName+a})),e.isNoDepart&&(t.typeName="-1"),7!=e.user.roleId&&"admin"!=e.user.roleName&&0==e.idArr.length&&e.originData.forEach((function(a,r){r!=e.originData.length-1?t.typeName=t.typeName+a.departmentName+",":t.typeName=t.typeName+a.departmentName})),Object(o["V"])(Object.assign(a,t)).then((function(e){if(0==e.code){var t={pageNo:a.pageNo,pageSize:a.pageSize,totalRows:e.data.total,totalPage:e.data.total/a.pageSize,rows:e.data.list};return t.rows.forEach((function(e,a){e.xh=(t.pageNo-1)*t.pageSize+(a+1),e.nameDes=e.name})),t}return{}}))},loadDataStat:function(a){var t=JSON.parse(JSON.stringify(e.queryParamStat));return e.idArrStat.length>0&&(t.typeName="",e.idArrStat.forEach((function(a,r){r!=e.idArrStat.length-1?t.typeName=t.typeName+a+",":t.typeName=t.typeName+a}))),e.isNoDepart&&(t.typeName="-1"),7!=e.user.roleId&&"admin"!=e.user.roleName&&0==e.idArrStat.length&&e.originDataStat.forEach((function(a,r){r!=e.idArrStat.length-1?t.typeName=t.typeName+a.departmentName+",":t.typeName=t.typeName+a.departmentName})),Object(o["W"])(Object.assign(a,t)).then((function(e){if(0==e.code){var t={pageNo:a.pageNo,pageSize:a.pageSize,totalRows:e.data.total,totalPage:e.data.total/a.pageSize,rows:e.data.records};return t.rows.forEach((function(e,a){e.xh=(t.pageNo-1)*t.pageSize+(a+1),e.nameDes=e.name,e.type_nameOut=e.type_name})),t}return{}}))},isNoDepart:!1,user:{},selectedRowKeys:[],selectedRows:[]}},created:function(){var e=this;this.user=l["a"].ls.get(n["o"]),7==this.user.roleId||"admin"==this.user.roleName?Object(o["eb"])().then((function(a){0==a.code&&(e.originData=a.data,e.originDataStat=JSON.parse(JSON.stringify(a.data)),e.$refs.table.refresh(),e.$refs.tableStat.refresh())})):Object(o["fb"])().then((function(a){0==a.code&&(e.originData=a.data,e.originDataStat=JSON.parse(JSON.stringify(a.data)),e.originData.length>0?(e.originData.forEach((function(a,t){e.idArr.push(a.departmentName)})),e.idArrStat=JSON.parse(JSON.stringify(e.idArr))):(e.isNoDepart=!0,e.idArr=[],e.idArrStat=[]),e.$refs.table.refresh(),e.$refs.tableStat.refresh())}))},methods:{toggleAdvanced:function(){this.advanced=!this.advanced},handleStatus:function(e){var a=this;e.activeFlag=1==e.activeFlag||null==e.activeFlag?0:1,changeStatus(e).then((function(e){e.success?(a.$message.success("切换成功"),a.$refs.table.refresh()):a.$message.error("切换失败："+e.message)})).catch((function(e){a.$message.error("切换错误："+e.message)}))},reset:function(){this.idArr=[],this.queryParam.typeName="",this.$refs.table.refresh()},resetStat:function(){this.idArrStat=[],this.queryParamStat.typeName="",this.$refs.tableStat.refresh()},handleOk:function(){this.$refs.table.refresh()},onSelectChange:function(e,a){this.selectedRowKeys=e,this.selectedRows=a},goCheck:function(e){this.$router.push({name:"ques_stat_detail",query:{recordStr:JSON.stringify(e)}})},callback:function(){}}},u=m,p=(t("b079"),t("2877")),f=Object(p["a"])(u,r,s,!1,null,"27e6f4be",null);a["default"]=f.exports},b079:function(e,a,t){"use strict";t("4e5f")},c52d:function(e,a,t){"use strict";t.r(a);var r=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-modal",{attrs:{title:"新增职位",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[t("a-spin",{attrs:{spinning:e.confirmLoading}},[t("a-form",{attrs:{form:e.form}},[t("a-form-item",{attrs:{label:"职位名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"请输入职位名称！"}]}],expression:"['name', {rules: [{required: true, message: '请输入职位名称！'}]}]"}],attrs:{placeholder:"请输入职位名称"}})],1),t("a-form-item",{attrs:{label:"唯一编码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["code",{rules:[{required:!0,message:"请输入唯一编码！"}]}],expression:"['code', {rules: [{required: true,  message: '请输入唯一编码！'}]}]"}],attrs:{placeholder:"请输入唯一编码"}})],1),t("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"排序"}},[t("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["sort",{initialValue:100}],expression:"['sort', { initialValue: 100 }]"}],staticStyle:{width:"100%"},attrs:{placeholder:"请输入排序",min:1,max:1e3}})],1),t("a-form-item",{attrs:{label:"备注",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{rows:4,placeholder:"请输入备注"}})],1)],1)],1)],1)},s=[],i=(t("d3b7"),t("4cab")),o={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},methods:{add:function(e){this.visible=!0},handleSubmit:function(){var e=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,t){a?e.confirmLoading=!1:Object(i["gd"])(t).then((function(a){a.success?(e.$message.success("新增成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",t),e.form.resetFields()):e.$message.error("新增失败："+a.message)})).finally((function(a){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},n=o,l=t("2877"),c=Object(l["a"])(n,r,s,!1,null,null,null);a["default"]=c.exports}}]);