(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-166704b4"],{"18d7":function(e,a,t){"use strict";t("cf5a")},"1da1":function(e,a,t){"use strict";t.d(a,"a",(function(){return s}));t("d3b7");function i(e,a,t,i,s,n,l){try{var r=e[n](l),o=r.value}catch(c){return void t(c)}r.done?a(o):Promise.resolve(o).then(i,s)}function s(e){return function(){var a=this,t=arguments;return new Promise((function(s,n){var l=e.apply(a,t);function r(e){i(l,s,n,r,o,"next",e)}function o(e){i(l,s,n,r,o,"throw",e)}r(void 0)}))}}},"4a0a":function(e,a,t){"use strict";t.r(a);var i=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"div-new-package"},[t("p",{staticClass:"p-title"},[e._v("查看类别")]),t("div",{staticClass:"div-divider"}),t("a-form",{ref:"form",staticClass:"my-form",attrs:{form:e.form}},[t("a-form-item",{attrs:{label:"套餐名称",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("span",{staticClass:"span-item-value"},[e._v(e._s(e.uploadData.className)+" ")])]),t("a-form-item",{attrs:{label:"所属科室",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("span",{staticClass:"span-item-value"},[e._v(e._s(e.uploadData.deptName)+" ")])]),t("a-form-item",{attrs:{label:"是否上架",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-switch",{attrs:{checked:e.uploadData.isOnline,disabled:""}})],1),t("a-form-item",{attrs:{label:"是否推荐",labelCol:e.labelCol,wrapperCol:e.wrapperCol,"has-feedback":""}},[t("a-switch",{attrs:{checked:e.uploadData.isSuggest,disabled:""}})],1)],1),t("div",{staticClass:"div-service-pic"},[e._m(0),t("div",{staticClass:"clearfix",staticStyle:{"margin-top":"20px"}},[t("a-upload",{attrs:{disabled:"",action:e.actionUrl,multiple:!0,"list-type":"picture-card","file-list":e.fileList},on:{preview:e.handlePreview,change:e.handleChange}},[e.fileList.length<1?t("div",[t("a-icon",{attrs:{type:"plus"}}),t("div",{staticClass:"ant-upload-text"},[e._v("Upload")])],1):e._e()]),t("a-modal",{attrs:{visible:e.previewVisible,footer:null},on:{cancel:e.handleCancel}},[t("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:e.previewImage}})])],1),e._m(1),t("div",{staticClass:"clearfix",staticStyle:{"margin-top":"20px"}},[t("a-upload",{attrs:{disabled:"",action:e.actionUrl,multiple:!0,"list-type":"picture-card","file-list":e.fileListBanner},on:{preview:e.handlePreviewBanner,change:e.handleChangeBanner}},[e._e()]),t("a-modal",{attrs:{visible:e.previewVisibleBanner,footer:null},on:{cancel:e.handleCancelBanner}},[t("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:e.previewImageBanner}})])],1),e._m(2),t("div",{staticClass:"clearfix",staticStyle:{"margin-top":"20px"}},[t("a-upload",{attrs:{disabled:"",action:e.actionUrl,multiple:!0,"list-type":"picture-card","file-list":e.fileListDetail},on:{preview:e.handlePreviewDetail,change:e.handleChangeDetail}},[e._e()]),t("a-modal",{attrs:{visible:e.previewVisibleDetail,footer:null},on:{cancel:e.handleCancelDetail}},[t("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:e.previewImageDetail}})])],1)]),e._e(),t("div",{staticStyle:{height:"25px",color:"white"}})],1)},s=[function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("span",{staticClass:"title-des-pic"},[t("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 套餐图片 :（只允许上传1张，正方形比例）")])},function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("span",{staticClass:"title-des-pic"},[t("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 详情banner图片 :（建议尺寸比例7：4）")])},function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("span",{staticClass:"title-des-pic"},[t("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 商品详情")])}],n=t("1da1"),l=(t("96cf"),t("ac1f"),t("1276"),t("d3b7"),t("a434"),t("4cab")),r={components:{},data:function(){return{labelCol:{xs:{span:24},sm:{span:5}},wrapperCol:{xs:{span:24},sm:{span:5}},wrapperColN:{xs:{span:24},sm:{span:12}},hosCode:"444885559",loading:!1,hosData:[],periodData:[{code:1,valueName:"半年",value:6},{code:2,valueName:"一年",value:12},{code:3,valueName:"永久",value:1200}],keshiData:[],planId:"",actionUrl:"/api/content-api/fileUpload/uploadImgFile",headers:{authorization:"authorization-text"},form:this.$form.createForm(this),goodsAttr:[],uploadData:{goodsInfo:{goodsName:"",belong:"",deptName:"",goodsType:"service_package",goodsSpec:"",imgList:[],previewList:[],bannerList:[],status:"",price:"",theLastTime:"120",goodsAttr:[]},templateTask:[],templateName:"",basetimeType:"0"},previewVisible:!1,previewVisibleBanner:!1,previewVisibleDetail:!1,previewImage:"",previewImageBanner:"",previewImageDetail:"",fileList:[],fileListBanner:[],fileListDetail:[]}},watch:{visible:function(){}},created:function(){this.uploadData=this.$route.params.record,this.uploadData.belong=parseInt(this.uploadData.belong),this.initData()},methods:{initData:function(){var e=this;this.$nextTick((function(){setTimeout((function(){e.form.setFieldsValue({className:e.uploadData.className,belong:e.uploadData.belong})}))})),1==this.uploadData.status?this.uploadData.isOnline=!0:this.uploadData.isOnline=!1,1==this.uploadData.topFlag?this.uploadData.isSuggest=!0:this.uploadData.isSuggest=!1,this.fileList.push({uid:"-1",name:"封面1",status:"done",url:this.uploadData.previewList});for(var a=this.uploadData.bannerList.split(","),t=0;t<a.length;t++)this.fileListBanner.push({uid:0-t+"",name:"Banner"+t,status:"done",url:a[t]});for(var i=this.uploadData.imgList.split(","),s=0;s<i.length;s++)this.fileListDetail.push({uid:0-s+"",name:"详情"+s,status:"done",url:i[s]})},countMonth:function(){return 6==this.planData.goodsInfo.theLastTime?"半年":12==this.planData.goodsInfo.theLastTime?"一年":"永久"},getBase64:function(e){return new Promise((function(a,t){var i=new FileReader;i.readAsDataURL(e),i.onload=function(){return a(i.result)},i.onerror=function(e){return t(e)}}))},handleCancel:function(){this.previewVisible=!1},handleCancelBanner:function(){this.previewVisibleBanner=!1},handleCancelDetail:function(){this.previewVisibleDetail=!1},handlePreview:function(e){var a=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.url||e.preview){t.next=4;break}return t.next=3,a.getBase64(e.originFileObj);case 3:e.preview=t.sent;case 4:a.previewImage=e.url||e.preview,a.previewVisible=!0;case 6:case"end":return t.stop()}}),t)})))()},handlePreviewBanner:function(e){var a=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.url||e.preview){t.next=4;break}return t.next=3,a.getBase64(e.originFileObj);case 3:e.preview=t.sent;case 4:a.previewImageBanner=e.url||e.preview,a.previewVisibleBanner=!0;case 6:case"end":return t.stop()}}),t)})))()},handlePreviewDetail:function(e){var a=this;return Object(n["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.url||e.preview){t.next=4;break}return t.next=3,a.getBase64(e.originFileObj);case 3:e.preview=t.sent;case 4:a.previewImageDetail=e.url||e.preview,a.previewVisibleDetail=!0;case 6:case"end":return t.stop()}}),t)})))()},handleChange:function(e){var a=e.fileList;this.fileList=a},handleChangeBanner:function(e){var a=e.fileList;this.fileListBanner=a},handleChangeDetail:function(e){var a=e.fileList;this.fileListDetail=a},deleteItem:function(e){this.goodsAttr.splice(e,1)},validate:function(){var e=this,a=this.form.validateFields;a((function(a,t){if(!a){if(e.uploadData.goodsInfo.goodsName=t.goodsName,e.uploadData.goodsInfo.belong=t.belong,e.uploadData.goodsInfo.goodsSpec=t.goodsSpec,e.uploadData.goodsInfo.price=t.price,e.uploadData.goodsInfo.theLastTime=t.theLastTime,e.uploadData.goodsInfo.status=t.statusIf?"1":"3",e.uploadData.goodsInfo.topFlag=t.topFlagIf?"1":"0",e.uploadData.goodsInfo.goodsAttr=e.goodsAttr,e.uploadData.templateName=t.goodsName,0==e.fileList.length)return void e.$message.error("请上传套餐图片！");for(var i=0;i<e.fileList.length;i++)e.uploadData.goodsInfo.previewList.push(e.fileList[i].response.data.fileLinkUrl);if(0==e.fileListBanner.length)return void e.$message.error("请上传详情banner图片！");for(var s=0;s<e.fileListBanner.length;s++)e.uploadData.goodsInfo.bannerList.push(e.fileListBanner[s].response.data.fileLinkUrl);if(0==e.fileListDetail.length)return void e.$message.error("请上传商品详情图片！");for(var n=0;n<e.fileListDetail.length;n++)e.uploadData.goodsInfo.imgList.push(e.fileListDetail[n].response.data.fileLinkUrl);Object(l["Qc"])(e.uploadData).then((function(a){0==a.code?(e.$message.success("保存成功"),e.$router.go(-1)):e.$message.error(a.message)}))}}))}}},o=r,c=(t("18d7"),t("2877")),p=Object(c["a"])(o,i,s,!1,null,null,null);a["default"]=p.exports},cf5a:function(e,a,t){}}]);