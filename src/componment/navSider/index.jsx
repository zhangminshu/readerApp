import React from 'react';
import PropTypes from 'prop-types';
import { Layout, Menu, Icon, Button, Input } from 'antd';
// import './style.less'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;
const navList = [{
    name: '首页',
    path: '/',
    jumpType: 1,
    key: 0
  },
  {
    name: '注册登录',
    path: '/login',
    jumpType: 1,
    key: 1
  },
  {
    name: '问题反馈',
    path: '/index',
    jumpType: 1,
    key: 3
  },
  {
    name: '权利声明',
    path: '/statement',
    jumpType: 1,
    key: 4
  },
  {
    name: '服务协议',
    path: '/serverAgreement',
    jumpType: 1,
    key: 5
  },
  {
    name: '用户协议',
    path: '/userAgreement',
    jumpType: 1 ,
    key: 6
  }]
  const loginNav = [{
    name: '首页',
    path: '/',
    jumpType: 1,
    key: 0
  },
  {
    name: '书籍代找',
    path: 'https://jinshuju.net/f/0Dggwt',
    jumpType: 2,
    key: 2
  },
  {
    name: '问题反馈',
    path: 'https://jinshuju.net/f/peZNo8 ',
    jumpType: 2,
    key: 3
  },
  {
    name: '权利声明',
    path: '/statement',
    jumpType: 1,
    key: 4
  },
  {
    name: '服务协议',
    path: '/serverAgreement',
    jumpType: 1,
    key: 5
  },
  {
    name: '用户协议',
    path: '/userAgreement',
    jumpType: 1 ,
    key: 6
  }]
class navSider extends React.Component {
    static contextTypes ={
        router:PropTypes.object
    }
    constructor(props){
        super(props);
        this.state={

        }
    }
    getSider =()=>{
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let currList =[];
        if(userInfo){
          currList = loginNav
        }else{
          currList = navList
        }
        const menuList =[];
        currList.map(item=>{
            menuList.push(<Menu.Item onClick={()=>{this.changeMenu(item)}} key={item.key}> <span>{item.name}</span></Menu.Item>)
        })
        return menuList;
    }
    changeMenu =(item)=>{
        if(item.jumpType === 1){
            this.context.router.history.push(item.path)
        }else if(item.jumpType === 2){
            window.open(item.path,"_blank")
        }
    }
  render() {
    debugger
    const defOpenKey = this.props.defOpenKey || '0'
    return (
      <Menu defaultSelectedKeys={[defOpenKey]} defaultOpenKeys={['sub1']} mode="inline" theme="light">
        {this.getSider()}
      </Menu>
    )
  }
}

export default navSider;