(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2719c17a","chunk-62cde647"],{"11c0":function(e,t,a){"use strict";a("cd95")},"1da1":function(e,t,a){"use strict";a.d(t,"a",(function(){return r}));a("d3b7");function s(e,t,a,s,r,n,i){try{var o=e[n](i),l=o.value}catch(d){return void a(d)}o.done?t(l):Promise.resolve(l).then(s,r)}function r(e){return function(){var t=this,a=arguments;return new Promise((function(r,n){var i=e.apply(t,a);function o(e){s(i,r,n,o,l,"next",e)}function l(e){s(i,r,n,o,l,"throw",e)}o(void 0)}))}}},5943:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"预约详情",width:900,visible:e.visible,confirmLoading:e.confirmLoading,footer:null},on:{ok:e.handleSubmit,cancel:e.handleCancel}},[a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("div",{staticClass:"div-appoint-detail"},[a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v("姓名 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.userNameOut)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 性别 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.userSex)+" ")])]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 年龄 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.userAge)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 身份证号 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.identificationNo)+" ")])]),a("div",{staticClass:"div-divider"}),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 开单日期 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.reqTimeOut)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 开单科室 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.reqDeptName)+" ")])]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 开单医生 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.reqDocName)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 诊断名称 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.diagnosis)+" ")])]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 预交定金 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.prePay)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[e._v(" 预约科室 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.appointDeptName)+" ")])]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 预约日期 :")]),a("span",{staticClass:"span-item-value"},[e._v(e._s(e.record.appointDate||"暂无")+" ")])]),a("div",{staticClass:"div-divider"}),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[e._v(" 记录 :")]),a("span",{staticClass:"span-item-value"})]),a("div",{staticClass:"div-appoint-content"},[a("a-timeline",e._l(e.record.tradeAppointLog,(function(t,s){return a("a-timeline-item",{key:s,attrs:{color:"red"}},[a("div",{staticClass:"dotCircle",attrs:{slot:"dot"},slot:"dot"},[a("span",{staticClass:"span-dot"},[e._v(" "+e._s(s+1))])]),a("div",{staticClass:"div-content-item"},[a("div",{staticClass:"div-time"},[e._v(e._s(t.timeStr))]),a("div",{staticClass:"div-content"},[e._v(e._s(t.dealType))]),a("div",{staticClass:"clearfix",staticStyle:{"margin-top":"20px"}},[a("a-upload",{attrs:{disabled:"",action:e.actionUrl,headers:e.headers,multiple:!0,"list-type":"picture-card","file-list":e.record.tradeAppointLog[s].dealImgList},on:{change:e.handleChangeDetail,preview:e.handlePreviewDetail}},[e._e()]),a("a-modal",{attrs:{visible:e.previewVisibleDetail,footer:null},on:{cancel:e.handleCancelDetail}},[a("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:e.previewImageDetail}})])],1)])])})),1)],1)])])],1)},r=[],n=a("1da1"),i=a("ade3"),o=(a("16c9"),a("387a")),l=(a("96cf"),a("b0c0"),a("99af"),a("ac1f"),a("1276"),a("d3b7"),a("4cab")),d=a("9fb0"),c=a("2b0e"),u={components:Object(i["a"])({},o["a"].Item.name,o["a"].Item),data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this),record:{},actionUrl:"/api/content-api/fileUpload/uploadImgFile",previewImageDetail:"",previewVisibleDetail:!1,headers:{Authorization:""}}},created:function(){this.headers.Authorization=c["a"].ls.get(d["a"])},methods:{formatDate:function(e){e=new Date(e);var t=e.getFullYear(),a=e.getMonth()+1,s=e.getDate();return a<10&&(a="0"+a),s<10&&(s="0"+s),"".concat(t,"-").concat(a,"-").concat(s)},add:function(e){if(this.record={},this.record=e,this.visible=!0,this.record.tradeAppointLog&&this.record.tradeAppointLog.length>0)for(var t=0;t<this.record.tradeAppointLog.length;t++){var a=this.formatDate(this.record.tradeAppointLog[t].createTime);if(this.$set(this.record.tradeAppointLog[t],"timeStr",a),this.record.tradeAppointLog[t].dealImages&&this.record.tradeAppointLog[t].dealImages.length>0){var s=this.record.tradeAppointLog[t].dealImages.split(",");this.$set(this.record.tradeAppointLog[t],"dealImgList",[]);for(var r=0;r<s.length;r++)this.record.tradeAppointLog[t].dealImgList.push({uid:0-r+"",name:"详情"+r,status:"done",url:s[r]})}}},handleCancelDetail:function(){this.previewVisibleDetail=!1},handlePreviewDetail:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(e.url||e.preview){a.next=4;break}return a.next=3,t.getBase64(e.originFileObj);case 3:e.preview=a.sent;case 4:t.previewImageDetail=e.url||e.preview,t.previewVisibleDetail=!0;case 6:case"end":return a.stop()}}),a)})))()},getBase64:function(e){return new Promise((function(t,a){var s=new FileReader;s.readAsDataURL(e),s.onload=function(){return t(s.result)},s.onerror=function(e){return a(e)}}))},handleChangeDetail:function(e){e.fileList},handleSubmit:function(){var e=this,t=this.form.validateFields;this.confirmLoading=!0,t((function(t,a){t?e.confirmLoading=!1:Object(l["qd"])(a).then((function(t){t.success?(e.$message.success("新增成功"),e.visible=!1,e.confirmLoading=!1,e.$emit("ok",a),e.form.resetFields()):e.$message.error("新增失败："+t.message)})).finally((function(t){e.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},p=u,m=(a("7261"),a("2877")),f=Object(m["a"])(p,s,r,!1,null,null,null);t["default"]=f.exports},"6a84":function(e,t,a){},7261:function(e,t,a){"use strict";a("6a84")},c3b8:function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"div-service"},[a("a-card",{staticClass:"card-right",attrs:{bordered:!1}},[a("div",{staticClass:"table-page-search-wrapper"},[a("a-form",{attrs:{layout:"inline"}},[a("a-row",{attrs:{gutter:48}},[a("a-col",{attrs:{md:5,sm:24}},[a("a-form-item",{attrs:{label:"姓名"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入姓名"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$refs.table.refresh(!0)}},model:{value:e.queryParams.userName,callback:function(t){e.$set(e.queryParams,"userName",t)},expression:"queryParams.userName"}})],1)],1),a("a-col",{attrs:{md:6,sm:24}},[a("a-form-item",{attrs:{label:"工单号"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入工单号"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$refs.table.refresh(!0)}},model:{value:e.queryParams.tradeId,callback:function(t){e.$set(e.queryParams,"tradeId",t)},expression:"queryParams.tradeId"}})],1)],1),a("a-col",{attrs:{md:7,sm:24}},[a("a-form-item",{attrs:{label:"预约科室"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入预约科室"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$refs.table.refresh(!0)}},model:{value:e.queryParams.appointDept,callback:function(t){e.$set(e.queryParams,"appointDept",t)},expression:"queryParams.appointDept"}})],1)],1)],1),a("a-row",{attrs:{gutter:48}},[a("a-col",{attrs:{md:7,sm:24}},[a("a-form-item",{attrs:{label:"开单科室"}},[a("a-input",{attrs:{"allow-clear":"",placeholder:"请输入开单科室"},on:{keyup:function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.$refs.table.refresh(!0)}},model:{value:e.queryParams.reqDept,callback:function(t){e.$set(e.queryParams,"reqDept",t)},expression:"queryParams.reqDept"}})],1)],1),a("a-col",{attrs:{md:6,sm:24}},[a("a-form-item",{attrs:{label:"审核状态"}},[a("a-select",{attrs:{"allow-clear":"",placeholder:"请选择状态"},model:{value:e.queryParams.status,callback:function(t){e.$set(e.queryParams,"status",t)},expression:"queryParams.status"}},e._l(e.statusData,(function(t,s){return a("a-select-option",{key:s,attrs:{value:t.code}},[e._v(e._s(t.value))])})),1)],1)],1),a("a-col",{staticStyle:{float:"right"},attrs:{md:4,sm:24}},[a("span",{staticClass:"table-page-search-submitButtons",style:e.advanced&&{float:"right",overflow:"hidden"}||{}},[a("a-button",{attrs:{type:"primary"},on:{click:function(t){return e.$refs.table.refresh(!0)}}},[e._v("查询")]),e._e()],1)])],1)],1)],1),a("s-table",{ref:"table",attrs:{size:"default",columns:e.columns,data:e.loadData,alert:!0,rowKey:function(e){return e.code}},scopedSlots:e._u([{key:"action",fn:function(t,s){return a("span",{},[a("a",{on:{click:function(t){return e.$refs.addForm.add(s)}}},[e._v("查看详情")])])}},{key:"status",fn:function(t,s){return a("span",{class:e.getClass(s.status)},[e._v(" "+e._s(s.statusText)+" ")])}}])}),a("add-form",{ref:"addForm",on:{ok:e.handleOk}})],1)],1)},r=[],n=(a("99af"),a("4d63"),a("ac1f"),a("25f0"),a("d3b7"),a("3ca3"),a("ddb0"),a("2b3d"),a("9861"),a("5319"),a("2af9")),i=a("4cab"),o=a("5943"),l={components:{STable:n["s"],addForm:o["default"]},data:function(){var e=this;return{selectedRowKeys:[],advanced:!1,statusData:[{code:-1,value:"全部"},{code:0,value:"已申请"},{code:1,value:"审核通过"},{code:2,value:"审核失败"},{code:3,value:"审核失败"},{code:4,value:"预约失败"},{code:5,value:"取消预约申请"},{code:6,value:"取消预约成功"},{code:7,value:"取消预约失败"}],partChoose:"",queryParams:{userName:"",tradeId:"",appointDept:"",reqDept:"",status:-1,tradeTypeCode:"bed"},columns:[{title:"姓名",dataIndex:"userNameOut"},{title:"性别",dataIndex:"userSex"},{title:"年龄",dataIndex:"userAge"},{title:"身份证号",dataIndex:"identificationNo"},{title:"预约科室",dataIndex:"appointDeptName"},{title:"预约日期",dataIndex:"appointDate"},{title:"开单科室",dataIndex:"reqDeptName"},{title:"开单医生",dataIndex:"reqDocName"},{title:"诊断名称",dataIndex:"diagnosis"},{title:"开单日期",dataIndex:"reqTimeOut"},{title:"审核状态",dataIndex:"status",scopedSlots:{customRender:"status"}},{title:"入院时间",dataIndex:"accountSum"},{title:"操作",width:"150px",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(t){return-1==e.queryParams.status&&delete e.queryParams.status,Object(i["Z"])(Object.assign(t,e.queryParams)).then((function(t){for(var a=0;a<t.data.rows.length;a++){e.$set(t.data.rows[a],"userNameOut",t.data.rows[a].userInfo.userName),e.$set(t.data.rows[a],"userSex",t.data.rows[a].userInfo.userSex),e.$set(t.data.rows[a],"userAge",t.data.rows[a].userInfo.userAge),e.$set(t.data.rows[a],"identificationNo",t.data.rows[a].userInfo.identificationNo);var s=e.formatDate(t.data.rows[a].reqTime);e.$set(t.data.rows[a],"reqTimeOut",s),0==t.data.rows[a].status?e.$set(t.data.rows[a],"statusText","已申请"):1==t.data.rows[a].status?e.$set(t.data.rows[a],"statusText","审核通过"):2==t.data.rows[a].status?e.$set(t.data.rows[a],"statusText","审核失败"):3==t.data.rows[a].status?e.$set(t.data.rows[a],"statusText","预约成功"):4==t.data.rows[a].status?e.$set(t.data.rows[a],"statusText","预约失败"):5==t.data.rows[a].status?e.$set(t.data.rows[a],"statusText","取消预约申请"):6==t.data.rows[a].status?e.$set(t.data.rows[a],"statusText","取消预约成功"):7==t.data.rows[a].status&&e.$set(t.data.rows[a],"statusText","取消预约失败")}return t.data}))}}},created:function(){},methods:{formatDate:function(e){e=new Date(e);var t=e.getFullYear(),a=e.getMonth()+1,s=e.getDate();return a<10&&(a="0"+a),s<10&&(s="0"+s),"".concat(t,"-").concat(a,"-").concat(s)},getClass:function(e){return 0==e?"span-red":1==e?"span-blue":2==e?"span-red":3==e?"span-green":4==e||5==e||6==e||7==e?"span-gray":void 0},exportExcel:function(){var e=this,t={};t=this.isSearchKeyword?{keyWord:this.queryParam.keyWord,exportType:"1"}:{keyWord:this.queryParam,exportType:"2"},exportPatients(t).then((function(t){e.downloadfile(t)})).catch((function(t){e.$message.error("导出错误："+t.message)}))},downloadfile:function(e){var t=new Blob([e.data],{type:"application/octet-stream;charset=UTF-8"}),a=e.headers["content-disposition"],s=new RegExp("filename=([^;]+\\.[^\\.;]+);*"),r=s.exec(a),n=r[1],i=document.createElement("a"),o=window.URL.createObjectURL(t),l=/^["](.*)["]$/g;i.style.display="none",i.href=o,i.download=decodeURI(n.replace(l,"$1")),document.body.appendChild(i),i.click(),document.body.removeChild(i),window.URL.revokeObjectURL(o)},handleOk:function(){this.$refs.table.refresh()}}},d=l,c=(a("11c0"),a("2877")),u=Object(c["a"])(d,s,r,!1,null,null,null);t["default"]=u.exports},cd95:function(e,t,a){}}]);