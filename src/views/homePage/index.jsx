import React from 'react';
import { Layout, Menu, Icon, Button,Input } from 'antd';
import './style.less'
const { SubMenu } = Menu;
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
    render() {
        return (
            <div className="homeWarp">
                <Layout>
                    <Header className="publicHeader">
                        <div className="menuBtn"><Icon onClick={this.toggleCollapsed} type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} /></div>
                        <div className="searchWarp"><Input allowClear placeholder="搜索" /> <span className="result"></span></div>
                        <div className="loginInfo"><span>注册</span></div>
                    </Header>

                    <Layout>
                        <Sider className="siderWarp" collapsed={this.state.collapsed}>
                            <Menu
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                mode="inline"
                                theme="light"
                            //   inlineCollapsed={this.state.collapsed}
                            >
                                <Menu.Item key="1">
                                    <span>Option 1</span>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <span>Option 2</span>
                                </Menu.Item>
                                <Menu.Item key="3">
                                    <span>Option 3</span>
                                </Menu.Item>
                                <SubMenu
                                    key="sub1"
                                    title={
                                        <span>
                                            <span>Navigation One</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="5">Option 5</Menu.Item>
                                    <Menu.Item key="6">Option 6</Menu.Item>
                                    <Menu.Item key="7">Option 7</Menu.Item>
                                    <Menu.Item key="8">Option 8</Menu.Item>
                                </SubMenu>
                                <SubMenu
                                    key="sub2"
                                    title={
                                        <span>
                                            <span>Navigation Two</span>
                                        </span>
                                    }
                                >
                                    <Menu.Item key="9">Option 9</Menu.Item>
                                    <Menu.Item key="10">Option 10</Menu.Item>
                                    <SubMenu key="sub3" title="Submenu">
                                        <Menu.Item key="11">Option 11</Menu.Item>
                                        <Menu.Item key="12">Option 12</Menu.Item>
                                    </SubMenu>
                                </SubMenu>
                            </Menu>
                        </Sider>

                        <Layout>
                        <Content className="mainContent">Content</Content>
                        <Footer className="footerWarp">Footer</Footer>
                        </Layout>

                    </Layout>

                </Layout>
            </div>
        )
    }
}

export default HomePage;