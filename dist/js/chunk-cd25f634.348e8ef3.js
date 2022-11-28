(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cd25f634","chunk-63ab5f1e","chunk-1dc674ae","chunk-2d2167e5","chunk-2d0b9dd0","chunk-2d221bf9","chunk-2d0b32ba"],{"1a6c":function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",[t("div",{staticClass:"div-inquiry-text"},[t("a-card",{staticClass:"card-right",attrs:{bordered:!1}},[t("div",{staticClass:"table-page-search-wrapper"},[t("a-form",{attrs:{layout:"inline"}},[t("a-row",{attrs:{gutter:48}},[1==e.user.departmentCode||"admin"==e.user.roleName?t("a-col",{attrs:{md:6,sm:24}},[t("a-form-item",{attrs:{label:"科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-select",{attrs:{"allow-clear":"",mode:"multiple",placeholder:"请选择科室"},model:{value:e.queryParamsStat.deptCodes,callback:function(a){e.$set(e.queryParamsStat,"deptCodes",a)},expression:"queryParamsStat.deptCodes"}},e._l(e.originData,(function(a,s){return t("a-select-option",{key:s,attrs:{value:a.departmentId}},[e._v(e._s(a.departmentName))])})),1)],1)],1):e._e(),t("a-col",{attrs:{md:6,sm:24}},[t("a-form-item",{attrs:{label:"状态"}},[t("a-select",{attrs:{"allow-clear":"",placeholder:"请选择状态"},model:{value:e.queryParamsStat.status,callback:function(a){e.$set(e.queryParamsStat,"status",a)},expression:"queryParamsStat.status"}},e._l(e.statusData,(function(a,s){return t("a-select-option",{key:s,attrs:{value:a.code}},[e._v(e._s(a.value))])})),1)],1)],1),t("a-col",{attrs:{md:6,sm:24}},[t("a-form-item",{attrs:{label:"抽查状态"}},[t("a-select",{attrs:{"allow-clear":"",placeholder:"请选择抽查状态"},model:{value:e.queryParamsStat.checkStatus,callback:function(a){e.$set(e.queryParamsStat,"checkStatus",a)},expression:"queryParamsStat.checkStatus"}},e._l(e.statusDataCheck,(function(a,s){return t("a-select-option",{key:s,attrs:{value:a.code}},[e._v(e._s(a.value))])})),1)],1)],1),t("a-col",{attrs:{md:7,sm:24}},[t("a-form-item",{attrs:{label:"时间"}},[t("a-range-picker",{attrs:{value:e.createValue},on:{change:e.onChange}})],1)],1),t("a-col",{attrs:{md:5,sm:24}},[1==e.user.departmentCode||"admin"==e.user.roleName?t("a-button",{staticStyle:{"margin-right":"3%"},attrs:{type:"primary"},on:{click:e.reset}},[e._v("全院")]):e._e(),t("a-button",{attrs:{type:"primary"},on:{click:function(a){return e.$refs.tableStat.refresh(!0)}}},[e._v("查询")])],1)],1)],1)],1),t("s-table",{ref:"tableStat",attrs:{size:"default",columns:e.columnsStat,data:e.loadDataStat,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(a,s){return t("span",{},[4==s.status?t("a",{on:{click:function(a){return e.$refs.statSolve.doDeal(s)}}},[e._v("处理")]):e._e(),4==s.status?t("a-divider",{attrs:{type:"vertical"}}):e._e(),t("a",{on:{click:function(a){return e.$refs.statSolve.doInfo(s)}}},[e._v("详情")]),5==s.status?t("a-divider",{attrs:{type:"vertical"}}):e._e(),5==s.status&&0==s.checkStatus?t("a",{on:{click:function(a){return e.$refs.statSolve.doCheck(s)}}},[e._v("抽查")]):e._e(),5==s.status&&1==s.checkStatus?t("a",{on:{click:function(a){return e.$refs.statSolve.checkInfo(s)}}},[e._v("抽查详情")]):e._e()],1)}}])}),t("stat-detail",{ref:"statDetail",on:{ok:e.handleOkStat}}),t("stat-solve",{ref:"statSolve",on:{ok:e.handleOkStat}})],1)],1)])},i=[],r=t("2af9"),n=t("4cab"),l=t("c365"),o=t("cc58"),c=t("3580"),d=t("26dd"),u=t("c1df"),m=t.n(u),p=t("389a"),h=t("2837"),f=t("9fb0"),v=t("2b0e"),b=t("ca00"),g={components:{STable:r["s"],addForm:l["default"],editForm:o["default"],addFormDispatch:c["default"],editFormDispatch:d["default"],statDetail:p["default"],statSolve:h["default"]},data:function(){var e=this;return{labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:11}},queryParamsStat:{deptCodes:[],status:void 0,checkStatus:void 0,beginDate:Object(b["f"])(),endDate:Object(b["e"])()},queryParamsStatOrigin:{deptCodes:[],status:void 0,checkStatus:void 0,beginDate:"",endDate:""},columnsStat:[{title:"序号",dataIndex:"xh"},{title:"患者",dataIndex:"xm"},{title:"所在病区",dataIndex:"bqmc"},{title:"性别",dataIndex:"xbmc"},{title:"年龄",dataIndex:"nl"},{title:"科室",dataIndex:"ksmc"},{title:"专病",dataIndex:"cyzd"},{title:"登记时间",dataIndex:"createTimeOut"},{title:"住院号",dataIndex:"zyh"},{title:"出院时间",dataIndex:"cysj"},{title:"执行计划",dataIndex:"planName"},{title:"抽查状态",dataIndex:"checkText"},{title:"状态",dataIndex:"stateText"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],createValue:[],createValueBor:[],originData:[],user:{},statusData:[{code:-1,value:"全部"},{code:1,value:"未注册"},{code:2,value:"待分配"},{code:3,value:"执行中"},{code:4,value:"超时"},{code:5,value:"电话随访"},{code:6,value:"失访"},{code:7,value:"已完成"}],statusDataCheck:[{code:-1,value:"全部"},{code:1,value:"已抽查"},{code:0,value:"未抽查"}],dateFormat:"YYYY-MM-DD",loadDataStat:function(a){return-1==e.queryParamsStat.status&&delete params.status,-1==e.queryParamsStat.checkStatus&&delete params.checkStatus,Object(n["Bc"])(Object.assign(a,e.queryParamsStat)).then((function(a){if(0==a.code){for(var t=0;t<a.data.rows.length;t++)e.$set(a.data.rows[t],"xh",t+1+(a.data.pageNo-1)*a.data.pageSize),e.$set(a.data.rows[t],"stateText",e.getClassText(a.data.rows[t].status)),5==a.data.rows[t].status?e.$set(a.data.rows[t],"checkText",e.getCheckText(a.data.rows[t].checkStatus)):e.$set(a.data.rows[t],"checkText",""),e.$set(a.data.rows[t],"createTimeOut",Object(b["c"])(a.data.rows[t].createTime));return a.data}}))}}},created:function(){var e=this;Object(n["gb"])().then((function(a){if(0==a.code){e.originData=a.data,a.data.unshift({departmentId:"-2",departmentName:"全部",hospitalId:1,parentId:0,children:null});for(var t=0;t<a.data.length;t++)0==t?e.$set(a.data[t],"isChecked",!0):e.$set(a.data[t],"isChecked",!1);e.keshiData=a.data,e.keshiDataTemp=JSON.parse(JSON.stringify(e.originData))}})),this.createValue=[m()(Object(b["f"])(),this.dateFormat),m()(Object(b["e"])(),this.dateFormat)],this.createValueBor=[m()(Object(b["f"])(),this.dateFormat),m()(Object(b["e"])(),this.dateFormat)],this.user=v["a"].ls.get(f["p"])},methods:{onChange:function(e,a){this.createValue=e,this.queryParamsStat.beginDate=a[0],this.queryParamsStat.endDate=a[1]},reset:function(){this.queryParamsStat=JSON.parse(JSON.stringify(this.queryParamsStatOrigin)),this.createValue=[],this.$refs.tableStat.refresh()},getClassText:function(e){return 1==e?"未注册":2==e?"待分配":3==e?"执行中":4==e?"超时":5==e?"电话随访":6==e?"失访":7==e?"已完成":void 0},getCheckText:function(e){return 0==e?"未抽查":1==e?"已抽查":void 0},handleOkStat:function(){this.$refs.tableStat.refresh()}}},C=g,k=(t("5ee3"),t("2877")),w=Object(k["a"])(C,s,i,!1,null,null,null);a["default"]=w.exports},"1da1":function(e,a,t){"use strict";t.d(a,"a",(function(){return i}));t("d3b7");function s(e,a,t,s,i,r,n){try{var l=e[r](n),o=l.value}catch(c){return void t(c)}l.done?a(o):Promise.resolve(o).then(s,i)}function i(e){return function(){var a=this,t=arguments;return new Promise((function(i,r){var n=e.apply(a,t);function l(e){s(n,i,r,l,o,"next",e)}function o(e){s(n,i,r,l,o,"throw",e)}l(void 0)}))}}},"26dd":function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-modal",{attrs:{title:"修改医生用户",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[t("a-spin",{attrs:{spinning:e.confirmLoading}},[t("a-form",{attrs:{form:e.form}},[t("a-form-item",{staticStyle:{display:"none"},attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["id"],expression:"['id']"}]})],1),t("a-form-item",{attrs:{label:"姓名",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["xm",{rules:[{required:!0,message:"请输入姓名！"}]}],expression:"['xm', { rules: [{ required: true, message: '请输入姓名！' }] }]"}],attrs:{disabled:"",placeholder:"请输入姓名"}})],1),t("a-form-item",{attrs:{label:"性别",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["xb",{rules:[{required:!0,message:"请选择性别！"}]}],expression:"['xb', { rules: [{ required: true, message: '请选择性别！' }] }]"}],attrs:{name:"radioGroup","default-value":1}},[t("a-radio",{attrs:{value:1}},[e._v(" 男 ")]),t("a-radio",{staticStyle:{width:"100px"},attrs:{value:2}},[e._v(" 女 ")])],1)],1),t("a-form-item",{attrs:{label:"所属机构科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["jg",{rules:[{required:!0,message:"请选择机构"}]}],expression:"['jg', { rules: [{ required: true, message: '请选择机构' }] }]"}],attrs:{"allow-clear":"",placeholder:"湘雅附二医院"}},e._l(e.hosData,(function(a,s){return t("a-select-option",{key:s,attrs:{value:a.code}},[e._v(e._s(a.value))])})),1)],1),t("a-form-item",{attrs:{label:"科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["ssks",{rules:[{required:!0,message:"请选择科室"}]}],expression:"['ssks', { rules: [{ required: true, message: '请选择科室' }] }]"}],attrs:{"allow-clear":"",placeholder:"请选择科室"},on:{select:e.onSelected}},e._l(e.keshiData,(function(a,s){return t("a-select-option",{key:s,attrs:{value:a.yyksdm}},[e._v(e._s(a.yyksmc))])})),1)],1),t("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"职称","has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["zhic",{rules:[{required:!0,message:"请输入职称！"}]}],expression:"['zhic', { rules: [{ required: true, message: '请输入职称！' }] }]"}],attrs:{placeholder:"请输入职称"}})],1),t("a-form-item",{attrs:{label:"手机号码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["tel",{rules:[{required:!0,message:"请输入手机号码！"}]}],expression:"['tel', { rules: [{ required: true, message: '请输入手机号码！' }] }]"}],attrs:{placeholder:"请输入手机号码"}})],1)],1)],1)],1)},i=[],r=(t("99af"),t("d3b7"),t("4cab")),n={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},keshiData:[],hosData:[{code:"444885559",value:"湘雅附二医院"}],visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},created:function(){this.getKeShi()},methods:{edit:function(e){var a=this;this.visible=!0,setTimeout((function(){a.form.setFieldsValue({id:e.id,xm:e.xm,jg:"湘雅附二医院",ssks:e.ssks,zhic:e.zhic,tel:e.tel}),"男"!=e.xb&&e.xb?a.form.setFieldsValue({xb:2}):a.form.setFieldsValue({xb:1})}),100)},onSelected:function(e){for(var a=0;a<this.keshiData.length;a++)this.keshiData[a].yyksdm==e&&(this.seletSsksName=this.keshiData[a].yyksmc)},getKeShi:function(){var e=this;Object(r["rb"])({hospitalCode:"444885559"}).then((function(a){if(a.success){for(var t=[],s=0;s<a.data.length;s++)a.data[s].departmentList&&a.data[s].departmentList.length>0&&(t=t.concat(a.data[s].departmentList));e.keshiData=t}})).catch((function(e){}))},handleSubmit:function(){var e=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,t){a?e.confirmLoading=!1:(1==t.xb?t.xb="男":t.xb="女",t.ssksName=e.seletSsksName,delete t.jg,Object(r["i"])(t).then((function(a){a.success?(e.$message.success("编辑成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",t),e.form.resetFields()):e.$message.error("编辑失败："+a.message)})).finally((function(a){e.confirmLoading=!1})))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},l=n,o=t("2877"),c=Object(o["a"])(l,s,i,!1,null,null,null);a["default"]=c.exports},2837:function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-modal",{attrs:{title:e.DealEnd?e.CheckEnd?"抽查详情":"抽查":"处理",width:900,visible:e.visible,confirmLoading:e.confirmLoading,footer:null},on:{cancel:e.handleCancel}},[t("a-spin",{attrs:{spinning:e.confirmLoading}},[t("div",{staticClass:"div-appoint-detail"},[t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v("患者 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.patientInfo.baseInfo.userName)+" ")]),t("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 身份证号 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.patientInfo?e.subStringIdcardNo(e.patientInfo.baseInfo.identificationNo):"")+" ")])]),t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 电话号码 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.patientInfo.externalInfo.phone)+" ")]),t("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 紧急联系电话 :")]),t("span",{staticClass:"span-item-value"})]),t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 所在病区 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.szbq)+" ")]),t("span",{staticClass:"span-item-value"})]),t("div",{staticClass:"div-divider"}),e.DealEnd?t("div",[t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 处理人 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.handleName)+" ")]),t("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 处理时间 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.handleTime)+" ")])]),t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 处理措施 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(0===e.radioTyPe?"填写问卷":"失访"))])]),t("div",{directives:[{name:"show",rawName:"v-show",value:1===e.radioTyPe,expression:"radioTyPe === 1"}],staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 失访理由 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.handleResult))])]),t("div",{directives:[{name:"show",rawName:"v-show",value:0===e.radioTyPe,expression:"radioTyPe === 0"}],staticStyle:{"min-height":"500px","overflow-y":"auto"}},[t("iframe",{staticStyle:{width:"100%","min-height":"500px",overflow:"scroll"},attrs:{src:e.questionUrl,frameborder:"0",scrolling:"yes"}})])]):e._e(),e.DealEnd?e._e():t("div",[t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 处理人 :")]),t("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block"},attrs:{maxLength:30,"allow-clear":"",placeholder:"请填写处理人姓名"},model:{value:e.handleName,callback:function(a){e.handleName=a},expression:"handleName"}}),t("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 处理时间 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.handleTime)+" ")])],1),t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 处理措施 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.reqDocName)+" ")]),t("a-radio-group",{staticStyle:{width:"300px","margin-left":"-30%"},attrs:{name:"radioGroup","default-value":e.radioTyPe},on:{change:e.radioChange}},[t("a-radio",{attrs:{value:0}},[e._v(" 填写问卷 ")]),t("a-radio",{attrs:{value:1}},[e._v(" 失访 ")])],1),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.diagnosis)+" ")])],1),t("div",{directives:[{name:"show",rawName:"v-show",value:1===e.radioTyPe,expression:"radioTyPe === 1"}],staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 失访理由 :")]),t("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"80%"},attrs:{"allow-clear":"",placeholder:"请填写失访理由"},model:{value:e.handleResult,callback:function(a){e.handleResult=a},expression:"handleResult"}})],1),t("div",{directives:[{name:"show",rawName:"v-show",value:0===e.radioTyPe,expression:"radioTyPe === 0"}],staticStyle:{"margin-top":"50rpx","min-height":"500px","overflow-y":"auto"}},[t("iframe",{staticStyle:{width:"100%","min-height":"500px",overflow:"scroll"},attrs:{src:e.questionUrl,frameborder:"0",scrolling:"yes"}})]),t("div",{staticStyle:{"margin-top":"50px"}},[t("a-button",{staticStyle:{"margin-left":"35%",width:"30%"},attrs:{size:"large",type:"primary"},on:{click:e.goConfirm}},[e._v(" 处理完成 ")])],1)]),e.DealEnd&&!e.CheckEnd?t("div",[t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 抽查人 :")]),t("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block"},attrs:{maxLength:30,"allow-clear":"",placeholder:"请填写抽查人姓名"},model:{value:e.checkName,callback:function(a){e.checkName=a},expression:"checkName"}}),t("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 抽查时间 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.checkTime)+" ")])],1),t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 抽查结果 :")]),t("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block",width:"80%"},attrs:{"allow-clear":"",placeholder:"请填写抽查结果"},model:{value:e.checkResult,callback:function(a){e.checkResult=a},expression:"checkResult"}})],1),t("div",{staticStyle:{"margin-top":"50px"}},[t("a-button",{staticStyle:{"margin-left":"35%",width:"30%"},attrs:{size:"large",type:"primary"},on:{click:e.gocheck}},[e._v(" 确定 ")])],1)]):e._e(),e.CheckEnd?t("div",[t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 抽查人 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.checkName)+" ")]),t("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 抽查时间 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.checkTime)+" ")])]),t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 抽查结果 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.checkResult))])])]):e._e(),t("div",{staticStyle:{height:"50px","backgroud-color":"white"}})])])],1)},i=[],r=t("1da1"),n=t("ade3"),l=(t("16c9"),t("387a")),o=(t("96cf"),t("b0c0"),t("99af"),t("ac1f"),t("5319"),t("d3b7"),t("4cab")),c={components:Object(n["a"])({},l["a"].Item.name,l["a"].Item),data:function(){return{DealEnd:!1,CheckEnd:!1,patientId:"",planId:"",patientInfo:{baseInfo:{identificationNo:"",userName:""},externalInfo:{phone:""}},szbq:"",radioTyPe:0,handleName:"",handleTime:"",handleResult:"",checkTime:"",checkName:"",checkResult:"",questionTaskContent:{},questionUrl:"",labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this),record:{},previewImageDetail:"",previewVisibleDetail:!1}},methods:{formatDate:function(e){e=new Date(e);var a=e.getFullYear(),t=e.getMonth()+1,s=e.getDate();return t<10&&(t="0"+t),s<10&&(s="0"+s),"".concat(a,"-").concat(t,"-").concat(s)},doDeal:function(e){this.record=e,this.patientId=e.userId,this.visible=!0,this.planId=e.planId,this.szbq=e.ksmc===e.bqmc?e.ksmc:e.ksmc+e.bqmc,this.handleTime=this.formatDate(new Date),this.getPatientBaseInfo(),this.getQueryHealthPlanTaskList()},doCheck:function(e){this.record=e,this.patientId=e.userId,this.visible=!0,this.planId=e.planId,this.szbq=e.ksmc===e.bqmc?e.ksmc:e.ksmc+e.bqmc,this.DealEnd=!0,this.checkTime=this.formatDate(new Date),this.getPatientBaseInfo(),this.getDealInfo(),this.getQueryHealthPlanTaskList()},checkInfo:function(e){this.record=e,this.patientId=e.userId,this.visible=!0,this.planId=e.planId,this.szbq=e.ksmc===e.bqmc?e.ksmc:e.ksmc+e.bqmc,this.DealEnd=!0,this.CheckEnd=!0,this.getPatientBaseInfo(),this.getDealInfo(),this.getCheckInfo(),this.getQueryHealthPlanTaskList()},getPatientBaseInfo:function(){var e=this;Object(o["cb"])({userId:this.patientId}).then((function(a){0===a.code?e.patientInfo=a.data:e.$message.error(a.message)}))},subStringIdcardNo:function(e){if(e){var a=e.substring(4,15);return e.replace(a,"***********")}return""},subStringPhoneNo:function(e){var a=e,t=/(\d{3})\d*(\d{4})/;return a.replace(t,"$1****$2")},getQueryHealthPlanTaskList:function(){var e=this;Object(o["Ic"])({planId:this.planId}).then((function(a){if(0===a.code){for(var t=0;t<a.data.length;t++)for(var s=a.data[t],i=0;i<s.taskInfo.length;i++){var r=s.taskInfo[i];if("Quest"===r.planType){e.questionTaskContent=r;break}}e.questionTaskContent.contentId?e.getQueryHealthPlanContent():e.$message.error("随访问卷不存在")}else e.$message.error(a.message)}))},getQueryHealthPlanContent:function(){var e=this,a={contentId:this.questionTaskContent.contentId,planType:this.questionTaskContent.planType,userId:this.patientId};Object(o["Hc"])(a).then((function(a){if(0===a.code){e.questionTaskContent.questUrl=a.data.questUrl;var t=a.data.questUrl+"?userId="+e.patientId+"&groupId=&contentId="+e.questionTaskContent.contentId+"&execTime="+e.formatDate(new Date)+"&title="+a.data.questName;t=1===e.questionTaskContent.execFlag?t.replace("/s/","/r/"):t.replace("/r/","/s/"),e.questionUrl=t}else e.$message.error(a.message)}))},checkHealthPlanTaskEnd:function(){var e=this;Object(o["Ic"])({planId:this.planId}).then((function(a){if(0===a.code){for(var t=0;t<a.data.length;t++)for(var s=a.data[t],i=0;i<s.taskInfo.length;i++){var r=s.taskInfo[i];if(r.contentId===e.questionTaskContent.contentId){1===r.execFlag?e.dodealsave():e.$message.error("请先提交问卷");break}}e.questionTaskContent.contentId?e.getQueryHealthPlanContent():e.$message.error("随访问卷不存在")}else e.$message.error(a.message)}))},goConfirm:function(){if(""!==this.patientId)if(""!==this.planId)if(0!==this.handleName.length){if(0===this.radioTyPe)this.checkHealthPlanTaskEnd();else if(1===this.radioTyPe){if(0===this.handleResult.length)return void this.$message.info("请填写失访理由");this.dodealsave()}}else this.$message.info("请填写处理人姓名");else this.$message.error("计划ID为空");else this.$message.error("患者ID为空")},dodealsave:function(){var e=this,a={dealResult:this.handleResult,dealType:0===this.radioTyPe?1:2,dealUserName:this.handleName,ipNo:this.record.zyh,planId:this.planId,regNo:this.record.jzlsh,userId:this.patientId};Object(o["s"])(a).then((function(a){0===a.code?(e.$message.success("操作成功！"),e.visible=!1):e.$message.error(a.message)}))},getDealInfo:function(){var e=this;if(""!==this.patientId)if(""!==this.planId){var a={planId:this.planId,userId:this.patientId};Object(o["r"])(a).then((function(a){0===a.code?(e.radioTyPe="1"===a.data.dealType?0:1,e.handleName=a.data.dealUserName,e.handleResult=a.data.dealResult,e.handleTime=a.data.dealTime):e.$message.error(a.message)}))}else this.$message.error("计划ID为空");else this.$message.error("患者ID为空")},gocheck:function(){""!==this.patientId?""!==this.planId?0!==this.checkName.length?0!==this.checkResult.length?this.dochecksave():this.$message.info("请填写检查结果"):this.$message.info("请填写检查人姓名"):this.$message.error("计划ID为空"):this.$message.error("患者ID为空")},dochecksave:function(){var e=this,a={checkResult:this.checkResult,checkUserName:this.checkName,ipNo:this.record.zyh,planId:this.planId,regNo:this.record.jzlsh,userId:this.patientId};Object(o["n"])(a).then((function(a){0===a.code?(e.$message.success("操作成功！"),e.visible=!1):e.$message.error(a.message)}))},getCheckInfo:function(){var e=this;if(""!==this.patientId)if(""!==this.planId){var a={planId:this.planId,userId:this.patientId};Object(o["m"])(a).then((function(a){0===a.code?(e.checkName=a.data.checkUserName,e.checkResult=a.data.checkResult,e.checkTime=a.data.checkTime):e.$message.error(a.message)}))}else this.$message.error("计划ID为空");else this.$message.error("患者ID为空")},handleCancelDetail:function(){this.previewVisibleDetail=!1},handlePreviewDetail:function(e){var a=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.url||e.preview){t.next=4;break}return t.next=3,a.getBase64(e.originFileObj);case 3:e.preview=t.sent;case 4:a.previewImageDetail=e.url||e.preview,a.previewVisibleDetail=!0;case 6:case"end":return t.stop()}}),t)})))()},getBase64:function(e){return new Promise((function(a,t){var s=new FileReader;s.readAsDataURL(e),s.onload=function(){return a(s.result)},s.onerror=function(e){return t(e)}}))},handleChangeDetail:function(e){e.fileList},handleCancel:function(){this.form.resetFields(),this.visible=!1},radioChange:function(e){this.radioTyPe=e.target.value}}},d=c,u=(t("9fd6"),t("2877")),m=Object(u["a"])(d,s,i,!1,null,null,null);a["default"]=m.exports},3580:function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-modal",{attrs:{title:"新增职位",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[t("a-spin",{attrs:{spinning:e.confirmLoading}},[t("a-form",{attrs:{form:e.form}},[t("a-form-item",{attrs:{label:"职位名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"请输入职位名称！"}]}],expression:"['name', {rules: [{required: true, message: '请输入职位名称！'}]}]"}],attrs:{placeholder:"请输入职位名称"}})],1),t("a-form-item",{attrs:{label:"唯一编码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["code",{rules:[{required:!0,message:"请输入唯一编码！"}]}],expression:"['code', {rules: [{required: true,  message: '请输入唯一编码！'}]}]"}],attrs:{placeholder:"请输入唯一编码"}})],1),t("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"排序"}},[t("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["sort",{initialValue:100}],expression:"['sort', { initialValue: 100 }]"}],staticStyle:{width:"100%"},attrs:{placeholder:"请输入排序",min:1,max:1e3}})],1),t("a-form-item",{attrs:{label:"备注",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{rows:4,placeholder:"请输入备注"}})],1)],1)],1)],1)},i=[],r=(t("d3b7"),t("4cab")),n={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},methods:{add:function(e){this.visible=!0},handleSubmit:function(){var e=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,t){a?e.confirmLoading=!1:Object(r["qd"])(t).then((function(a){a.success?(e.$message.success("新增成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",t),e.form.resetFields()):e.$message.error("新增失败："+a.message)})).finally((function(a){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},l=n,o=t("2877"),c=Object(o["a"])(l,s,i,!1,null,null,null);a["default"]=c.exports},"389a":function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-modal",{attrs:{title:"",width:900,visible:e.visible,confirmLoading:e.confirmLoading,footer:null},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[t("a-spin",{attrs:{spinning:e.confirmLoading}},[t("div",{staticClass:"div-order-detail",attrs:{id:"printContent"}},[t("h2",[e._v("详情")]),t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 患者 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.userInfo.userName)+" ")]),t("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 诊疗卡号 :")]),t("span",{staticClass:"span-item-value",staticStyle:{"margin-left":"-5%"}},[e._v(e._s(e.userInfo.cardNo))])]),t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 身份证号码 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s(e.idcardNo)+" ")]),t("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 电话号码 :")]),t("span",{staticClass:"span-item-value",staticStyle:{"margin-left":"-5%"}},[e._v(e._s(e.userInfo?e.subStringPhoneNo(e.userInfo.phone):"")+" ")])]),t("div",{staticClass:"div-line-wrap"},[t("span",{staticClass:"span-item-name"},[e._v(" 紧急联系电话 :")]),t("span",{staticClass:"span-item-value"},[e._v(e._s("")+" ")])]),t("div",{staticClass:"div-divider"})])]),t("a-timeline",{staticStyle:{"margin-left":"5%","margin-top":"5%"},attrs:{mode:"left"}},e._l(e.detailDataList,(function(a,s){return t("a-timeline-item",{key:s},[t("div",[e._v(" "+e._s(a.type)+" "+e._s(a.time)+" "),"失访"==a.type?t("div",{staticStyle:{"margin-left":"2%","margin-top":"1%"}},[e._v("失访原因："+e._s(a.desc))]):e._e(),"完成计划"==a.type?t("div",{staticClass:"div-detail",on:{click:function(t){return e.goDetail(a.data)}}},[e._v("问卷详情")]):e._e()])])})),1)],1)},i=[],r=(t("ac1f"),t("5319"),t("d3b7"),t("4cab")),n={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,preNo:0,total:0,detailDataList:[],userInfo:"",idcardNo:""}},methods:{edit:function(e){this.detailDataList=[],this.total=0,this.visible=!0,this.preNo=e,this.qryRevisitDetail(e)},goDetail:function(e){e=e.replace("/s/","/r/")+"?userId="+this.userInfo.userId+"&showsubmitbtn=hide",window.open(e,"_blank")},qryRevisitDetail:function(e){var a=this;this.confirmLoading=!0,Object(r["Ac"])({id:e}).then((function(e){e.success?(a.detailDataList=e.data.revisitRecord,a.userInfo=e.data.userInfo,a.userInfo&&(a.idcardNo=a.subStringIdcardNo(e.data.userInfo.identificationNo))):a.$message.error("请求失败："+e.message)})).finally((function(e){a.confirmLoading=!1}))},subStringIdcardNo:function(e){if(e){var a=e.substring(4,15);return e.replace(a,"***********")}return""},subStringPhoneNo:function(e){if(e){var a=e,t=/(\d{3})\d*(\d{4})/;return a.replace(t,"$1****$2")}return""},handleSubmit:function(){},handleCancel:function(){this.visible=!1}}},l=n,o=(t("bdef"),t("2877")),c=Object(o["a"])(l,s,i,!1,null,null,null);a["default"]=c.exports},"5e99":function(e,a,t){},"5ee3":function(e,a,t){"use strict";t("7874")},"630f":function(e,a,t){},7874:function(e,a,t){},"9fd6":function(e,a,t){"use strict";t("630f")},bdef:function(e,a,t){"use strict";t("5e99")},c365:function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-modal",{attrs:{title:"新增职位",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[t("a-spin",{attrs:{spinning:e.confirmLoading}},[t("a-form",{attrs:{form:e.form}},[t("a-form-item",{attrs:{label:"职位名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["name",{rules:[{required:!0,message:"请输入职位名称！"}]}],expression:"['name', {rules: [{required: true, message: '请输入职位名称！'}]}]"}],attrs:{placeholder:"请输入职位名称"}})],1),t("a-form-item",{attrs:{label:"唯一编码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["code",{rules:[{required:!0,message:"请输入唯一编码！"}]}],expression:"['code', {rules: [{required: true,  message: '请输入唯一编码！'}]}]"}],attrs:{placeholder:"请输入唯一编码"}})],1),t("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"排序"}},[t("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["sort",{initialValue:100}],expression:"['sort', { initialValue: 100 }]"}],staticStyle:{width:"100%"},attrs:{placeholder:"请输入排序",min:1,max:1e3}})],1),t("a-form-item",{attrs:{label:"备注",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark"],expression:"['remark']"}],attrs:{rows:4,placeholder:"请输入备注"}})],1)],1)],1)],1)},i=[],r=(t("d3b7"),t("4cab")),n={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},methods:{add:function(e){this.visible=!0},handleSubmit:function(){var e=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,t){a?e.confirmLoading=!1:Object(r["qd"])(t).then((function(a){a.success?(e.$message.success("新增成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",t),e.form.resetFields()):e.$message.error("新增失败："+a.message)})).finally((function(a){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},l=n,o=t("2877"),c=Object(o["a"])(l,s,i,!1,null,null,null);a["default"]=c.exports},cc58:function(e,a,t){"use strict";t.r(a);var s=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("a-modal",{attrs:{title:"修改医生用户",width:900,visible:e.visible,confirmLoading:e.confirmLoading},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[t("a-spin",{attrs:{spinning:e.confirmLoading}},[t("a-form",{attrs:{form:e.form}},[t("a-form-item",{staticStyle:{display:"none"},attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["id"],expression:"['id']"}]})],1),t("a-form-item",{attrs:{label:"姓名",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["xm",{rules:[{required:!0,message:"请输入姓名！"}]}],expression:"['xm', { rules: [{ required: true, message: '请输入姓名！' }] }]"}],attrs:{disabled:"",placeholder:"请输入姓名"}})],1),t("a-form-item",{attrs:{label:"性别",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-radio-group",{directives:[{name:"decorator",rawName:"v-decorator",value:["xb",{rules:[{required:!0,message:"请选择性别！"}]}],expression:"['xb', { rules: [{ required: true, message: '请选择性别！' }] }]"}],attrs:{name:"radioGroup","default-value":1}},[t("a-radio",{attrs:{value:1}},[e._v(" 男 ")]),t("a-radio",{staticStyle:{width:"100px"},attrs:{value:2}},[e._v(" 女 ")])],1)],1),t("a-form-item",{attrs:{label:"所属机构科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["jg",{rules:[{required:!0,message:"请选择机构"}]}],expression:"['jg', { rules: [{ required: true, message: '请选择机构' }] }]"}],attrs:{"allow-clear":"",placeholder:"湘雅附二医院"}},e._l(e.hosData,(function(a,s){return t("a-select-option",{key:s,attrs:{value:a.code}},[e._v(e._s(a.value))])})),1)],1),t("a-form-item",{attrs:{label:"科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["ssks",{rules:[{required:!0,message:"请选择科室"}]}],expression:"['ssks', { rules: [{ required: true, message: '请选择科室' }] }]"}],attrs:{"allow-clear":"",placeholder:"请选择科室"},on:{select:e.onSelected}},e._l(e.keshiData,(function(a,s){return t("a-select-option",{key:s,attrs:{value:a.yyksdm}},[e._v(e._s(a.yyksmc))])})),1)],1),t("a-form-item",{attrs:{labelCol:e.labelCol,wrapperCol:e.wrapperCol,label:"职称","has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["zhic",{rules:[{required:!0,message:"请输入职称！"}]}],expression:"['zhic', { rules: [{ required: true, message: '请输入职称！' }] }]"}],attrs:{placeholder:"请输入职称"}})],1),t("a-form-item",{attrs:{label:"手机号码",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["tel",{rules:[{required:!0,message:"请输入手机号码！"}]}],expression:"['tel', { rules: [{ required: true, message: '请输入手机号码！' }] }]"}],attrs:{placeholder:"请输入手机号码"}})],1)],1)],1)],1)},i=[],r=(t("99af"),t("d3b7"),t("4cab")),n={data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},keshiData:[],hosData:[{code:"444885559",value:"湘雅附二医院"}],visible:!1,confirmLoading:!1,form:this.$form.createForm(this)}},created:function(){this.getKeShi()},methods:{edit:function(e){var a=this;this.visible=!0,setTimeout((function(){a.form.setFieldsValue({id:e.id,xm:e.xm,jg:"湘雅附二医院",ssks:e.ssks,zhic:e.zhic,tel:e.tel}),"男"!=e.xb&&e.xb?a.form.setFieldsValue({xb:2}):a.form.setFieldsValue({xb:1})}),100)},onSelected:function(e){for(var a=0;a<this.keshiData.length;a++)this.keshiData[a].yyksdm==e&&(this.seletSsksName=this.keshiData[a].yyksmc)},getKeShi:function(){var e=this;Object(r["rb"])({hospitalCode:"444885559"}).then((function(a){if(a.success){for(var t=[],s=0;s<a.data.length;s++)a.data[s].departmentList&&a.data[s].departmentList.length>0&&(t=t.concat(a.data[s].departmentList));e.keshiData=t}})).catch((function(e){}))},handleSubmit:function(){var e=this,a=this.form.validateFields;this.confirmLoading=!0,a((function(a,t){a?e.confirmLoading=!1:(1==t.xb?t.xb="男":t.xb="女",t.ssksName=e.seletSsksName,delete t.jg,Object(r["i"])(t).then((function(a){a.success?(e.$message.success("编辑成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",t),e.form.resetFields()):e.$message.error("编辑失败："+a.message)})).finally((function(a){e.confirmLoading=!1})))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},l=n,o=t("2877"),c=Object(o["a"])(l,s,i,!1,null,null,null);a["default"]=c.exports}}]);