(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-62cde647"],{"1da1":function(t,e,a){"use strict";a.d(e,"a",(function(){return s}));a("d3b7");function i(t,e,a,i,s,n,r){try{var l=t[n](r),o=l.value}catch(c){return void a(c)}l.done?e(o):Promise.resolve(o).then(i,s)}function s(t){return function(){var e=this,a=arguments;return new Promise((function(s,n){var r=t.apply(e,a);function l(t){i(r,s,n,l,o,"next",t)}function o(t){i(r,s,n,l,o,"throw",t)}l(void 0)}))}}},5943:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:"预约详情",width:900,visible:t.visible,confirmLoading:t.confirmLoading,footer:null},on:{ok:t.handleSubmit,cancel:t.handleCancel}},[a("a-spin",{attrs:{spinning:t.confirmLoading}},[a("div",{staticClass:"div-appoint-detail"},[a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[t._v("姓名 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.userNameOut)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 性别 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.userSex)+" ")])]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[t._v(" 年龄 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.userAge)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 身份证号 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.identificationNo)+" ")])]),a("div",{staticClass:"div-divider"}),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[t._v(" 开单日期 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.reqTimeOut)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 开单科室 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.reqDeptName)+" ")])]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[t._v(" 开单医生 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.reqDocName)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 诊断名称 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.diagnosis)+" ")])]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[t._v(" 预交定金 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.prePay)+" ")]),a("span",{staticClass:"span-item-name",staticStyle:{"margin-left":"3%"}},[t._v(" 预约科室 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.appointDeptName)+" ")])]),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[t._v(" 预约日期 :")]),a("span",{staticClass:"span-item-value"},[t._v(t._s(t.record.appointDate||"暂无")+" ")])]),a("div",{staticClass:"div-divider"}),a("div",{staticClass:"div-line-wrap"},[a("span",{staticClass:"span-item-name"},[t._v(" 记录 :")]),a("span",{staticClass:"span-item-value"})]),a("div",{staticClass:"div-appoint-content"},[a("a-timeline",t._l(t.record.tradeAppointLog,(function(e,i){return a("a-timeline-item",{key:i,attrs:{color:"red"}},[a("div",{staticClass:"dotCircle",attrs:{slot:"dot"},slot:"dot"},[a("span",{staticClass:"span-dot"},[t._v(" "+t._s(i+1))])]),a("div",{staticClass:"div-content-item"},[a("div",{staticClass:"div-time"},[t._v(t._s(e.timeStr))]),a("div",{staticClass:"div-content"},[t._v(t._s(e.dealType))]),a("div",{staticClass:"clearfix",staticStyle:{"margin-top":"20px"}},[a("a-upload",{attrs:{disabled:"",action:t.actionUrl,headers:t.headers,multiple:!0,"list-type":"picture-card","file-list":t.record.tradeAppointLog[i].dealImgList},on:{change:t.handleChangeDetail,preview:t.handlePreviewDetail}},[t._e()]),a("a-modal",{attrs:{visible:t.previewVisibleDetail,footer:null},on:{cancel:t.handleCancelDetail}},[a("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:t.previewImageDetail}})])],1)])])})),1)],1)])])],1)},s=[],n=a("1da1"),r=a("ade3"),l=(a("16c9"),a("387a")),o=(a("96cf"),a("b0c0"),a("99af"),a("ac1f"),a("1276"),a("d3b7"),a("4cab")),c=a("9fb0"),d=a("2b0e"),p={components:Object(r["a"])({},l["a"].Item.name,l["a"].Item),data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:15}},visible:!1,confirmLoading:!1,form:this.$form.createForm(this),record:{},actionUrl:"/api/content-api/fileUpload/uploadImgFile",previewImageDetail:"",previewVisibleDetail:!1,headers:{Authorization:""}}},created:function(){this.headers.Authorization=d["a"].ls.get(c["a"])},methods:{formatDate:function(t){t=new Date(t);var e=t.getFullYear(),a=t.getMonth()+1,i=t.getDate();return a<10&&(a="0"+a),i<10&&(i="0"+i),"".concat(e,"-").concat(a,"-").concat(i)},add:function(t){if(this.record={},this.record=t,this.visible=!0,this.record.tradeAppointLog&&this.record.tradeAppointLog.length>0)for(var e=0;e<this.record.tradeAppointLog.length;e++){var a=this.formatDate(this.record.tradeAppointLog[e].createTime);if(this.$set(this.record.tradeAppointLog[e],"timeStr",a),this.record.tradeAppointLog[e].dealImages&&this.record.tradeAppointLog[e].dealImages.length>0){var i=this.record.tradeAppointLog[e].dealImages.split(",");this.$set(this.record.tradeAppointLog[e],"dealImgList",[]);for(var s=0;s<i.length;s++)this.record.tradeAppointLog[e].dealImgList.push({uid:0-s+"",name:"详情"+s,status:"done",url:i[s]})}}},handleCancelDetail:function(){this.previewVisibleDetail=!1},handlePreviewDetail:function(t){var e=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(t.url||t.preview){a.next=4;break}return a.next=3,e.getBase64(t.originFileObj);case 3:t.preview=a.sent;case 4:e.previewImageDetail=t.url||t.preview,e.previewVisibleDetail=!0;case 6:case"end":return a.stop()}}),a)})))()},getBase64:function(t){return new Promise((function(e,a){var i=new FileReader;i.readAsDataURL(t),i.onload=function(){return e(i.result)},i.onerror=function(t){return a(t)}}))},handleChangeDetail:function(t){t.fileList},handleSubmit:function(){var t=this,e=this.form.validateFields;this.confirmLoading=!0,e((function(e,a){e?t.confirmLoading=!1:Object(o["dd"])(a).then((function(e){e.success?(t.$message.success("新增成功"),t.visible=!1,t.confirmLoading=!1,t.$emit("ok",a),t.form.resetFields()):t.$message.error("新增失败："+e.message)})).finally((function(e){t.confirmLoading=!1}))}))},handleCancel:function(){this.form.resetFields(),this.visible=!1}}},v=p,m=(a("7261"),a("2877")),u=Object(m["a"])(v,i,s,!1,null,null,null);e["default"]=u.exports},"6a84":function(t,e,a){},7261:function(t,e,a){"use strict";a("6a84")}}]);