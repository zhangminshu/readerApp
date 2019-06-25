import React from 'react';
import { Layout, Menu, Icon, Button, Input } from 'antd';
import { HashRouter, Route, hashHistory, Switch } from 'react-router-dom';
import SiderMenu from '../../componment/navSider/index.jsx'
import MyFooter from '../../componment/footer/index.jsx'
import './style.less'
import bannerBg from '../../img/banner.svg';
import bookAdd from '../../img/book_add.svg'
import onlineReading from '../../img/online_reading.svg'
import bookManager from '../../img/book_manager.svg'

const { Header, Footer, Sider, Content } = Layout;
class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        }
    }
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    toResultPage = () => {
        this.props.history.push('/searchResult')
    }
    toLogin =()=>{
        this.props.history.push('/login')
    }
    render() {
        const userInfo = sessionStorage.getItem('userInfo');
        let isLogin =false;let userName ='';
        if(userInfo){
            userName = JSON.parse(userInfo).nick_name[0];
            isLogin =true;
        }
        return (
            <div className="homeWarp">
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
                                <div className="bannerWarp">
                                    <img className="bannerBg" src={bannerBg} alt="" />
                                    <h1 className="bigDesc">你要的书， 这里都有</h1>
                                    <h3 className="smallDesc">找书、看书，一站解决</h3>
                                    <Button className="btn_login" type="primary" onClick={this.toLogin}>立即体验</Button>
                                </div>
                                <div className="content">
                                    <div className="titleWarp">
                                        <div className="bigTitle">功能介绍</div>
                                        <div className="subTitle">Introduction</div>
                                    </div>
                                    <div className="introWarp">
                                        <div className="item">
                                            <div className="itemImg"><img src={bookAdd} alt=""/></div>
                                            <div className="title">添加电子书</div>
                                            <div className="desc">
                                                <div>支持文件搜索、站内文件分享和本</div>
                                                <div>地上传三种方式</div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="itemImg"><img src={onlineReading} alt=""/></div>
                                            <div className="title">在线阅读</div>
                                            <div className="desc">
                                                <div>支持mobi 、epub 、azw3 、txt、pdf</div>
                                                <div>文在线阅读</div>
                                            </div>
                                        </div>
                                        <div className="item">
                                            <div className="itemImg"><img src={bookManager} alt=""/></div>
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
            </div>
        )
    }
}

export default HomePage;