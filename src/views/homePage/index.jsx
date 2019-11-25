import React from 'react';
import { Layout, Menu, Icon, Button, Input, Drawer,message } from 'antd';
import { HashRouter, Route, hashHistory, Switch } from 'react-router-dom';
import HTTP from '../../httpServer/axiosConfig.js'
import SiderMenu from '../../componment/navSider/index.jsx'
import MyFooter from '../../componment/footer/index.jsx'
import './style.less'
import cookie from 'js-cookie';
import bannerBg from '../../img/banner.svg';
import download from '../../img/download.svg'
import kindle from '../../img/kindle.svg'
import bookManager from '../../img/book_manager.svg'
import iconDownload from '../../img/icon_download.svg'
// import { debug } from 'util';
const SUCCESS_CODE =0
const { Header, Footer, Sider, Content } = Layout;
class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: true,
            visible: false,
            showPoint:false
        }
    }
    componentDidMount(){
        document.title = '阅读链 - 找书就用阅读链'
        // this.getUserInfo();
        const Authorization = cookie.get('Authorization')
        if(Authorization){
            this.getDownloadCount();
        }
    }
    getDownloadCount=()=>{
        const url ='/book/_download_count';
        HTTP.get(url,{}).then((response)=>{
            const res = response.data;
            if(res.status === SUCCESS_CODE){
                if(res.data > 0){
                    this.setState({showPoint:true})
                }else{
                    this.setState({showPoint:false})
                }
            }
        })
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
        sessionStorage.removeItem('searchVal')
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
    toDownloadCenter=()=>{
        this.props.history.push('/downloadCenter')
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
                        <div className="menuBtn showInBig"><Icon onClick={this.toggleCollapsed} type={this.state.collapsed ? 'menu' : 'menu-fold'} /></div>
                        <div className="menuBtn showInSmall"><Icon onClick={this.showDrawer} type="menu"/></div>
                        <div className="searchWarp"><Input allowClear placeholder="搜索" onClick={this.toResultPage} /> <span className="result"></span></div>
                        {isLogin || hasPhoto?<div className="downloadMark" onClick={this.toDownloadCenter}>
                        <img className="iconDownload" src={iconDownload} alt=""/>
                        {this.state.showPoint?<i className="point"></i>:""}
                        </div>:""}
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
                                        <h3 className="smallDesc">找书，就用阅读链</h3>
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
                                            <div className="itemImg"><img src={download} alt="" /></div>
                                            <div className="title">免费下载</div>
                                            <div className="desc">
                                                <div>所有电子书免费下载，并且可以转</div>
                                                <div>码为其他格式后下载</div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="itemImg"><img src={kindle} alt="" /></div>
                                            <div className="title">kindle推送</div>
                                            <div className="desc">
                                                <div>EPUB 和 AZW3 格式的文件也能推</div>
                                                <div>送到kindle</div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="itemImg"><img src={bookManager} alt="" /></div>
                                            <div className="title">书籍管理</div>
                                            <div className="desc">
                                                <div>自定义标签，灵活管理每一本书,快</div>
                                                <div>把收藏的书分享给朋友们吧</div>
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