(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0fb45bb2"],{"1da1":function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));a("d3b7");function i(e,t,a,i,s,n,c){try{var r=e[n](c),o=r.value}catch(l){return void a(l)}r.done?t(o):Promise.resolve(o).then(i,s)}function s(e){return function(){var t=this,a=arguments;return new Promise((function(s,n){var c=e.apply(t,a);function r(e){i(c,s,n,r,o,"next",e)}function o(e){i(c,s,n,r,o,"throw",e)}r(void 0)}))}}},"2e81":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-spin",{attrs:{spinning:e.confirmLoading}},[a("div",{staticClass:"div-check"},[a("div",{staticClass:"div-part"},[a("div",{staticClass:"div-line-wrap"},[a("div",{staticClass:"div-total-one"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 文章标题 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block"},attrs:{"allow-clear":"",placeholder:"请输入文章名称 "},model:{value:e.checkData.title,callback:function(t){e.$set(e.checkData,"title",t)},expression:"checkData.title"}})],1)]),a("div",{staticClass:"div-line-wrap"},[a("div",{staticClass:"div-total-one"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v("摘要说明 :")]),a("a-input",{staticClass:"span-item-value",staticStyle:{display:"inline-block"},attrs:{"allow-clear":"",placeholder:"请输入摘要说明 "},model:{value:e.checkData.brief,callback:function(t){e.$set(e.checkData,"brief",t)},expression:"checkData.brief"}})],1)]),a("div",{staticClass:"div-line-wrap"},[a("div",{staticClass:"div-left"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v("所属科室 :")]),a("div",{staticClass:"global-search-wrapper",staticStyle:{width:"300px",display:"inline-block"}},[a("a-auto-complete",{staticClass:"global-search",staticStyle:{width:"100%","font-size":"14px"},attrs:{size:"large",placeholder:"请输入并选择","option-label-prop":"title"},on:{select:e.onSelect,search:e.handleSearch},model:{value:e.checkData.categoryName,callback:function(t){e.$set(e.checkData,"categoryName",t)},expression:"checkData.categoryName"}},[a("template",{slot:"dataSource"},e._l(e.ksTypeDataTemp,(function(t){return a("a-select-option",{key:t.departmentId+"",attrs:{title:t.departmentName}},[e._v(" "+e._s(t.departmentName)+" ")])})),1)],2)],1)]),a("div",{staticClass:"div-right"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v("所属病种 :")]),a("a-select",{attrs:{"allow-clear":"",placeholder:"请选择病种"},model:{value:e.checkData.articleType,callback:function(t){e.$set(e.checkData,"articleType",t)},expression:"checkData.articleType"}},e._l(e.diseaseData,(function(t,i){return a("a-select-option",{key:i,attrs:{value:t.diseaseName}},[e._v(e._s(t.diseaseName))])})),1)],1)]),a("span",{staticClass:"title-article-pic"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v(" 图片 :（限定一张，文件大小64kb以下，建议尺寸比例4：3）")]),a("div",{staticClass:"clearfix",staticStyle:{"margin-top":"20px"}},[a("a-upload",{attrs:{action:e.actionUrlCover,multiple:!0,"list-type":"picture-card","file-list":e.fileList,headers:e.headers},on:{preview:e.handlePreview,change:e.handleChange}},[e.fileList.length<1?a("div",[a("a-icon",{attrs:{type:"plus"}}),a("div",{staticClass:"ant-upload-text"},[e._v("Upload")])],1):e._e()]),a("a-modal",{attrs:{visible:e.previewVisible,footer:null},on:{cancel:e.handleCancel}},[a("img",{staticStyle:{width:"100%"},attrs:{alt:"example",src:e.previewImage}})])],1),a("div",{staticClass:"div-line-wrap"},[a("div",{staticClass:"div-total-one"},[a("span",{staticClass:"span-item-name"},[a("span",{staticStyle:{color:"red"}},[e._v("*")]),e._v("文章内容 :")])])]),a("div",{staticStyle:{"margin-top":"3%"},attrs:{id:"div1"}})]),a("div",{staticStyle:{"margin-top":"30px"}},[a("a-button",{staticStyle:{"margin-left":"47%"},attrs:{size:"large",type:"primary"},on:{click:e.goConfirm}},[e._v(" 保存 ")])],1),a("div",{staticStyle:{height:"50px","backgroud-color":"white"}})])])},s=[],n=a("1da1"),c=(a("96cf"),a("4de4"),a("d3b7"),a("7db0"),a("159b"),a("2af9"),a("4cab")),r=a("9fb0"),o=a("2b0e"),l=a("ca00"),h=a("6fad"),d=a.n(h),p={components:{},data:function(){var e=this;return{editor:{},confirmLoading:!0,advanced:!1,checkData:{title:"",brief:"",categoryName:"",categoryId:"",articleType:"",content:""},ksTypeData:[],actionUrlCover:"/api/content-api/fileUpload/uploadImgFileForWX",fileList:[],previewVisible:!1,previewImage:"",keshiData:{},loadData:function(t){return getAllArticles(Object.assign(t,e.queryParam)).then((function(e){return e.data}))},diseaseData:[],selectedRowKeys:[],selectedRows:[],chooseDeptItem:{},ksTypeDataTemp:[],articleData:{},headers:{Authorization:""}}},watch:{$route:function(e,t){e.path.indexOf("editArticle")>-1&&this.init()}},created:function(){},methods:{init:function(){var e=this;this.confirmLoading=!0,this.headers.Authorization=o["a"].ls.get(r["a"]),Object(c["gb"])().then((function(t){0==t.code&&(e.ksTypeData=t.data,e.ksTypeDataTemp=JSON.parse(JSON.stringify(e.ksTypeData)))})),this.articleData=JSON.parse(this.$route.query.recordStr);var t=this.articleData.articleId;this.articleData.articleId?document.title="修改教育文章":document.title="新增教育文章",t&&Object(c["ab"])(t).then((function(t){0==t.code?(e.checkData=t.data,e.checkData.categoryId=parseInt(e.checkData.categoryId),e.editor.txt.html(t.data.content),e.getDiseasesOut(e.checkData.categoryId),e.fileList=[],e.fileList.push({uid:"-1",name:"封面",status:"done",url:e.checkData.previewUrl,media_id:e.checkData.extraData})):e.$message.error("获取失败："+t.message),e.confirmLoading=!1}))},handleChangeDept:function(e){this.getDiseasesOut(e)},handleSearch:function(e){this.ksTypeDataTemp=e?this.ksTypeData.filter((function(t){return-1!=t.departmentName.indexOf(e)})):JSON.parse(JSON.stringify(this.ksTypeData))},onSelect:function(e){this.checkData.categoryId=e,this.chooseDeptItem=this.ksTypeData.find((function(t){return t.departmentId==e})),this.getDiseasesOut(e)},handlePreview:function(e){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function a(){return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:if(e.url||e.preview){a.next=4;break}return a.next=3,t.getBase64(e.originFileObj);case 3:e.preview=a.sent;case 4:t.previewImage=e.url||e.preview,t.previewVisible=!0;case 6:case"end":return a.stop()}}),a)})))()},handleChange:function(e){"done"==e.file.status&&0!=e.file.response.code?(this.$message.error(e.file.response.message),e.fileList.pop(),this.fileList=e.fileList):this.fileList=e.fileList},getBase64:function(e){return new Promise((function(t,a){var i=new FileReader;i.readAsDataURL(e),i.onload=function(){return t(i.result)},i.onerror=function(e){return a(e)}}))},handleCancel:function(){this.previewVisible=!1},getDiseasesOut:function(e){var t=this;Object(c["kb"])({departmentId:e}).then((function(e){0==e.code?t.diseaseData=e.data:t.$message.error("获取专病列表失败："+e.message)}))},goConfirm:function(){var e=this;if(this.checkData.title)if(this.checkData.brief)if(this.checkData.categoryId)if(this.checkData.articleType)if(0!=this.fileList.length)if(delete this.checkData.previewUrl,this.$set(this.checkData,"extraData",""),this.fileList[0].response?(this.checkData.extraData=this.fileList[0].response.data.mediaId,this.checkData.previewUrl=this.fileList[0].response.data.url):(this.checkData.extraData=this.fileList[0].media_id,this.checkData.previewUrl=this.fileList[0].url),this.checkData.content){this.ksTypeData.forEach((function(t){e.checkData.categoryId==t.departmentId&&(e.checkData.categoryName=t.departmentName)}));var t=o["a"].ls.get(r["p"]);this.checkData.publisherName=t.userName,this.checkData.source="weixin",this.checkData.publisherUserId=t.userId;var a=[{thumbMediaId:this.checkData.extraData,author:this.checkData.publisherName,title:this.checkData.title,content:this.checkData.content,showCoverPic:0,needOpenComment:0,onlyFansCanComment:0}];Object(c["Vc"])(a).then((function(t){0==t.code?(e.$set(e.checkData,"templateId",t.data),Object(c["Uc"])(e.checkData).then((function(t){0==t.code?(e.$message.success("保存成功"),e.$router.go(-1)):e.$message.error(t.message)}))):e.$message.error(t.message)}))}else this.$message.error("请编辑内容");else this.$message.error("请上传套餐图片！");else this.$message.error("请选择专病");else this.$message.error("请选择科室");else this.$message.error("请填写描述");else this.$message.error("请填写标题")},goBack:function(){window.history.back()},handleStatus:function(e){var t=this;e.activeFlag=1==e.activeFlag||null==e.activeFlag?0:1,changeStatus(e).then((function(e){e.success?(t.$message.success("切换成功"),t.$refs.table.refresh()):t.$message.error("切换失败："+e.message)})).catch((function(e){t.$message.error("切换错误："+e.message)}))},goHistoryDetail:function(){window.open("http://www.mclouds.org.cn:30000/patient-view.html?token=eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIwMTk4IiwiZXhwIjoxNjQwODY2NjQxfQ.p8rozkAXsPzdBDeAkck3NjUI7iBYWM_4UA4A22rlbElPNYiZMthDnLQ0jhJIk8CpnRJEPfoi11Fybs2bajSb2hnGpVegVqTae_fxc30qL4sXPVPpvG_88ehhylBDtetVXpvJkkETQXq5ZWSfaItrBGZqr0r2NwPJIon6gy-NKditLhu8T7RPYj65qVsh7mX6gr-rhfnC9Ol4gRHjAyxiKm33M_sCn3ELMhDchjHrjE8WfllrT1mfaiP7kB4eDas9FB2D3zpAEb3EWHHdweQIsY8DTidslqjN-OkpjJsnXfahRoHEeiWiagkNzAhNM3-zcsQykvmrVzab2u_PhG-u3g&no=000006392145&type=9","_blank")},onChange:function(){},handleOk:function(){this.$refs.table.refresh()},onSelectChange:function(e,t){this.selectedRowKeys=e,this.selectedRows=t}},mounted:function(){var e=this,t=new d.a("#div1");this.editor=t,t.config.height=600,t.config.pasteFilterStyle=!1,t.config.onchange=function(t){e.checkData.content=t},t.config.menus=["head","bold","fontSize","fontName","italic","underline","strikeThrough","indent","lineHeight","foreColor","backColor","link","list","todo","justify","quote","image","video","table","code","splitLine","undo","redo"],t.config.uploadImgHeaders={Authorization:o["a"].ls.get(r["a"])},t.config.uploadFileName="file",t.config.uploadImgServer="/api/wx-api/health/wx/"+l["a"]+"/uploadInnerImg",t.config.uploadVideoName="file",t.config.uploadVideoServer="/api/content-api/fileUpload/uploadVideoFileForEdit",t.config.uploadVideoHeaders={Authorization:o["a"].ls.get(r["a"])},t.create(),this.init()}},u=p,f=(a("cb84"),a("2877")),m=Object(f["a"])(u,i,s,!1,null,null,null);t["default"]=m.exports},9705:function(e,t,a){},cb84:function(e,t,a){"use strict";a("9705")}}]);