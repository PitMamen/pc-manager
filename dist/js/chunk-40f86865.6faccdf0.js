(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-40f86865"],{"27fc":function(t,e,a){},"555c":function(t,e,a){},7178:function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-card",{attrs:{bordered:!1}},[a("div",{staticClass:"table-page-search-wrapper"},[a("div",{staticClass:"search-row"},[a("span",{staticClass:"name"},[t._v("科室:")]),a("a-select",{staticStyle:{"min-width":"120px",height:"28px"},attrs:{maxTagCount:1,"collapse-tags":!0,"allow-clear":"",mode:"multiple",placeholder:"请选择科室"},model:{value:t.idArr,callback:function(e){t.idArr=e},expression:"idArr"}},t._l(t.originData,(function(e,r){return a("a-select-option",{key:r,attrs:{value:e.departmentId}},[t._v(t._s(e.departmentName))])})),1)],1),a("div",{staticClass:"action-row"},[a("span",{staticClass:"buttons",style:{float:"right",overflow:"hidden"}},[a("a-button",{attrs:{type:"primary",icon:"search"},on:{click:function(e){return t.$refs.table.refresh(!0)}}},[t._v("查询")]),a("a-button",{staticStyle:{"margin-left":"8px","margin-right":"0"},attrs:{icon:"undo"},on:{click:t.reset}},[t._v("重置")])],1)])]),a("div",{staticClass:"table-operator",staticStyle:{overflow:"hidden"}},[a("a-button",{staticStyle:{float:"right","margin-right":"0"},attrs:{icon:"plus"},on:{click:function(e){return t.goAdd()}}},[t._v("新增")])],1),a("s-table",{ref:"table",attrs:{scroll:{x:!0},size:"default",columns:t.columns,data:t.loadData,alert:!0,rowKey:function(t){return t.code}},scopedSlots:t._u([{key:"action",fn:function(e,r){return a("span",{},[a("a",{directives:[{name:"show",rawName:"v-show",value:"2"!=r.status,expression:"record.status != '2'"}],on:{click:function(e){return t.goPush(r)}}},[t._v("发布")]),a("a-divider",{directives:[{name:"show",rawName:"v-show",value:"2"!=r.status,expression:"record.status != '2'"}],attrs:{type:"vertical"}}),a("a",{on:{click:function(e){return t.goCheck(r)}}},[t._v("查看")]),a("a-divider",{attrs:{type:"vertical"}}),a("a",{on:{click:function(e){return t.goChange(r)}}},[t._v("修改")]),a("a-divider",{attrs:{type:"vertical"}}),a("a-popconfirm",{attrs:{title:"确定删除文章吗？","ok-text":"确定","cancel-text":"取消"},on:{confirm:function(e){return t.goDelete(r)}}},[a("a",[t._v("删除")])])],1)}}])})],1)},i=[],n=(a("d3b7"),a("159b"),a("2af9")),s=a("9fb0"),o=a("2b0e"),c=a("4cab"),d={components:{STable:n["s"]},data:function(){var t=this;return{advanced:!1,originData:[],idArr:[],labelCol:{xs:{span:24},sm:{span:6}},wrapperCol:{xs:{span:24},sm:{span:11}},queryParam:{source:"weixin",deptCode:""},queryParamOrigin:{source:"weixin",deptCode:""},columns:[{title:"序号",dataIndex:"xh"},{title:"文章名称",dataIndex:"title"},{title:"科室",dataIndex:"categoryName"},{title:"专病",dataIndex:"articleType"},{title:"摘要说明",dataIndex:"brief"},{title:"状态",dataIndex:"statusName"},{title:"阅读次数",dataIndex:"clickNum"},{title:"发布时间",dataIndex:"updateTime"},{title:"创建时间",dataIndex:"createTime"},{title:"操作",width:180,fixed:"right",dataIndex:"action",scopedSlots:{customRender:"action"}}],loadData:function(e){var a=JSON.parse(JSON.stringify(t.queryParam));return t.idArr.length>0&&t.idArr.forEach((function(e,r){r!=t.idArr.length-1?a.deptCode=a.deptCode+e+",":a.deptCode=a.deptCode+e})),t.isNoDepart&&(a.deptCode="-1"),7!=t.user.roleId&&"admin"!=t.user.roleName&&0==t.idArr.length&&t.originData.forEach((function(e,r){r!=t.idArr.length-1?a.deptCode=a.deptCode+e.departmentId+",":a.deptCode=a.deptCode+e.departmentId})),Object(c["V"])(Object.assign(e,a)).then((function(a){var r={pageNo:e.pageNo,pageSize:e.pageSize,totalRows:a.data.total,totalPage:a.data.total/e.pageSize,rows:a.data.list};return r.rows.forEach((function(e,a){e.xh=(r.pageNo-1)*r.pageSize+(a+1),e.clickNum||(e.clickNum=0),"2"==e.status?t.$set(e,"statusName","已发布"):t.$set(e,"statusName","暂存")})),r}))},selectedRowKeys:[],selectedRows:[]}},watch:{$route:function(t,e){t.path.path==this.$router.path&&("/teach/editArticle"!=e.path&&"/teach/addArticle"!=e.path||this.handleOk())}},created:function(){var t=this;this.user=o["a"].ls.get(s["p"]),7==this.user.roleId||"admin"==this.user.roleName?Object(c["gb"])().then((function(e){0==e.code&&(t.originData=e.data,t.$refs.table.refresh())})):Object(c["hb"])().then((function(e){0==e.code&&(t.originData=e.data,t.originData.length>0?t.originData.forEach((function(e,a){t.idArr.push(e.departmentId)})):(t.isNoDepart=!0,t.idArr=[]),t.$refs.table.refresh())}))},methods:{reset:function(){this.queryParam=JSON.parse(JSON.stringify(this.queryParamOrigin)),this.idArr=[],this.$refs.table.refresh()},goAdd:function(){this.$router.push({name:"article_teach_add",params:null})},goCheck:function(t){this.$router.push({name:"article_teach_check",query:{recordStr:JSON.stringify(t)}})},goChange:function(t){this.$router.push({name:"article_teach_edit",query:{recordStr:JSON.stringify(t)}})},goPush:function(t){var e=this;Object(c["nc"])({articleId:t.articleId}).then((function(t){0==t.code?(e.$message.success("发布成功"),e.handleOk()):e.$message.error("发布失败："+t.message)}))},goDelete:function(t){var e=this;Object(c["t"])(t.articleId).then((function(t){0==t.code?(e.$message.success("删除成功"),e.handleOk()):e.$message.error("删除失败："+t.message)}))},handleOk:function(){this.$refs.table.refresh()},onSelectChange:function(t,e){this.selectedRowKeys=t,this.selectedRows=e}}},l=d,u=(a("b773"),a("8683"),a("2877")),h=Object(u["a"])(l,r,i,!1,null,"0c6fa153",null);e["default"]=h.exports},8683:function(t,e,a){"use strict";a("555c")},b773:function(t,e,a){"use strict";a("27fc")}}]);