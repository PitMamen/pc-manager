(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6db2f72c","chunk-5678b7d0","chunk-73505c44","chunk-464929ea","chunk-2d0c1368","chunk-2d216447"],{"0010":function(e,t,a){"use strict";a("58b6")},"0381":function(e,t,a){"use strict";a("74a4")},"0967":function(e,t,a){"use strict";a("c08a")},"1d5c":function(e,t,a){},"23f0":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("a-tabs",{model:{value:e.keyindex,callback:function(t){e.keyindex=t},expression:"keyindex"}},[a("a-tab-pane",{key:"1",attrs:{tab:"院级抽查"}},[a("control-list",{ref:"serviceList",on:{ok:e.handleOk}})],1),a("a-tab-pane",{key:"2",attrs:{tab:"任务统计"}},[a("task-statistics",{ref:"taskStatistics",on:{ok:e.handleOk}})],1)],1)],1)},i=[],r=a("64d1"),n=a("95c0"),o={components:{controlList:r["default"],taskStatistics:n["default"]},data:function(){return{keyindex:"1",keshiData:[],queryParams:{userName:""}}},created:function(){this.$route.query.keyindex&&(this.keyindex=this.$route.query.keyindex)},methods:{callback:function(){},handleOk:function(){}}},l=o,c=(a("0967"),a("2877")),u=Object(c["a"])(l,s,i,!1,null,null,null);t["default"]=u.exports},"44a3":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"新增职位",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{attrs:{label:"职位名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"请输入职位名称！"}]}],expression:"['name', {rules: [{required: true, message: '请输入职位名称！'}]}]"}],attrs:{placeholder:"请输入职位名称"}})],1),a("a-form-item",{attrs:{label:"唯一编码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["code",{rules:[{required:!0,message:"请输入唯一编码！"}]}],expression:"['code', {rules: [{required: true,  message: '请输入唯一编码！'}]}]"}],attrs:{placeholder:"请输入唯一编码"}})],1),a("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"排序"}},[a("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["sort",{initialValue:100}],expression:"['sort', { initialValue: 100 }]"}],staticStyle:{width:"100%"},attrs:{placeholder:"请输入排序",min:1,max:1e3}})],1),a("a-form-item",{attrs:{label:"备注",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{rows:4,placeholder:"请输入备注"}})],1)],1)],1)],1)},i=[],r=(a("d3b7"),a("4cab")),n={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},methods:{add:function(e){this.visible=!0},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){t?e.confirmLoading=!1:Object(r["dd"])(a).then((function(t){t.success?(e.$message.success("新增成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",a),e.form.resetFields()):e.$message.error("新增失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},o=n,l=a("2877"),c=Object(l["a"])(o,s,i,!1,null,null,null);t["default"]=c.exports},"4a28":function(e,t,a){e.exports=a.p+"assets/icon_completed.d7f15e19.svg"},"58b6":function(e,t,a){},"64d1":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("a-spin",{attrs:{spinning:e.confirmLoading}},[s("div",{staticClass:"div-service-control"},[s("div",{staticClass:"div-service-left-control"},[s("div",{staticClass:"left-control"},[s("span",{staticClass:"span-current-ques"},[e._v(e._s(e.choseQues.questionnaireName))]),s("div",{staticClass:"div-text-auto"},[s("a-auto-complete",{staticClass:"global-search",staticStyle:{width:"93%","font-size":"12px"},attrs:{size:"large",placeholder:"请输入名称查询","option-label-prop":"title"},on:{select:e.onSelect,search:e.handleSearch}},[s("template",{slot:"dataSource"},e._l(e.quesDataTemp,(function(t){return s("a-select-option",{key:t.questionnaireId+"",attrs:{title:t.questionnaireName}},[e._v(" "+e._s(t.questionnaireName)+" ")])})),1)],2)],1),s("div",{staticClass:"div-wrap-control",staticStyle:{"margin-top":"2%"}},e._l(e.quesData,(function(t,a){return s("div",{key:a,staticClass:"div-part",class:{checked:t.isChecked},attrs:{value:t.departmentName},on:{click:function(s){return e.onItemClick(t,a)}}},[s("span",{staticClass:"span-name",on:{click:function(t){return e.onPartChoose(a)}}},[e._v(" "+e._s(t.questionnaireName)+" ")]),s("div",{staticClass:"div-rate"},[s("span",{staticStyle:{width:"30px","text-align":"center"}},[e._v(" "+e._s(t.checkPercentage)+" ")]),s("span",{staticStyle:{"margin-left":"5px",width:"30px","text-align":"center"}},[e._v(" "+e._s(t.passCheckPercentage)+" ")])])])})),0)])]),s("a-card",{staticClass:"card-right-control",attrs:{bordered:!1}},[s("div",{staticClass:"div-radio"},[s("div",{staticClass:"radio-item",class:{"checked-btn":1==e.queryParams.type},on:{click:function(t){return e.onRadioClick(1)}}},[s("img",{class:{"checked-icon":1==e.queryParams.type},staticStyle:{width:"13px",height:"13px"},attrs:{src:a("6f2b")}}),s("span",{staticStyle:{"margin-left":"3px"}},[e._v("待抽查")])]),s("div",{staticClass:"radio-item",class:{"checked-btn":2==e.queryParams.type},on:{click:function(t){return e.onRadioClick(2)}}},[s("img",{class:{"checked-icon":2==e.queryParams.type},staticStyle:{width:"13px",height:"13px"},attrs:{src:a("4a28")}}),s("span",{staticStyle:{"margin-left":"3px"}},[e._v("已抽查")])])]),s("div",{staticClass:"div-divider",staticStyle:{"margin-left":"0"}}),s("div",{staticClass:"table-page-search-wrapper"},[s("div",{staticClass:"search-row"},[s("span",{staticClass:"name"},[e._v("执行科室:")]),s("a-select",{staticStyle:{width:"110px"},attrs:{"allow-clear":"",placeholder:"请选择科室"},on:{select:e.onDeptSelect},model:{value:e.queryParams.executeDepartmentId,callback:function(t){e.$set(e.queryParams,"executeDepartmentId",t)},expression:"queryParams.executeDepartmentId"}},e._l(e.originData,(function(t,a){return s("a-select-option",{key:a,attrs:{value:t.departmentId}},[e._v(e._s(t.departmentName))])})),1)],1),s("div",{staticClass:"search-row"},[s("span",{staticClass:"name"},[e._v("执行结果:")]),s("a-select",{attrs:{"allow-clear":"",placeholder:"请选择"},model:{value:e.queryParams.taskBizStatus,callback:function(t){e.$set(e.queryParams,"taskBizStatus",t)},expression:"queryParams.taskBizStatus"}},e._l(e.taskBizStatusData,(function(t,a){return s("a-select-option",{key:a,attrs:{value:t.value}},[e._v(e._s(t.description))])})),1)],1),s("div",{staticClass:"search-row"},[s("span",{staticClass:"name"},[e._v("随访医生:")]),s("a-select",{attrs:{"allow-clear":"",placeholder:"请选择"},on:{focus:e.getFocus},model:{value:e.queryParams.actualDoctorUserId,callback:function(t){e.$set(e.queryParams,"actualDoctorUserId",t)},expression:"queryParams.actualDoctorUserId"}},e._l(e.deptUsers,(function(t,a){return s("a-select-option",{key:a,attrs:{value:t.userId}},[e._v(e._s(t.userName))])})),1)],1),s("div",{staticClass:"search-row"},[s("span",{staticClass:"name"},[e._v("随访方式:")]),s("a-select",{attrs:{"allow-clear":"",placeholder:"请选择随访方式"},model:{value:e.queryParams.messageType,callback:function(t){e.$set(e.queryParams,"messageType",t)},expression:"queryParams.messageType"}},e._l(e.msgData,(function(t,a){return s("a-select-option",{key:a,attrs:{value:t.value}},[e._v(e._s(t.description))])})),1)],1),s("div",{staticClass:"search-row"},[s("span",{staticClass:"name"},[e._v("执行日期:")]),s("a-range-picker",{attrs:{value:e.createValue},on:{change:e.onChange}})],1),2==e.queryParams.type?s("div",{staticClass:"search-row"},[s("span",{staticClass:"name"},[e._v("抽查日期:")]),s("a-range-picker",{attrs:{value:e.createValueCheck},on:{change:e.onChangeCheck}})],1):e._e(),1==e.queryParams.type?s("div",{staticClass:"search-row"},[s("span",{staticClass:"name"},[e._v("患者查找:")]),s("a-input",{attrs:{"allow-clear":"",placeholder:"请输入患者姓名或手机号"},on:{blur:e.goSearch,keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.goSearch.apply(null,arguments)},search:e.goSearch},model:{value:e.queryParams.queryStr,callback:function(t){e.$set(e.queryParams,"queryStr",t)},expression:"queryParams.queryStr"}})],1):e._e(),s("div",{staticClass:"action-row"},[s("span",{staticClass:"buttons",style:{float:"right",overflow:"hidden"}},[s("a-button",{attrs:{type:"primary",icon:"search"},on:{click:e.goSearch}},[e._v("查询")]),s("a-button",{staticStyle:{"margin-left":"8px","margin-right":"0"},attrs:{icon:"undo"},on:{click:function(t){return e.reset()}}},[e._v("重置")])],1)])]),s("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,scroll:{x:!0},isShowLoading:!1,data:e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(t,a){return s("span",{},[s("a",{on:{click:function(t){return e.goDetai(a)}}},[e._v("详情")]),1==e.queryParams.type?s("a",{staticStyle:{"margin-left":"6%"},on:{click:function(t){return e.goAction(a)}}},[e._v(e._s(1==e.queryParams.type?"抽查":"详情"))]):e._e(),2==e.queryParams.type?s("a",{staticStyle:{"margin-left":"6%"},on:{click:function(t){return e.goAction(a)}}},[e._v("抽查结果")]):e._e()])}},{key:"result",fn:function(t,a){return s("span",{},[s("span",{class:e.getClass(a.checkStatus)},[e._v(e._s(a.checkStatusName))])])}},{key:"operition",fn:function(t,a){return s("span",{},[s("span",{class:{"span-red":a.overdueStatus&&2==a.overdueStatus.value},attrs:{title:a.followDate}},[e._v(e._s(a.followDate))])])}}])}),s("add-form",{ref:"addForm",on:{ok:e.handleOk}}),s("edit-form",{ref:"editForm",on:{ok:e.handleOk}}),s("check-model",{ref:"checkModel",on:{ok:e.handleOk}}),s("follow-Model",{ref:"followModel",on:{ok:e.handleOk}})],1)],1)])},i=[],r=(a("d3b7"),a("a4d3"),a("e01a"),a("99af"),a("4de4"),a("7db0"),a("4e82"),a("2af9")),n=a("4cab"),o=(a("c1df"),a("9fb0")),l=a("2b0e"),c=(a("ca00"),a("44a3")),u=a("c279"),d=a("35c3"),m=a("dc14"),h={components:{STable:r["s"],addForm:c["default"],editForm:u["default"],checkModel:d["default"],followModel:m["default"]},data:function(){var e=this;return{selectedRowKeys:[],advanced:!1,confirmLoading:!1,quesGot:!1,partChoose:"",keyindex:"1",choseQues:{},keshiData:[],deptUsers:[{userId:"-1",userName:"全部"}],msgData:[],createValue:[],createValueCheck:[],quesData:[],quesDataTemp:[],queryParams:{executeDepartmentId:-1,taskBizStatus:"-1",actualDoctorUserId:"-1",messageType:"-1",beginCheckTime:null,endCheckTime:null,beginExecuteTime:null,endExecuteTime:null,queryStr:null,type:"1",checkStatus:null,messageContentId:null,messageContentType:null},queryParamsOrigin:{executeDepartmentId:-1,taskBizStatus:"-1",actualDoctorUserId:"-1",messageType:"-1",beginCheckTime:null,endCheckTime:null,beginExecuteTime:null,endExecuteTime:null,queryStr:null,type:"1",checkStatus:null,messageContentId:null,messageContentType:null},columns:[{title:"随访方式",dataIndex:"messageTypeName",ellipsis:!0},{title:"状态",dataIndex:"taskBizStatusName",ellipsis:!0},{title:"随访患者",dataIndex:"userName",ellipsis:!0},{title:"性别",dataIndex:"userSex"},{title:"年龄",dataIndex:"userAge"},{title:"联系电话",dataIndex:"userPhone",ellipsis:!0},{title:"随访医生",dataIndex:"doctorName",ellipsis:!0},{title:"执行时间",scopedSlots:{customRender:"operition"},ellipsis:!0},{title:"随访问卷",ellipsis:!0,dataIndex:"questionnaireName"},{title:"操作",width:"100px",fixed:"right",dataIndex:"action",scopedSlots:{customRender:"action"}}],columnsWait:[{title:"随访方式",dataIndex:"messageTypeName",ellipsis:!0},{title:"状态",dataIndex:"taskBizStatusName"},{title:"随访患者",dataIndex:"userName",ellipsis:!0},{title:"性别",dataIndex:"userSex"},{title:"年龄",dataIndex:"userAge"},{title:"联系电话",dataIndex:"userPhone",ellipsis:!0},{title:"随访医生",dataIndex:"doctorName",ellipsis:!0},{title:"执行时间",scopedSlots:{customRender:"operition"},ellipsis:!0},{title:"随访问卷",dataIndex:"questionnaireName",ellipsis:!0},{title:"操作",width:"100px",fixed:"right",dataIndex:"action",scopedSlots:{customRender:"action"}}],columnsAready:[{title:"随访方式",dataIndex:"messageTypeName",ellipsis:!0},{title:"状态",dataIndex:"taskBizStatusName"},{title:"随访患者",ellipsis:!0,dataIndex:"userName"},{title:"性别",dataIndex:"userSex"},{title:"年龄",dataIndex:"userAge"},{title:"联系电话",dataIndex:"userPhone",ellipsis:!0},{title:"随访医生",dataIndex:"doctorName",ellipsis:!0},{title:"执行时间",scopedSlots:{customRender:"operition"},ellipsis:!0},{title:"抽查时间",ellipsis:!0,dataIndex:"checkDate"},{title:"抽查结果",ellipsis:!0,scopedSlots:{customRender:"result"}},{title:"操作",width:"120px",fixed:"right",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadDataOut:[],loadData:function(t){var a=JSON.parse(JSON.stringify(e.queryParams));return"-1"==a.executeDepartmentId&&delete a.executeDepartmentId,"-1"==a.taskBizStatus&&delete a.taskBizStatus,"-1"==a.actualDoctorUserId&&delete a.actualDoctorUserId,"-1"==a.messageType&&delete a.messageType,"1"==a.type&&(delete a.endCheckTime,delete a.beginCheckTime),"2"==a.type&&delete a.queryStr,e.confirmLoading=!0,Object(n["R"])(Object.assign(t,a)).then((function(t){e.quesGot&&(e.confirmLoading=!1);for(var a=0;a<t.data.rows.length;a++)e.$set(t.data.rows[a],"messageTypeName",t.data.rows[a].messageType.description),e.$set(t.data.rows[a],"taskBizStatusName",2==t.data.rows[a].taskBizStatus.value?"成功":"失败"),t.data.rows[a].checkStatus?e.$set(t.data.rows[a],"checkStatusName",1==t.data.rows[a].checkStatus.value?"通过":"不通过"):e.$set(t.data.rows[a],"checkStatusName","");return e.loadDataOut=t.data,t.data})).finally((function(){e.confirmLoading=!1}))},selectedRows:[],chooseDeptItem:{},originData:[],keshiDataTemp:[],taskBizStatusData:[]}},created:function(){var e=this;this.user=l["a"].ls.get(o["o"]),7==this.user.roleId||"admin"==this.user.roleName?Object(n["eb"])().then((function(t){if(0==t.code){t.data.unshift({departmentName:"全部",departmentId:-1});for(var a=0;a<t.data.length;a++)0==a?e.$set(t.data[a],"isChecked",!0):e.$set(t.data[a],"isChecked",!1);e.originData=JSON.parse(JSON.stringify(t.data))}})):Object(n["fb"])().then((function(t){if(0==t.code){t.data.unshift({departmentName:"全部",departmentId:-1});for(var a=0;a<t.data.length;a++)0==a?e.$set(t.data[a],"isChecked",!0):e.$set(t.data[a],"isChecked",!1);e.originData=JSON.parse(JSON.stringify(t.data))}})),Object(n["hd"])().then((function(t){0==t.code&&(e.taskBizStatusData=t.data,e.taskBizStatusData.unshift({value:"-1",description:"全部"}))})),Object(n["Xb"])().then((function(t){0==t.code&&(e.msgData=t.data,e.msgData.unshift({value:"-1",description:"全部"}))})),this.questionnairesOut()},methods:{onRadioClick:function(e){this.queryParams.type=e,1==this.queryParams.type?this.columns=JSON.parse(JSON.stringify(this.columnsWait)):this.columns=JSON.parse(JSON.stringify(this.columnsAready)),this.goSearch()},goSearch:function(){this.$refs.table.refresh(!0)},reset:function(){this.createValue=[],this.createValueCheck=[],this.queryParams=JSON.parse(JSON.stringify(this.queryParamsOrigin)),this.queryParams.messageContentId=this.choseQues.questionnaireId},onClickChange:function(e){"1"==e.target.value?this.columns=JSON.parse(JSON.stringify(this.columnsWait)):this.columns=JSON.parse(JSON.stringify(this.columnsAready)),this.goSearch()},getClass:function(e){return e?1==e.value?"span-gray":2==e.value?"span-red":void 0:""},onChange:function(e,t){this.createValue=e,this.queryParams.beginExecuteTime=t[0],this.queryParams.endExecuteTime=t[1]},onChangeCheck:function(e,t){this.createValueCheck=e,this.queryParams.beginCheckTime=t[0],this.queryParams.endCheckTime=t[1]},onDeptSelect:function(){this.getUsersByDeptIdAndRoleOut(),this.getDeptAllQues()},getFocus:function(){this.queryParams.executeDepartmentId&&-1!=this.queryParams.executeDepartmentId||this.$message.warn("请先选择执行科室")},getUsersByDeptIdAndRoleOut:function(){var e=this;Object(n["Pb"])({departmentId:this.queryParams.executeDepartmentId,roleId:[3,5]}).then((function(t){0==t.code&&(e.deptUsers=[],e.deptUsers.push({userId:"-1",userName:"全部"}),t.data.deptUsers[0].users&&t.data.deptUsers[0].users.length>0&&(e.deptUsers=e.deptUsers.concat(t.data.deptUsers[0].users)))}))},questionnairesOut:function(){var e=this;Object(n["Ec"])({}).then((function(t){if(e.quesGot=!0,0==t.code){if(e.quesData=t.data,!e.quesData||0==e.quesData.length)return;for(var a=0;a<e.quesData.length;a++)e.$set(e.quesData[a],"isChecked",!1);e.$set(e.quesData[0],"isChecked",!0),e.choseQues=JSON.parse(JSON.stringify(e.quesData[0])),e.queryParams.messageContentId=e.choseQues.questionnaireId,e.$refs.table.refresh(!0),e.quesDataTemp=JSON.parse(JSON.stringify(e.quesData))}}))},handleSearch:function(e){this.quesDataTemp=e?this.quesData.filter((function(t){return-1!=t.questionnaireName.indexOf(e)})):JSON.parse(JSON.stringify(this.quesData))},onSelect:function(e,t){var a=this.quesData.find((function(t){return t.questionnaireId==e}));this.choseQues=JSON.parse(JSON.stringify(a));var s=this.getIndex(e);this.onItemClick({},s)},getIndex:function(e){for(var t=-1,a=0;a<this.quesData.length;a++)if(this.quesData[a].questionnaireId==e)return t=a,t;return t},onItemClick:function(e,t){for(var a=0;a<this.quesData.length;a++)this.$set(this.quesData[a],"isChecked",!1);this.$set(this.quesData[t],"isChecked",!0),this.choseQues=JSON.parse(JSON.stringify(this.quesData[t])),this.queryParams.messageContentId=this.choseQues.questionnaireId,this.$refs.table.refresh(!0)},countAge:function(e){var t=e.substring(0,4)+"-"+e.substring(4,6)+"-"+e.substring(6,8),a=new Date(t),s=new Date;e=s.getFullYear()-a.getFullYear()-(s.getMonth()<a.getMonth()||s.getMonth()==a.getMonth()&&s.getDate()<a.getDate()?1:0);return e},onPartChoose:function(e){this.chooseDeptItem=this.keshiData[e];for(var t=0;t<this.keshiData.length;t++)this.$set(this.keshiData[t],"isChecked",!1),t==e&&(this.$set(this.keshiData[t],"isChecked",!0),"-2"==this.keshiData[t].departmentId?this.queryParam.bqmc="":this.queryParam.bqmc=this.keshiData[t].departmentName,this.$refs.table.refresh())},goAction:function(e){1==e.type?this.$refs.checkModel.doDeal(e):2==e.type&&this.$refs.checkModel.doInfo(e)},goDetai:function(e){2==e.type&&this.$set(e,"isCheckInfo",!0),e.id=e.recordId,this.$refs.followModel.doInfo(e)},dispatchPlan:function(){if(0!=this.selectedRowKeys.length){for(var e=[],t=0;t<this.selectedRowKeys.length;t++)e.push(this.loadDataOut.rows[this.selectedRowKeys[t]]);for(var a=[],s=0;s<e.length;s++)a.push(e[s].ks);a.sort();for(var i=0;i<a.length-1;i++)if(a[i]!=a[i+1])return void this.$message.error("请选择同一个科室的患者");this.$router.push({name:"dispatch_plan",query:e})}else this.$message.error("请勾选分配计划的患者")},handleOk:function(){this.$refs.table.refresh()}}},p=h,f=(a("0381"),a("2877")),g=Object(f["a"])(p,s,i,!1,null,"c348ed70",null);t["default"]=g.exports},"6f2b":function(e,t,a){e.exports=a.p+"assets/icon_wait.2d9c56d2.svg"},"74a4":function(e,t,a){},"95c0":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-card",{staticClass:"sys-card",attrs:{bordered:!1,confirmLoading:e.confirmLoading}},[a("div",{staticClass:"table-page-search-wrapper"},[a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[e._v("统计方式:")]),a("a-select",{staticClass:"sitemore",staticStyle:{width:"120px",height:"28px"},attrs:{"allow-clear":"",placeholder:"请选择统计方式"},on:{select:e.onSelected},model:{value:e.queryParamsStatisit.statType,callback:function(t){e.$set(e.queryParamsStatisit,"statType",t)},expression:"queryParamsStatisit.statType"}},e._l(e.StatisticsMode,(function(t,s){return a("a-select-option",{key:s,staticStyle:{height:"28px !important"},attrs:{value:t.code}},[e._v(e._s(t.value))])})),1)],1),a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[e._v("执行科室:")]),a("a-select",{staticClass:"sitemore",staticStyle:{"min-width":"120px",height:"28px"},attrs:{maxTagCount:1,"collapse-tags":!0,"allow-clear":"",mode:"multiple",placeholder:"请选择科室"},model:{value:e.queryParamsStatisit.execDept,callback:function(t){e.$set(e.queryParamsStatisit,"execDept",t)},expression:"queryParamsStatisit.execDept"}},e._l(e.originData,(function(t,s){return a("a-select-option",{key:s,staticStyle:{"max-height":"28px","padding-bottom":"0px"},attrs:{value:t.departmentId}},[e._v(e._s(t.departmentName))])})),1)],1),a("div",{staticClass:"search-row",staticStyle:{"margin-left":"15px","padding-bottom":"0%"}},[a("span",{staticClass:"name"},[e._v("时间:")]),a("a-range-picker",{staticStyle:{height:"28px !important"},attrs:{value:e.createValue},on:{change:e.onChange}})],1),a("div",{staticClass:"action-row"},[a("span",{staticClass:"buttons",style:{float:"right",overflow:"hidden"}},[a("a-button",{attrs:{type:"primary",icon:"search"},on:{click:function(t){return e.$refs.tableStat.refresh(!0)}}},[e._v("查询")]),a("a-button",{staticStyle:{"margin-left":"8px","margin-right":"0"},attrs:{icon:"undo"},on:{click:function(t){return e.reset()}}},[e._v("重置")])],1)])]),a("s-table",{ref:"tableStat",staticClass:"table-hover-hidden",staticStyle:{"overflow-y":"auto"},attrs:{showPagination:!1,scroll:{y:700,x:0},bordered:"",size:"default",columns:e.columnsStat,data:e.loadDataStat,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action_total",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.$refs.statisitDetail.checkDetail(s,1)}}},[e._v(e._s(s.total))])])}},{key:"action_success",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.$refs.statisitDetail.checkDetail(s,2)}}},[e._v(e._s(s.success))])])}},{key:"action_fail",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.$refs.statisitDetail.checkDetail(s,3)}}},[e._v(" "+e._s(s.fail))])])}},{key:"action_overdue",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.$refs.statisitDetail.checkDetail(s,4)}}},[e._v(e._s(s.overdue))])])}}])},[1==e.queryParamsStatisit.statType?a("template",{slot:"titleNNN"},[e._v("按随访方案")]):e._e(),2==e.queryParamsStatisit.statType?a("template",{slot:"titleNNN"},[e._v("按执行科室")]):e._e(),3==e.queryParamsStatisit.statType?a("template",{slot:"titleNNN"},[e._v("按问卷")]):e._e()],2),a("statisit-Detail",{ref:"statisitDetail",on:{ok:e.handleOk}})],1)},i=[],r=(a("d3b7"),a("159b"),a("c1df")),n=a.n(r),o=a("2af9"),l=a("4cab"),c=a("f914"),u=a("2b0e"),d=a("9fb0"),m=a("ca00"),h={components:{STable:o["s"],statisitDetail:c["default"]},data:function(){var e=this,t=[],a=0,s=function(e,a,s){var i={children:e,attrs:{}},r=t[s],n=r>0?1:0;return i.attrs={rowSpan:r,colSpan:n},i},i=function(e){t=[],a=0,e.forEach((function(s,i){0===i?(t.push(1),a=0):e[i].planName===e[i-1].planName?(t[a]+=1,t.push(0)):(t.push(1),a=i)}))};return{confirmLoading:!1,originData:[],createValue:[],createValueBor:[],titleName:"按随访方案",labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:11}},form:this.$form.createForm(this),queryParamsStatisit:{beginDate:Object(m["i"])(),endDate:Object(m["c"])((new Date).getTime()),execDept:[],hospitalCode:"",statType:1,tenantId:""},columnsStat:[{dataIndex:"planName",scopedSlots:{customRender:"action",title:"titleNNN"},customRender:s},{title:"随访方式",dataIndex:"messageName"},{title:"任务数",dataIndex:"total",scopedSlots:{customRender:"action_total"}},{title:"成功数",dataIndex:"success",scopedSlots:{customRender:"action_success"}},{title:"成功率",dataIndex:"successRate"},{title:"失败数",dataIndex:"fail",scopedSlots:{customRender:"action_fail"}},{title:"失败率",dataIndex:"failRate"},{title:"逾期数",dataIndex:"overdue",scopedSlots:{customRender:"action_overdue"}},{title:"逾期率",dataIndex:"overdueRate"}],user:{},StatisticsMode:[{code:1,value:"按随访方案"},{code:2,value:"按执行科室"},{code:3,value:"按问卷"}],dateFormat:"YYYY-MM-DD",loadDataStat:function(t){e.user=u["a"].ls.get(d["o"]);var a=JSON.parse(JSON.stringify(e.queryParamsStatisit));return 0==e.originData.length&&"admin"!=e.user.roleName&&(a.execDept="-1"),Object(l["Wc"])(Object.assign(t,a)).then((function(t){if(0==t.code){var a={pageNo:1,pageSize:t.data.length,totalRows:t.data.length,totalPage:1,rows:t.data};return a.rows.forEach((function(t,a){e.$set(t,"successRate",Math.round(100*t.successRate)+"%"),e.$set(t,"failRate",Math.round(100*t.failRate)+"%"),e.$set(t,"overdueRate",Math.round(100*t.overdueRate)+"%"),e.$set(t,"statType",e.queryParamsStatisit.statType),e.$set(t,"beginDate",e.queryParamsStatisit.beginDate),e.$set(t,"endDate",e.queryParamsStatisit.endDate),e.$set(t,"execDept",e.queryParamsStatisit.execDept)})),i(a.rows),a}}))}}},created:function(){var e=this;this.user=u["a"].ls.get(d["o"]),this.confirmLoading=!0,7==this.user.roleId||"admin"==this.user.roleName?Object(l["eb"])().then((function(t){0==t.code&&(e.originData=t.data)})).finally((function(t){e.confirmLoading=!1})):Object(l["fb"])().then((function(t){if(0==t.code){if(e.originData=t.data,0==t.data.length)e.queryParamsStatisit.execDept=["暂无科室"];else{var a=[];t.data.forEach((function(e,t){a.push(e.departmentId)})),e.queryParamsStatisit.execDept=a}e.$refs.tableStat.refresh(!0)}})).finally((function(t){e.confirmLoading=!1})),this.createValue=[n()(Object(m["i"])(),this.dateFormat),n()(Object(m["c"])((new Date).getTime()),this.dateFormat)],this.createValueBor=[n()(Object(m["f"])(),this.dateFormat),n()(Object(m["f"])(),this.dateFormat)]},methods:{onChange:function(e,t){this.createValue=e,this.queryParamsStatisit.beginDate=t[0],this.queryParamsStatisit.endDate=t[1]},onSelected:function(e){1==e?this.titleName="按随访方案":2==e?this.titleName="按执行科室":3==e&&(this.titleName="按问卷"),this.$refs.tableStat.refresh(!0)},handleOk:function(){this.$refs.table.refresh()},reset:function(){this.queryParamsStatisit.statType="",this.queryParamsStatisit.execDept=[],this.$refs.tableStat.refresh(!0)}}},p=h,f=(a("da11"),a("2877")),g=Object(f["a"])(p,s,i,!1,null,null,null);t["default"]=g.exports},c08a:function(e,t,a){},c279:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"修改医生用户",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("a-form",{attrs:{form:e.form}},[a("a-form-item",{staticStyle:{display:"none"},attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["id"],expression:"['id']"}]})],1),a("a-form-item",{attrs:{label:"姓名",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["xm",{rules:[{required:!0,message:"请输入姓名！"}]}],expression:"['xm', { rules: [{ required: true, message: '请输入姓名！' }] }]"}],attrs:{disabled:"",placeholder:"请输入姓名"}})],1),a("a-form-item",{attrs:{label:"性别",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["xb",{rules:[{required:!0,message:"请选择性别！"}]}],expression:"['xb', { rules: [{ required: true, message: '请选择性别！' }] }]"}],attrs:{name:"radioGroup","default-value":1}},[a("a-radio",{attrs:{value:1}},[e._v(" 男 ")]),a("a-radio",{staticStyle:{width:"100px"},attrs:{value:2}},[e._v(" 女 ")])],1)],1),a("a-form-item",{attrs:{label:"所属机构科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["jg",{rules:[{required:!0,message:"请选择机构"}]}],expression:"['jg', { rules: [{ required: true, message: '请选择机构' }] }]"}],attrs:{"allow-clear":"",placeholder:"湘雅附二医院"}},e._l(e.hosData,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.code}},[e._v(e._s(t.value))])})),1)],1),a("a-form-item",{attrs:{label:"科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["ssks",{rules:[{required:!0,message:"请选择科室"}]}],expression:"['ssks', { rules: [{ required: true, message: '请选择科室' }] }]"}],attrs:{"allow-clear":"",placeholder:"请选择科室"},on:{select:e.onSelected}},e._l(e.keshiData,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.yyksdm}},[e._v(e._s(t.yyksmc))])})),1)],1),a("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"职称","has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["zhic",{rules:[{required:!0,message:"请输入职称！"}]}],expression:"['zhic', { rules: [{ required: true, message: '请输入职称！' }] }]"}],attrs:{placeholder:"请输入职称"}})],1),a("a-form-item",{attrs:{label:"手机号码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[a("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["tel",{rules:[{required:!0,message:"请输入手机号码！"}]}],expression:"['tel', { rules: [{ required: true, message: '请输入手机号码！' }] }]"}],attrs:{placeholder:"请输入手机号码"}})],1)],1)],1)],1)},i=[],r=(a("99af"),a("d3b7"),a("4cab")),n={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},keshiData:[],hosData:[{code:"444885559",value:"湘雅附二医院"}],visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},created:function(){this.getKeShi()},methods:{edit:function(e){var t=this;this.visible=!0,setTimeout((function(){t.form.setFieldsValue({id:e.id,xm:e.xm,jg:"湘雅附二医院",ssks:e.ssks,zhic:e.zhic,tel:e.tel}),"男"!=e.xb&&e.xb?t.form.setFieldsValue({xb:2}):t.form.setFieldsValue({xb:1})}),100)},onSelected:function(e){for(var t=0;t<this.keshiData.length;t++)this.keshiData[t].yyksdm==e&&(this.seletSsksName=this.keshiData[t].yyksmc)},getKeShi:function(){var e=this;Object(r["pb"])({hospitalCode:"444885559"}).then((function(t){if(t.success){for(var a=[],s=0;s<t.data.length;s++)t.data[s].departmentList&&t.data[s].departmentList.length>0&&(a=a.concat(t.data[s].departmentList));e.keshiData=a}})).catch((function(e){}))},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){t?e.confirmLoading=!1:(1==a.xb?a.xb="男":a.xb="女",a.ssksName=e.seletSsksName,delete a.jg,Object(r["i"])(a).then((function(t){t.success?(e.$message.success("编辑成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",a),e.form.resetFields()):e.$message.error("编辑失败："+t.message)})).finally((function(t){e.confirmLoading=!1})))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},o=n,l=a("2877"),c=Object(l["a"])(o,s,i,!1,null,null,null);t["default"]=c.exports},da11:function(e,t,a){"use strict";a("1d5c")},f914:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:e.titleTop,width:1e3,height:650,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-card",{staticClass:"card-top-pac",attrs:{bordered:!1}},[a("div",{staticClass:"table-page-wrapper",staticStyle:{"margin-top":"-2%"}},[a("div",{staticClass:"div-line-wrap"})]),a("s-table",{ref:"table",staticStyle:{"margin-top":"2%"},attrs:{size:"default",pagination:!1,data:e.loadData,columns:e.columns,alert:!0,rowKey:function(e){return e.code}}})],1)],1)},i=[],r=(a("d3b7"),a("159b"),a("a4d3"),a("e01a"),a("4cab")),n=a("2af9"),o={components:{STable:n["s"]},data:function(){var e=this;return{record:{},labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,detailList:[],form:this.$form.createForm(this),titleTop:"",confirmLoading:!1,queryParamsData:{beginDate:"",endDate:"",execDept:[],flag:"",messageType:"",planId:"",statType:""},columns:[{title:"序号",dataIndex:"xh"},{title:"随访方式",dataIndex:"messageType"},{title:"状态",dataIndex:"taskBizStatus"},{title:"随访患者",dataIndex:"userName"},{title:"联系电话",dataIndex:"tel"},{title:"随访医生",dataIndex:"execDoc"},{title:"随访日期",dataIndex:"executeTime"},{title:"随访方案",dataIndex:"planName"}],loadData:function(t){return e.confirmLoading=!0,Object(r["Xc"])(Object.assign(t,e.queryParamsData)).then((function(a){var s={pageNo:t.pageNo,pageSize:t.pageSize,totalRows:a.data.totalRows,totalPage:a.data.totalRows/t.pageSize,rows:a.data.rows};return 0==a.code&&a.data.rows.length>0&&s.rows.forEach((function(t,a){t.xh=(s.pageNo-1)*s.pageSize+(a+1),e.$set(t,"messageType",null!=t.messageType?t.messageType.description:""),e.$set(t,"taskBizStatus",null!=t.taskBizStatus?t.taskBizStatus.description:"")})),a.data})).finally((function(t){e.confirmLoading=!1}))}}},methods:{checkDetail:function(e,t){var a=this;this.visible=!0,this.reset();var s="";s=1==t?"任务数":4==t?"逾期数":1==e.success?"成功":"失败",this.titleTop=e.planName+"-"+e.messageName+"-"+s+" 【"+e.beginDate+" 至 "+e.endDate+"】",this.queryParamsData.beginDate=e.beginDate,this.queryParamsData.endDate=e.endDate,this.queryParamsData.execDept=e.execDept,this.queryParamsData.flag=t,this.queryParamsData.messageType="合计"==e.messageType?"":e.messageType,this.queryParamsData.planId="合计"==e.planId?"":e.planId,this.queryParamsData.statType=e.statType,this.$nextTick((function(){a.$refs.table.refresh()}))},handleCancel:function(){this.form.resetFields(),this.visible=!1},handleSubmit:function(){this.visible=!1},reset:function(){this.queryParamsData.beginDate="",this.queryParamsData.endDate="",this.queryParamsData.execDept=[],this.queryParamsData.flag="",this.queryParamsData.messageType="",this.queryParamsData.planId="",this.queryParamsData.statType=""}}},l=o,c=(a("0010"),a("2877")),u=Object(c["a"])(l,s,i,!1,null,null,null);t["default"]=u.exports}}]);