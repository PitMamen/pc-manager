(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-74abbcff","chunk-a51bac7c"],{"1aa5":function(t,e,a){"use strict";a("8714")},2100:function(t,e,a){},"2eba":function(t,e,a){},3924:function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("a-card",{staticClass:"card-right-pac",attrs:{bordered:!1,confirmLoading:t.confirmLoading}},[s("div",{staticClass:"table-page-search-wrapper"},[s("a-form",{attrs:{layout:"inline"}},[s("a-row",{attrs:{gutter:48}},[s("a-col",{attrs:{md:4,sm:12}},[s("a-form-item",{attrs:{label:"姓名"}},[s("a-input",{attrs:{"allow-clear":"",placeholder:"人员姓名查询"},on:{keyup:function(e){return!e.type.indexOf("key")&&t._k(e.keyCode,"enter",13,e.key,"Enter")?null:t.$refs.table.refresh(!0)},search:function(e){return t.$refs.table.refresh(!0)}},model:{value:t.queryParams.name,callback:function(e){t.$set(t.queryParams,"name",e)},expression:"queryParams.name"}})],1)],1),s("a-col",{attrs:{md:6,sm:24}},[s("a-form-item",{staticStyle:{"margin-left":"-10%"},attrs:{label:"管理科室"}},[s("a-select",{attrs:{"allow-clear":"",mode:"multiple",placeholder:"请选择科室"},model:{value:t.queryParams.depts,callback:function(e){t.$set(t.queryParams,"depts",e)},expression:"queryParams.depts"}},t._l(t.originData,(function(e,a){return s("a-select-option",{key:a,attrs:{value:e.departmentId}},[t._v(t._s(e.departmentName))])})),1)],1)],1),s("a-col",{attrs:{md:10,sm:24}},[s("a-button",{staticStyle:{"margin-left":"1%"},attrs:{type:"primary",icon:"search"},on:{click:function(e){return t.$refs.table.refresh(!0)}}},[t._v("查询")]),s("a-button",{staticStyle:{"margin-left":"2%"},attrs:{type:"primary",icon:"reload"},on:{click:function(e){return t.reset()}}},[t._v("重置")])],1)],1)],1),s("div",{staticClass:"div-divider"})],1),s("s-table",{ref:"table",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.code}},scopedSlots:t._u([{key:"acount",fn:function(e,i){return s("span",{staticStyle:{}},[1==i.openidFlag?s("img",{staticStyle:{width:"25px",height:"25px"},attrs:{src:a("ae32")}}):t._e(),0==i.openidFlag?s("img",{staticStyle:{width:"25px",height:"25px"},attrs:{src:a("6edf")}}):t._e()])}},{key:"action",fn:function(e,a){return s("span",{staticStyle:{}},[s("a",[t._v("健康档案")]),s("a-divider",{attrs:{type:"vertical"}}),s("a",{on:{click:function(e){return t.$refs.visitManage.distribution(a)}}},[t._v("随访管理")])],1)}}])}),s("visit-Manage",{ref:"visitManage",on:{ok:t.handleOk}})],1)},i=[],n=(a("d3b7"),a("159b"),a("b0c0"),a("2af9")),r=a("4cab"),l=a("9fb0"),c=a("7f9ab"),o=a("2b0e"),m={components:{STable:n["s"],visitManage:c["default"]},data:function(){var t=this;return{user:{},keshiData:[],originData:[],idArr:[],queryParams:{depts:[],name:"",tableName:""},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this),columns:[{title:"序号",dataIndex:"xh",width:60},{title:"姓名",dataIndex:"name",width:80},{title:"身份证号",dataIndex:"idCard",width:120},{title:"年龄",dataIndex:"age",width:60},{title:"性别",dataIndex:"sex",width:60},{title:"联系电话",dataIndex:"phone",width:100},{title:"紧急联系人",dataIndex:"urgentContacts",width:120},{title:"紧急联系人电话",dataIndex:"urgentTel",width:100},{title:"管理科室",dataIndex:"cyksmc",width:100},{title:"账号信息",scopedSlots:{customRender:"acount"},width:80},{title:"操作",width:"180px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(e){return t.confirmLoading=!0,Object(r["pc"])(Object.assign(e,t.queryParams)).then((function(t){if(0==t.code&&t.data.rows.length>0){var a={pageNo:e.pageNo,pageSize:e.pageSize,totalRows:t.data.totalRows,totalPage:t.data.totalPage/e.pageSize,rows:t.data.rows};a.rows.forEach((function(t,e){t.xh=(a.pageNo-1)*a.pageSize+(e+1)}))}else a=null;return t.data})).finally((function(e){t.confirmLoading=!1}))}}},created:function(){var t=this;this.user=o["a"].ls.get(l["o"]),7==this.user.roleId||"admin"==this.user.roleName?Object(r["eb"])().then((function(e){0==e.code&&(t.originData=e.data)})):Object(r["fb"])().then((function(e){0==e.code&&(t.originData=e.data,t.$refs.table.refresh(!0))}))},methods:{editPlan:function(t){this.$router.push({name:"project_edit",query:{planId:t.id}})},onDepartmentChange:function(t){void 0==t?this.queryParams.depts=[]:this.queryParams.depts.push(this.originData[t].departmentId)},reset:function(){this.queryParams.depts=[],this.queryParams.name="",this.queryParams.tableName="",this.$refs.table.refresh(!0)},handleOk:function(){this.$refs.table.refresh()},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},u=m,d=(a("f969"),a("2877")),p=Object(d["a"])(u,s,i,!1,null,null,null);e["default"]=p.exports},"6edf":function(t,e,a){t.exports=a.p+"img/weixin2.71b80822.png"},"719f":function(t,e,a){"use strict";a("2eba")},"7f9ab":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:t.title,width:1e3,height:650,visible:t.visible,confirmLoading:t.confirmLoading},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[a("div",{staticClass:"div-service-user"},[a("div",{staticClass:"div-totalleft"},[a("div",{staticClass:"div-totaltopleft"},[a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"10px",width:"30%"}},[t._v(" 添加任务")])]),a("div",{staticClass:"display-item",staticStyle:{"margin-left":"10px","margin-top":"10px"}},[a("span",{staticStyle:{"margin-top":"10px"}},[t._v(" 随访方式:")]),a("a-form-item",{staticStyle:{width:"50%","margin-left":"10px","align-items":"center"}},[a("a-select",{staticStyle:{width:"120px"},attrs:{"allow-clear":"",placeholder:"微信随访/短信随访"},on:{select:function(e){return t.onTypeSelect(t.queryParams.messageType)}},model:{value:t.queryParams.messageType,callback:function(e){t.$set(t.queryParams,"messageType",e)},expression:"queryParams.messageType"}},t._l(t.visitTypeList,(function(e,s){return a("a-select-option",{key:s,attrs:{value:e.code}},[t._v(t._s(e.value))])})),1)],1)],1),a("div",{staticClass:"display-item",staticStyle:{"margin-top":"10px","margin-left":"10px"}},[a("span",{staticStyle:{"margin-top":"10px"}},[t._v(" 随访内容:")]),a("a-form-item",{staticStyle:{width:"50%","margin-left":"10px","align-items":"center"}},[a("a-select",{staticStyle:{width:"120px"},attrs:{"allow-clear":"",placeholder:"微信随访模板"},model:{value:t.messageContentType,callback:function(e){t.messageContentType=e},expression:"messageContentType"}},t._l(t.msgData,(function(e,s){return a("a-select-option",{key:s,attrs:{value:e.id}},[t._v(t._s(e.templateTitle))])})),1)],1)],1),a("div",{staticClass:"display-item",staticStyle:{"margin-top":"10px","margin-left":"10px"}},[a("span",{staticStyle:{"margin-top":"10px",width:"80px"}},[t._v(" 发送时间:")]),a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["roleId",{rules:[{required:!0,message:"请选择发送时间！"}]}],expression:"['roleId', { rules: [{ required: true, message: '请选择发送时间！' }] }]"}],staticStyle:{width:"50%","margin-top":"10px"},attrs:{name:"radioGroup"},on:{change:t.radioChange}},[a("a-radio",{staticClass:"btn-add-plan",attrs:{value:1}},[t._v(" 立即发送 ")]),a("a-radio",{attrs:{value:2}},[t._v(" 延时发送 ")])],1)],1),"2"==t.rangeValue?a("div",{staticClass:"display-item;",staticStyle:{"margin-top":"2px",width:"100%"}},[a("a-date-picker",{staticStyle:{"margin-top":"27px","margin-left":"10px"},attrs:{format:"YYYY-MM-DD"},model:{value:t.queryParams.executeTime,callback:function(e){t.$set(t.queryParams,"executeTime",e)},expression:"queryParams.executeTime"}}),a("a-time-picker",{staticStyle:{"margin-left":"10px width: 50%",margin:"20px"},attrs:{"default-value":t.moment("00:00","HH:mm"),format:"HH:mm"},on:{change:t.timeChangeStart}})],1):t._e(),a("div",{staticClass:"display-item",staticStyle:{"margin-top":"20px","margin-left":"10px"}},[a("a-button",{staticStyle:{"margin-left":"1%"},attrs:{type:"primary"},on:{click:function(e){return t.commit()}}},[t._v("提交")]),a("a-button",{staticStyle:{"margin-left":"20px"},attrs:{type:"default"},on:{click:function(e){return t.reset()}}},[t._v("重置")])],1)]),a("div",{staticClass:"card-right-user",staticStyle:{"overflow-y":"auto",height:"400px"}},[a("div",{staticClass:"div-totaltop"},[a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"20px"}},[t._v(" 随访历史任务")])]),t._l(t.recordList,(function(e,s){return a("div",{key:s,staticClass:"div-total1"},[a("div",{staticClass:"div-line-wrap",staticStyle:{"margin-left":"30px"}},[a("span",{staticClass:"span-item-name"},[t._v(" 随访方式 :")]),a("span",{staticClass:"span-item-value",staticStyle:{"margin-left":"10px"}},[t._v(t._s(null!=e.messageType?e.messageType.description:"")+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"4%"}},[t._v(" 状态 : ")]),a("span",{staticClass:"span-item-value",staticStyle:{"margin-left":"3%"}},[t._v(t._s(null!=e.taskBizStatus?e.taskBizStatus.description:"-"))])]),a("div",{staticClass:"div-line-wrap",staticStyle:{"margin-left":"30px","margin-top":"1px"}},[a("span",{staticClass:"span-item-name"},[t._v(" 随访内容 :")]),a("span",{staticClass:"span-item-value1",staticStyle:{"margin-left":"0px",width:"25%"},attrs:{title:e.templateTitle}},[t._v(t._s(null!=e.templateTitle?e.templateTitle:"-")+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"0%"}},[t._v(" 是否逾期 :")]),1==e.taskType.value?a("span",{staticClass:"span-item-value",staticStyle:{"margin-left":"3%"}},[t._v(t._s(null!=e.overdueStatus?e.overdueStatus.description:" "))]):t._e(),2==e.taskType.value||3==e.taskType.value?a("span",{staticClass:"span-item-value",staticStyle:{"margin-left":"3%"}},[t._v("   "+t._s("-"))]):t._e()]),a("div",{staticClass:"div-line-wrap",staticStyle:{"margin-left":"30px","margin-top":"1px"}},[a("span",{staticClass:"span-item-name"},[t._v(" 计划日期 :")]),a("span",{staticClass:"span-item-value",staticStyle:{width:"30%"}},[t._v(t._s(null!=e.executeTime?e.executeTime:"")+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"-5%",width:"12%"}},[t._v(" 完成日期 :")]),a("span",{staticClass:"span-item-value",staticStyle:{width:"25%"}},[t._v(t._s(1==e.taskType.value?e.userFollowTime:e.actualExecTime))])])])}))],2)])])},i=[],n=(a("b0c0"),a("99af"),a("d3b7"),a("caad"),a("2532"),a("7db0"),a("c1df")),r=a.n(n),l=a("4cab"),c=a("2af9"),o=a("2b0e"),m=a("9fb0"),u=a("ca00"),d={components:{STable:c["s"]},data:function(){return{userId:"",recordList:[],timeStr:"",msgData:[],templateListWX:[],templateListSMS:[],templateListQues:[],id:"",rangeValue:"2",record:{},messageContentType:"",queryParams:{execDoctorUserId:"",executeDepartmentId:"",userId:"",tenantId:"",messageType:"",messageContentType:"",messageContentId:"",hospitalCode:"",executeTime:"2022-11-01"},queryParamsRecord:{userId:""},visitTypeList:[{code:2,value:"微信消息"},{code:3,value:"短信消息"}],labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this),title:"添加任务"}},watch:{timeStr:function(){}},methods:{moment:r.a,distribution:function(t){this.visible=!0,this.reset(),this.confirmLoading=!0,this.recordList=[],this.queryParams.userId=t.userId,this.queryParamsRecord.userId=t.userId,this.qryExecuteRecordByUserIdOut(),this.getmessageTypes(),this.getSmsTemplateListForJumpTypeOut(),this.getWxTemplateListForJumpTypeOut(),this.title="添加任务【"+t.name+"  |   "+t.sex+"    |    "+t.age+"】"},onTypeSelect:function(t){if(1==t);else if(2==t||3==t){var e=Object(u["c"])(new Date)+" 08:00:00";r()(e,"YYYY-MM-DD HH:mm:ss")}t>0&&(this.queryParams.messageContentType=""),1==t?itemTask.itemTemplateList=JSON.parse(JSON.stringify(this.templateListQues)):2==t?this.msgData=JSON.parse(JSON.stringify(this.templateListWX)):3==t&&(this.msgData=JSON.parse(JSON.stringify(this.templateListSMS)))},formatDateOut:function(t){t=new Date(t);var e=t.getFullYear(),a=t.getMonth()+1,s=t.getDate();return a<10&&(a="0"+a),s<10&&(s="0"+s),"".concat(e,"-").concat(a,"-").concat(s)},addExecuteRecordOut:function(){var t=this;this.confirmLoading=!0,Object(l["c"])(this.queryParams).then((function(e){0==e.code?(t.$message.success("操作成功!"),t.handleCancel()):t.$message.error("操作失败!")})).finally((function(e){t.confirmLoading=!1}))},qryExecuteRecordByUserIdOut:function(){var t=this;Object(l["jc"])(this.queryParamsRecord).then((function(e){0==e.code&&(t.recordList=e.data)})).finally((function(e){t.confirmLoading=!1}))},getmessageTypes:function(){var t=this;Object(l["Xb"])().then((function(e){0==e.code&&(t.msgData=e.data)})).finally((function(e){t.confirmLoading=!1}))},getSmsTemplateListForJumpTypeOut:function(){var t=this;Object(l["Kb"])(0).then((function(e){0==e.code&&(t.templateListSMS=e.data)})).finally((function(e){t.confirmLoading=!1}))},getWxTemplateListForJumpTypeOut:function(){var t=this;Object(l["Tb"])(0).then((function(e){0==e.code&&(t.templateListWX=e.data)})).finally((function(e){t.confirmLoading=!1}))},timeChangeStart:function(t,e){this.timeStr=e},radioChange:function(t){1==t.target.value?this.rangeValue="1":2==t.target.value&&(this.rangeValue="2")},commit:function(){var t=this;if(this.queryParams.messageType)if(this.messageContentType){if("1"==this.rangeValue){var e=Object(u["d"])((new Date).getTime());this.queryParams.executeTime=e}else{var a=r()(this.queryParams.executeTime).format("YYYY-MM-DD")+" "+this.timeStr+":00";this.queryParams.executeTime=a}if(this.queryParams.executeTime.includes("Invalid date"))this.$message.error("请选择发送时间");else{var s=o["a"].ls.get(m["o"]),i=this.msgData.find((function(e){return e.id==t.messageContentType}));i?(this.queryParams.execDoctorUserId=s.userId,this.queryParams.executeDepartmentId=s.departmentCode,this.queryParams.hospitalCode=i.hospitalCode,this.queryParams.tenantId=i.tenantId,this.queryParams.messageContentId=i.id,this.queryParams.messageContentType=2==this.queryParams.messageType?4:3,this.addExecuteRecordOut()):this.$message.error("随访方式与随访内容不匹配,请重新选择!")}}else this.$message.error("请选择随访内容");else this.$message.error("请选择随访方式")},reset:function(){this.messageContentType="",this.queryParams.executeTime="",this.timeStr="",this.queryParams.messageType="",this.queryParams.messageContentType="",this.queryParams.messageContentId=""},handleCancel:function(){this.visible=!1},handleSubmit:function(){this.visible=!1}}},p=d,f=(a("719f"),a("1aa5"),a("2877")),h=Object(f["a"])(p,s,i,!1,null,null,null);e["default"]=h.exports},8714:function(t,e,a){},ae32:function(t,e,a){t.exports=a.p+"img/weixin.e1baf1ec.png"},f969:function(t,e,a){"use strict";a("2100")}}]);