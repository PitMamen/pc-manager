(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9f76963c"],{"24cb":function(t,e,o){"use strict";o.d(e,"a",(function(){return a})),o.d(e,"b",(function(){return l})),o.d(e,"c",(function(){return s})),o.d(e,"d",(function(){return r})),o.d(e,"e",(function(){return u})),o.d(e,"f",(function(){return c}));var n=o("b775");function a(t){return Object(n["b"])({url:"/follow-api/follow/stat/getFollowNum",method:"get",params:t})}function l(t){return Object(n["b"])({url:"/follow-api/follow/stat/getTaskNum",method:"get",params:t})}function s(t){return Object(n["b"])({url:"/follow-api/follow/stat/getTopQuest",method:"get",params:t})}function r(t){return Object(n["b"])({url:"/follow-api/follow/stat/getTopFollow",method:"get",params:t})}function u(t){return Object(n["b"])({url:"/follow-api/follow/stat/getTopArticle",method:"get",params:t})}function c(t){return Object(n["b"])({url:"/follow-api/follow/stat/getCheckAndOtherNum",method:"get",params:t})}},e8c8:function(t,e,o){"use strict";o.r(e);var n=function(){var t=this,e=t.$createElement,o=t._self._c||e;return t.show?o("s-table",{ref:"table",attrs:{size:"default",columns:t.columns,data:t.loadData,alert:!0,showPagination:!1,rowKey:function(t){return t.id}},scopedSlots:t._u([{key:"metaName",fn:function(e){return o("span",{},[o("ellipsis",{attrs:{length:16,tooltip:""}},[t._v(t._s(e))])],1)}}],null,!1,3072836250)}):t._e()},a=[],l=o("24cb"),s=o("2af9"),r={components:{STable:s["s"],Ellipsis:s["i"]},data:function(){var t=this;return{show:!1,advanced:!1,queryParam:{},columns:[{title:"名单",dataIndex:"metaName",scopedSlots:{customRender:"metaName"}},{title:"新增人数",dataIndex:"totalNum",scopedSlots:{customRender:"totalNum"}},{title:"随访人数",dataIndex:"followedNum",scopedSlots:{customRender:"followedNum"}},{title:"随访率",dataIndex:"followedRate",scopedSlots:{customRender:"followedRate"}}],loadData:function(e){return Object(l["d"])(Object.assign({},t.queryParam)).then((function(e){if(0===e.code)return{rows:e.data||[],total:(e.data||[]).length};t.$message.error(e.message)}))},selectedRowKeys:[],selectedRows:[]}},created:function(){},methods:{search:function(t){var e=this;this.show=!0,this.queryParam=t,setTimeout((function(){e.handleOk()}))},toggleAdvanced:function(){this.advanced=!this.advanced},handleOk:function(){this.$refs.table.refresh(!0)},onSelectChange:function(t,e){this.selectedRowKeys=t,this.selectedRows=e}}},u=r,c=o("2877"),d=Object(c["a"])(u,n,a,!1,null,"4005e334",null);e["default"]=d.exports}}]);