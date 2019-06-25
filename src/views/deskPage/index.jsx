import React from 'react';
import {Layout, Table, Input, Icon,Button,message,Modal,Radio,Popover,Checkbox   } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import SiderMenu from '../../componment/navSider/index.jsx'
import './style.less'

import coverPDF from '../../img/coverPDF.svg'
import coverAZW3 from '../../img/coverAZW3.svg'
import coverEPUB from '../../img/coverEPUB.svg'
import coverMOBI from '../../img/coverMOBI.svg'
import coverTXT from '../../img/coverTXT.svg'
const { confirm } = Modal;
const RadioGroup = Radio.Group;
const SUCCESS_CODE = 0;
const { Header, Footer, Sider, Content } = Layout;
class DeskPage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      
    }
  }
  toggleCollapsed = () => {
    this.setState({
        collapsed: !this.state.collapsed,
    });
  };
  render() {
    const userInfo = sessionStorage.getItem('userInfo');
    let isLogin =false;let userName ='';
    if(userInfo){
        userName = JSON.parse(userInfo).nick_name[0];
        isLogin =true;
    }
    return (
      <div className="deskWarp">
                <Layout>
                    <Header className="publicHeader">
                        <div className="menuBtn"><Icon onClick={this.toggleCollapsed} type={this.state.collapsed ? 'arrow-left' : 'menu'} /></div>
                        <div className="searchWarp"><Input allowClear placeholder="搜索" onClick={this.toResultPage} /> <span className="result"></span></div>
                        <div className="loginInfo" > {!isLogin? <span onClick={this.toLogin}>注册</span> : <span className="userName">{userName}</span>} </div>
                    </Header>

                    <Layout>
                        <Sider className="siderWarp" collapsed={this.state.collapsed}>
                            <SiderMenu></SiderMenu>
                        </Sider>

                        <Layout>
                            <Content className="mainContent">

                            </Content>
                        </Layout>

                    </Layout>

                </Layout>
      </div>
    )
  }
}

export default DeskPage;