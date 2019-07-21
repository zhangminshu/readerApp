import React from 'react';
import { Layout, Menu, Icon, Button, Input, Drawer,message } from 'antd';
import { HashRouter, Route, hashHistory, Switch } from 'react-router-dom';
import HTTP from '../../httpServer/axiosConfig.js'
import SiderMenu from '../../componment/navSider/index.jsx'
import MyFooter from '../../componment/footer/index.jsx'
import './style.less'
import cookie from 'js-cookie';
import bannerBg from '../../img/banner.svg';
import bookAdd from '../../img/book_add.svg'
import onlineReading from '../../img/online_reading.svg'
import bookManager from '../../img/book_manager.svg'
import { debug } from 'util';

const { Header, Footer, Sider, Content } = Layout;
class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            visible: false
        }
    }
    componentDidMount(){
        // this.getUserInfo();
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    toResultPage = () => {
        this.props.history.push('/searchResult')
    }
    toLogin = (isLogin) => {
        if(isLogin){
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const role = userInfo.role;
            if(role !== 2){
                this.props.history.push('/desk')
            }else{
                this.props.history.push('/manager')
            }
        }else{
            this.props.history.push('/login')
        }
    }
    toUserInfo =()=>{
        this.props.history.push('/userInfo')
    }
    render() {
        // const userInfo = this.state.userInfo;
        // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const cookUserInfo = cookie.get('userInfo') || null
        const userInfo = JSON.parse(cookUserInfo)
        let isLogin = false; let userName = '';let photo = '';let hasPhoto =false;
        if (userInfo) {
            if(userInfo.photo && userInfo.photo.length > 0){
                photo = userInfo.photo;
                hasPhoto = true;
            }else{
                userName = userInfo.nick_name[0];
            }
            isLogin = true;
        }
        return (
            <div className="homeWarp">
                <Layout>
                    <Header className="publicHeader">
                        <div className="menuBtn showInBig"><Icon onClick={this.toggleCollapsed} type={this.state.collapsed ? 'menu' : 'arrow-left'} /></div>
                        <div className="menuBtn showInSmall"><Icon onClick={this.showDrawer} type="menu"/></div>
                        <div className="searchWarp"><Input allowClear placeholder="搜索" onClick={this.toResultPage} /> <span className="result"></span></div>
                        <div className="loginInfo" > {hasPhoto? <img className="userPhoto" onClick={this.toUserInfo} src={photo} alt=""/> : (!isLogin ? <span onClick={()=>{this.toLogin(false)}}>登录</span> : <span className="userName" onClick={this.toUserInfo}>{userName}</span>)} </div>
                    </Header>

                    <Layout>
                        <Sider className="siderWarp mySider" collapsed={this.state.collapsed}>
                            <SiderMenu ></SiderMenu>
                        </Sider>

                        <Layout>
                            <Content className="mainContent">
                                <div className="bannerWarp">
                                    <div className="solgan  ">
                                        
                                        <h1 className="bigDesc">你要的书， 这里都有</h1>
                                        <h3 className="smallDesc">找书，用阅读链</h3>
                                        <Button className="btn_login" type="primary" onClick={()=>{this.toLogin(isLogin)}}>立即体验</Button>
                                        <img className="bannerBg" src={bannerBg} alt="" />
                                    </div>

                                </div>
                                <div className="content">
                                    <div className="titleWarp">
                                        <div className="bigTitle">功能介绍</div>
                                        <div className="subTitle">Introduction</div>
                                    </div>
                                    <div className="introWarp">
                                        <div className="item">
                                            <div className="itemImg"><img src={bookAdd} alt="" /></div>
                                            <div className="title">添加电子书</div>
                                            <div className="desc">
                                                <div>支持文件搜索、站内文件分享和本</div>
                                                <div>地上传三种方式</div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="itemImg"><img src={onlineReading} alt="" /></div>
                                            <div className="title">在线阅读</div>
                                            <div className="desc">
                                                <div>支持mobi 、epub 、azw3 、txt、pdf</div>
                                                <div>文件在线阅读</div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="itemImg"><img src={bookManager} alt="" /></div>
                                            <div className="title">书籍管理</div>
                                            <div className="desc">
                                                <div>自定义标签，灵活管理每一本书,还</div>
                                                <div>可以分享电子书</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Content>
                            <MyFooter></MyFooter>
                        </Layout>

                    </Layout>

                </Layout>

                <Drawer title="" placement="left" closable={false} onClose={this.onClose} visible={this.state.visible} className="mySider">
                    <SiderMenu></SiderMenu>
                </Drawer>
            </div>
        )
    }
}

export default HomePage;