import React from 'react';
import cookie from 'js-cookie'
import { Table, Input, Icon, Button, message, Modal, Radio, Form, Popover, Checkbox } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import './style.less'
const { confirm } = Modal;
const RadioGroup = Radio.Group;
const SUCCESS_CODE = 0;
class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            newUserInfo:{
                email:'',
                nick_name:"",
                new_pwd:'',
                status:'',
                kindle_email:''
            }
        }
    }
    componentDidMount() {
        this.getUserInfo();
    }
    getUserInfo = () => {
        const url = '/user/_info';
        HTTP.get(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.setState({
                    userInfo: res.data
                })
            } else {
                message.error(res.error);
            }
        })
    }
    toIndex = () => {
        this.props.history.push('/')
    }
    edit = (oldVal, fileName, title) => {
        this.setDialog(oldVal, fileName, title);
    }
    handleChange = (e,fileName) => {
        const newUserInfo = this.state.newUserInfo;
        newUserInfo[fileName] = e.target.value;
        this.setState({
            newUserInfo
        });
    };
    getDialogContent = (oldVal, fileName) => {
        let currHtml = '';
        const fileType = oldVal;
        const radioHtml = <div className="radioWarp"><RadioGroup defaultValue={fileType} onChange={(e)=>{this.handleChange(e,fileName)}} >
            <div className="radioItem"><Radio value={1}>公开</Radio></div>
            <div className="radioItem"><Radio value={0}>私有</Radio></div>
        </RadioGroup></div>;
        const inputHtml = <div><Input allowClear defaultValue={oldVal} placeholder="" onChange={(e)=>{this.handleChange(e,fileName)}}/></div>;
        const pwdHtml = <div className="radioWarp">
            <div className="radioItem"><Input.Password className="loginInput" autoComplete="off" datasource={[]} type="password" placeholder="原密码" onChange={(e)=>{this.handleChange(e,'oldPwd')}}/></div>
            <div className="radioItem"><Input.Password className="loginInput" autoComplete="off" datasource={[]} type="password" placeholder="新密码" onChange={(e)=>{this.handleChange(e,'newPwd')}}/></div>
        </div>;
        switch (fileName) {
            case 'is_public':
                currHtml = radioHtml;
                break;
            case 'new_pwd':
                currHtml = pwdHtml;
                break;
            default:
                currHtml = inputHtml
        }
        return currHtml;
    }
    setDialog = (oldVal, fileName, title) => {

        const _this = this;
        const contentHtml = this.getDialogContent(oldVal, fileName)
        confirm({
            title: title,
            content: <div>{contentHtml}</div>,
            okText: '确认',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {
                
                _this.updateUserInfo(fileName);
            },
            onCancel() { }
        });
    }
    updateUserInfo = (fileName) => {
        const {newUserInfo,userInfo} = this.state;
        const id = userInfo.id;
        const requestData = {};
        requestData[fileName] = newUserInfo[fileName];
        // const url = `/book/${bookId}/_info`;
        const url =`/user/${id}/_info`
        HTTP.put(url, requestData).then(response => {
            debugger;
            const res = response.data;
            if (res.status === 0) {
                const tableData = this.state.tableData;
                tableData.forEach(item => {
                    if (item.id === bookId) item.is_public = isPublic;
                })
                this.setState({
                    tableData
                })
                message.success('修改成功！')
            } else {
                message.error(res.error)
            }
        })
    }
    logout =()=>{
        cookie.remove('Authorization');
        sessionStorage.removeItem('userInfo');
        this.props.history.push('/login');
    }
    render() {
        const userInfo = this.state.userInfo;
        const nickName = userInfo.nick_name || "";
        const username = nickName[0];
        return (
            <div className="userInfoWarp">
                <div className="publicHeader"><div className="menuBtn"><Icon onClick={this.toIndex} type={'arrow-left'} /></div></div>
                <div className="content">
                    <div className="ms-tc"><span className="username">{username}</span></div>
                    <div className="baseInfo item">
                        <div className="title">基本信息</div>
                        <div className="subItem clearFix">
                            <span className="label ms_fl">用户名</span>
                            <span className="edit ms_fr" onClick={() => { this.edit(userInfo.nick_name, 'nick_name', '修改用户名') }}>编辑</span>
                            <span className="value ms_fr">{userInfo.nick_name}</span>
                        </div>
                        <div className="subItem clearFix">
                            <span className="label ms_fl">邮箱地址</span>
                            <span className="edit ms_fr" onClick={() => { this.edit(userInfo.email, 'email', '修改邮箱地址') }}>编辑</span>
                            <span className="value ms_fr">{userInfo.email}</span>
                        </div>
                        <div className="subItem clearFix">
                            <span className="label ms_fl">密码</span>
                            <span className="edit ms_fr" onClick={() => { this.edit('', 'new_pwd', '修改密码') }}>编辑</span>
                            <span className="value ms_fr">{userInfo.update_pwd_time}</span>
                        </div>
                        <div className="subItem clearFix">
                            <span className="label ms_fl">存储空间</span>
                            <span className="edit ms_fr" onClick={() => { this.edit(userInfo.storage_limit, 'storage_limit', '修改存储空间') }}>编辑</span>
                            <span className="value ms_fr">{userInfo.storage_limit} MB (已使用{userInfo.storage_used} MB)</span>
                        </div>
                    </div>
                    <div className="baseInfo item">
                        <div className="title">上传设置</div>
                        <div className="subItem clearFix">
                            <span className="label ms_fl">文件类型</span>
                            <span className="edit ms_fr" onClick={() => { this.edit(userInfo.is_public, 'is_public', '文件上传') }}>编辑</span>
                            <span className="value ms_fr">{userInfo.is_public === 1 ? '公共' : '私有'}</span>
                        </div>
                    </div>
                    <div className="baseInfo item">
                        <div className="title">发送至Kindle</div>
                        <div className="subItem clearFix">
                            <span className="label ms_fl">发送邮箱</span>
                            <span className="edit ms_fr"></span>
                            <span className="value ms_fr">{userInfo.email}</span> </div>
                        <div className="subItem clearFix">
                            <span className="label ms_fl">接收邮箱</span>
                            <span className="edit ms_fr" onClick={() => { this.edit(userInfo.nick_name, 'kindle_email', '修改接收邮箱') }}>编辑</span>
                            <span className="value ms_fr">{userInfo.kindle_email}</span>
                        </div>
                    </div>
                    <Button className="btn_logout" type="danger" onClick={this.logout}>退出登录</Button>
                </div>
            </div>
        )
    }
}
UserInfo = Form.create()(UserInfo);
export default UserInfo;