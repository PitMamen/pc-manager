import Mock from 'mockjs2'
import { builder, getBody } from '../util'

const username = ['admin', 'super']
// 强硬要求 ant.design 相同密码
// '21232f297a57a5a743894a0e4a801fc3',
const password = ['8914de686ab28dc22f30d3d8e107ff6c'] // admin, ant.design

const login = (options) => {
  const body = getBody(options)
  console.log('mock: body', body)
  if (!username.includes(body.username) || !password.includes(body.password)) {
    return builder({ isLogin: true }, '账户或密码错误', 401)
  }

  return builder({
    'id': Mock.mock('@guid'),
    'name': Mock.mock('@name'),
    'username': 'admin',
    'password': '',
    'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
    'status': 1,
    'telephone': '',
    'lastLoginIp': '27.154.74.117',
    'lastLoginTime': 1534837621348,
    'creatorId': 'admin',
    'createTime': 1497160610259,
    'deleted': 0,
    'roleId': 'admin',
    'lang': 'zh-CN',
    'token': '4291d7da9005377ec9aec4a71ea837f'
  }, '', 200, { 'Custom-Header': Mock.mock('@guid') })
}

const logout = () => {
  return builder({}, '[测试接口] 注销成功')
}

const smsCaptcha = () => {
  return builder({ captcha: Mock.mock('@integer(10000, 99999)') })
}

const twofactor = () => {
  return builder({ stepCode: Mock.mock('@integer(0, 1)') })
}


const login2 = (options) => {
  const body = getBody(options)
  console.log('mock: body login2', body)
  return builder('eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEyNjU0NzY4OTA2NzI2NzI4MDgsImFjY291bnQiOiJzdXBlckFkbWluIiwidXVpZCI6ImRiMjlmOGMyLWY5NjEtNGVhOC1iNDI2LWNjYTliYjMxNjBiZiIsInN1YiI6IjEyNjU0NzY4OTA2NzI2NzI4MDgiLCJpYXQiOjE2MzUyOTc3MjcsImV4cCI6MTYzNTM4NDEyN30.0zIGI3JV8dIbvTdvdtnOgjYbT5SG-fnTzHT_oggNxkihLnxGgm7qlrMD9uUoIxfhX8i6MCPnELCdcqS3nhXMIg', '', 200, { 'Custom-Header': Mock.mock('@guid') })

}

const getLoginUser = (options) => {
  const loginUser = {
    "id": "1265476890672672808",
    "account": "superAdmin",
    "nickName": "超级管理员",
    "name": "超级管理员",
    "avatar": null,
    "birthday": "2020-03-18 00:00:00.000",
    "sex": 1,
    "email": "superAdmin@qq.com",
    "phone": "15228937093",
    "tel": "12345678",
    "adminType": 1,
    "lastLoginIp": "127.0.0.1",
    "lastLoginTime": "2021-10-27 09:37:00",
    "lastLoginAddress": "-",
    "lastLoginBrowser": "Chrome",
    "lastLoginOs": "Windows 10 or Windows Server 2016",
    "loginEmpInfo": {
      "jobNum": null,
      "orgId": null,
      "orgName": null,
      "extOrgPos": [],
      "positions": []
    },
    "apps": [
      {
        "code": "system",
        "name": "排班管理",
        "active": true
      }
      ,
      {
        "code": "business",
        "name": "内容管理",
        "active": false
      }
      , {
        "code": "chenckin",
        "name": "入院管理",
        "active": false
      }
    ],
    "roles": [],
    "permissions": [],
    "menus": [
      // {
      //     "id": "1264622039642255361",
      //     "pid": "0",
      //     "name": "system_index",
      //     "component": "RouteView",
      //     "redirect": "/analysis",
      //     "meta": {
      //         "title": "主控面板",
      //         "icon": "home",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/",
      //     "hidden": false
      // },
      // {
      //     "id": "1264622671778394114",
      //     "pid": "1264622039642255361",
      //     "name": "system_index_dashboard",
      //     "component": "system/dashboard/Analysis",
      //     "redirect": "",
      //     "meta": {
      //         "title": "分析页",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "analysis",
      //     "hidden": false
      // },
      // {
      //     "id": "1264620409496645634",
      //     "pid": "1264619904766685186",
      //     "name": "system_tools_config",
      //     "component": "system/config/index",
      //     "redirect": "",
      //     "meta": {
      //         "title": "系统配置",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/config",
      //     "hidden": false
      // },

      //TODO 暂时隐藏的功能
      // {
      //   "id": "1265474261896806402",
      //   "pid": "0",
      //   "name": "sys_mgr",
      //   "component": "PageView",
      //   "redirect": "",
      //   "meta": {
      //     "title": "排班管理",
      //     "icon": "team",
      //     "show": true,
      //     "target": null,
      //     "link": null
      //   },
      //   "path": "/sys",
      //   "hidden": false
      // },
      {
        "id": "1283308304890847233",
        "pid": "0",
        "name": "auth_manager",
        "component": "PageView",
        "redirect": "",
        "meta": {
          "title": "内容管理",
          "icon": "safety-certificate",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/content",
        "hidden": false
      },
      {
        "id": "1283308304890847234",
        "pid": "0",
        "name": "check_in_manager",
        "component": "PageView",
        "redirect": "",
        "meta": {
          "title": "入院管理",
          // "icon": "safety-certificate",
          "icon": "team",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/auth",
        "hidden": false
      },
      {
        "id": "12654742618968064055",
        "pid": "1283308304890847234",
        "name": "sys_check_in",
        "component": "system/checkin/index",
        "redirect": "",
        "meta": {
          "title": "入院申请",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/checkin",
        "hidden": false
      },
      {
        "id": "12654742618968064056",
        "pid": "1283308304890847234",
        "name": "sys_checked_list",
        "component": "system/checked/index",
        "redirect": "",
        "meta": {
          "title": "我处理的申请",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/checked",
        "hidden": false
      },
      {
        "id": "12654742618968064057",
        "pid": "1283308304890847234",
        "name": "sys_check",
        "component": "system/checkin/check",
        "redirect": "",
        "meta": {
          "title": "处理申请",
          "icon": "",
          "show": false,
          "target": null,
          "link": null
        },
        "path": "/checkin",
        "hidden": false
      },
      // {
      //   "id": "1265474261896806408",
      //   "pid": "1283308304890847233",
      //   "name": "sys_app_mgr",
      //   "component": "system/app/index",
      //   "redirect": "",
      //   "meta": {
      //     "title": "应用管理",
      //     "icon": "",
      //     "show": true,
      //     "target": null,
      //     "link": null
      //   },
      //   "path": "/app",
      //   "hidden": false
      // },
      {
        "id": "12654742618968064082",
        "pid": "1283308304890847233",
        "name": "sys_app_mgr",
        "component": "system/questionary/index",
        "redirect": "",
        "meta": {
          "title": "问卷管理",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/questionary",
        "hidden": false
      },
      {
        "id": "1265474261896806401235",
        "pid": "1283308304890847233",
        "name": "banner",
        "component": "system/banner/index",
        "redirect": "",
        "meta": {
          "title": "banner管理",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/banner",
        "hidden": false
      },

      {
        "id": "1283308304890847235",
        "pid": "0",
        "name": "service_config",
        "component": "PageView",
        "redirect": "",
        "meta": {
          "title": "服务配置",
          // "icon": "safety-certificate",
          "icon": "team",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/config",
        "hidden": false
      },

      {
        "id": "12654742618968064101",
        "pid": "1283308304890847235",
        "name": "config_plan",
        "component": "system/serviceconfig/index",
        "redirect": "",
        "meta": {
          "title": "计划配置",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/serviceconfig",
        "hidden": false
      },

      {
        "id": "12654742618968064102",
        "pid": "1283308304890847235",
        "name": "config_question",
        "component": "system/question/index",
        "redirect": "",
        "meta": {
          "title": "问卷配置",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/question",
        "hidden": false
      },

      {
        "id": "1283308304890847236",
        "pid": "0",
        "name": "service_manage",
        "component": "PageView",
        "redirect": "",
        "meta": {
          "title": "服务管理",
          // "icon": "safety-certificate",
          "icon": "team",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/service",
        "hidden": false
      },
      {
        "id": "12654742618968064103",
        "pid": "1283308304890847236",
        "name": "sys_service_manage",
        "component": "system/service/index",
        "redirect": "",
        "meta": {
          "title": "新出院患者",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/service",
        "hidden": false
      },
      // {
      //     "id": "1264619904766685186",
      //     "pid": "0",
      //     "name": "system_tools",
      //     "component": "PageView",
      //     "redirect": "",
      //     "meta": {
      //         "title": "开发管理",
      //         "icon": "euro",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/tools",
      //     "hidden": false
      // },
      // {
      //     "id": "1265474261896806439",
      //     "pid": "0",
      //     "name": "sys_log_mgr",
      //     "component": "PageView",
      //     "redirect": "",
      //     "meta": {
      //         "title": "日志管理",
      //         "icon": "read",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/log",
      //     "hidden": false
      // },
      // {
      //     "id": "1268815024873418753",
      //     "pid": "0",
      //     "name": "sys_monitor_mgr",
      //     "component": "PageView",
      //     "redirect": "",
      //     "meta": {
      //         "title": "系统监控",
      //         "icon": "deployment-unit",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/monitor",
      //     "hidden": false
      // },
      // {
      //     "id": "1277507562966740993",
      //     "pid": "0",
      //     "name": "sys_notice",
      //     "component": "PageView",
      //     "redirect": "",
      //     "meta": {
      //         "title": "通知公告",
      //         "icon": "sound",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/notice",
      //     "hidden": false
      // },
      // {
      //     "id": "1275723127652982786",
      //     "pid": "0",
      //     "name": "sys_file_mgr",
      //     "component": "PageView",
      //     "redirect": "",
      //     "meta": {
      //         "title": "文件管理",
      //         "icon": "file",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/file",
      //     "hidden": false
      // },
      // {
      //     "id": "1278256363012624386",
      //     "pid": "0",
      //     "name": "sys_timers",
      //     "component": "PageView",
      //     "redirect": "",
      //     "meta": {
      //         "title": "定时任务",
      //         "icon": "dashboard",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/timers",
      //     "hidden": false
      // },
      // {
      //     "id": "1278534949191852033",
      //     "pid": "1264619904766685186",
      //     "name": "sys_email_mgr",
      //     "component": "system/email/index",
      //     "redirect": "",
      //     "meta": {
      //         "title": "邮件发送",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/email",
      //     "hidden": false
      // },
      // {
      //     "id": "1275723575222968321",
      //     "pid": "1275723127652982786",
      //     "name": "sys_file_mgr_sys_file",
      //     "component": "system/file/index",
      //     "redirect": "",
      //     "meta": {
      //         "title": "系统文件",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/file",
      //     "hidden": false
      // },
      // {
      //     "id": "1264623145550196737",
      //     "pid": "1264622039642255361",
      //     "name": "system_index_workplace",
      //     "component": "system/dashboard/Workplace",
      //     "redirect": "",
      //     "meta": {
      //         "title": "工作台",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "workplace",
      //     "hidden": false
      // },
      // {
      //     "id": "1277508198718369793",
      //     "pid": "1277507562966740993",
      //     "name": "sys_notice_mgr",
      //     "component": "system/notice/index",
      //     "redirect": "",
      //     "meta": {
      //         "title": "公告管理",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/notice",
      //     "hidden": false
      // },
      // {
      //     "id": "1278543148905136130",
      //     "pid": "1264619904766685186",
      //     "name": "sys_swagger_mgr",
      //     "component": "Iframe",
      //     "redirect": "",
      //     "meta": {
      //         "title": "接口文档",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": "http://localhost:82/doc.html"
      //     },
      //     "path": "/swagger",
      //     "hidden": false
      // },
      // {
      //     "id": "1278256750994132994",
      //     "pid": "1278256363012624386",
      //     "name": "sys_timers_mgr",
      //     "component": "system/timers/index",
      //     "redirect": "",
      //     "meta": {
      //         "title": "任务管理",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/timers",
      //     "hidden": false
      // },
      // {
      //     "id": "1268815479720521730",
      //     "pid": "1268815024873418753",
      //     "name": "sys_monitor_mgr_machine_monitor",
      //     "component": "system/machine/index",
      //     "redirect": "",
      //     "meta": {
      //         "title": "服务监控",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/machine",
      //     "hidden": false
      // },
      // {
      //     "id": "1268815296198750210",
      //     "pid": "1268815024873418753",
      //     "name": "sys_monitor_mgr_online_user",
      //     "component": "system/onlineUser/index",
      //     "redirect": "",
      //     "meta": {
      //         "title": "在线用户",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/onlineUser",
      //     "hidden": false
      // },
      // {
      //     "id": "1277153538518061058",
      //     "pid": "1268815024873418753",
      //     "name": "sys_monitor_mgr_druid",
      //     "component": "Iframe",
      //     "redirect": "",
      //     "meta": {
      //         "title": "数据监控",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": "http://localhost:82/druid/login.html"
      //     },
      //     "path": "/druid",
      //     "hidden": false
      // },
      // {
      //     "id": "1278538938717347842",
      //     "pid": "1264619904766685186",
      //     "name": "sys_sms_mgr",
      //     "component": "system/sms/index",
      //     "redirect": "",
      //     "meta": {
      //         "title": "短信管理",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/sms",
      //     "hidden": false
      // },
      // {
      //     "id": "1277520397092302850",
      //     "pid": "1277507562966740993",
      //     "name": "sys_notice_mgr_received",
      //     "component": "system/noticeReceived/index",
      //     "redirect": "",
      //     "meta": {
      //         "title": "已收公告",
      //         "icon": "",
      //         "show": true,
      //         "target": null,
      //         "link": null
      //     },
      //     "path": "/noticeReceived",
      //     "hidden": false
      // },
      {
        "id": "1265474261896806403",
        "pid": "1265474261896806402",
        "name": "scheduler",
        "component": "system/scheduler/index",
        "redirect": "",
        "meta": {
          "title": "班次管理",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/scheduler",
        "hidden": false
      },


      {
        "id": "1265474261896806413",
        "pid": "1265474261896806402",
        "name": "sys_org_mgr",
        "component": "system/paiban/index",
        "redirect": "",
        "meta": {
          "title": "排班管理",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/paiban",
        "hidden": false
      },
      {
        "id": "1265474261896806419",
        "pid": "1265474261896806402",
        "name": "sys_pos_mgr",
        "component": "system/pos/index",
        "redirect": "",
        "meta": {
          "title": "医生管理",
          "icon": "",
          "show": true,
          "target": null,
          "link": null
        },
        "path": "/pos",
        "hidden": false
      },

      //   {
      //       "id": "1265474261896806424",
      //       "pid": "1283308304890847233",
      //       "name": "sys_menu_mgr",
      //       "component": "system/menu/index",
      //       "redirect": "",
      //       "meta": {
      //           "title": "菜单管理",
      //           "icon": "",
      //           "show": true,
      //           "target": null,
      //           "link": null
      //       },
      //       "path": "/menu",
      //       "hidden": false
      //   },
      //   {
      //       "id": "1265474261896806430",
      //       "pid": "1283308304890847233",
      //       "name": "sys_role_mgr",
      //       "component": "system/role/index",
      //       "redirect": "",
      //       "meta": {
      //           "title": "角色管理",
      //           "icon": "",
      //           "show": true,
      //           "target": null,
      //           "link": null
      //       },
      //       "path": "/role",
      //       "hidden": false
      //   },
      //   {
      //       "id": "1265474261896806440",
      //       "pid": "1265474261896806439",
      //       "name": "sys_log_mgr_vis_log",
      //       "component": "system/log/vislog/index",
      //       "redirect": "",
      //       "meta": {
      //           "title": "访问日志",
      //           "icon": "",
      //           "show": true,
      //           "target": null,
      //           "link": null
      //       },
      //       "path": "/vislog",
      //       "hidden": false
      //   },
      //   {
      //       "id": "1265474261896806441",
      //       "pid": "1265474261896806439",
      //       "name": "sys_log_mgr_op_log",
      //       "component": "system/log/oplog/index",
      //       "redirect": "",
      //       "meta": {
      //           "title": "操作日志",
      //           "icon": "",
      //           "show": true,
      //           "target": null,
      //           "link": null
      //       },
      //       "path": "/oplog",
      //       "hidden": false
      //   },
      //   {
      //       "id": "1265474261896806442",
      //       "pid": "1264619904766685186",
      //       "name": "sys_dict_mgr",
      //       "component": "system/dict/index",
      //       "redirect": "",
      //       "meta": {
      //           "title": "字典管理",
      //           "icon": "",
      //           "show": true,
      //           "target": null,
      //           "link": null
      //       },
      //       "path": "/dict",
      //       "hidden": false
      //   }
    ],
    "dataScopes": [],
    "tenants": null,
    "enabled": true,
    "password": null,
    "username": "superAdmin",
    "authorities": [],
    "accountNonExpired": true,
    "credentialsNonExpired": true,
    "accountNonLocked": true
  }
  console.log('mock: body getLoginUser')
  return builder(loginUser, "", 200)
}

Mock.mock('/api/login', 'post', login2)
Mock.mock('/api/getLoginUser', 'get', getLoginUser)
Mock.mock(/\/auth\/login/, 'post', login)
Mock.mock(/\/auth\/logout/, 'post', logout)
Mock.mock(/\/account\/sms/, 'post', smsCaptcha)
Mock.mock(/\/auth\/2step-code/, 'post', twofactor)
