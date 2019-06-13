import React from 'react';
import { Layout, Menu, Icon, Button, Input } from 'antd';
// import './style.less'
const { SubMenu } = Menu;
const { Header, Footer, Sider, Content } = Layout;
class navSider extends React.Component {

  render() {
    const navList = [{
      name: '首页',
      path: '/index',
      jumpType: 1,
      key: 0
    },
    {
      name: '注册',
      path: '/register',
      jumpType: 1,
      key: 1
    },
    {
      name: '书籍代找',
      path: '/index',
      jumpType: 1,
      key: 2
    },
    {
      name: '问题反馈',
      path: '/index',
      jumpType: 1,
      key: 3
    },
    {
      name: '权利声明',
      path: '/index',
      jumpType: 1,
      key: 4
    },
    {
      name: '服务协议',
      path: '/index',
      jumpType: 1,
      key: 5
    },
    {
      name: '用户协议',
      path: '/index',
      jumpType: 1,
      key: 5
    }]
    return (
      <Menu defaultSelectedKeys={['1']} defaultOpenKeys={['sub1']} mode="inline" theme="light">
        <Menu.Item key="1">
          <span>Option 1</span>
        </Menu.Item>
      </Menu>
    )
  }
}

export default navSider;