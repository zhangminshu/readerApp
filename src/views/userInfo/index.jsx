import React from 'react';
import cookie from 'js-cookie'
import { Table, Input, Icon, Button, message, Modal, Radio, Form, Upload,Tooltip, Popover, Checkbox } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import './style.less'
import { debug } from 'util';
const { confirm } = Modal;
const RadioGroup = Radio.Group;
const SUCCESS_CODE = 0;
const text = <span>请将发送邮箱添加至您的亚马逊-已认可的发件人电子邮箱列表</span>;
class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {},
            days: "",
            newUserInfo: {
                email: '',
                nick_name: "",
                new_pwd: '',
                status: '',
                kindle_email: '',
                old_pwd: '',
                new_pwd: ''
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
                localStorage.setItem('userInfo',JSON.stringify(res.data))
                cookie.set('userInfo',res.data,{ expires: 7 });
                const days = this.countDay(res.data.update_pwd_time)
                this.setState({
                    userInfo: res.data,
                    days: days
                })
            } else {
                message.error(res.error);
            }
        })
    }

    countDay = (lastDate) => {
        if (lastDate == '') return 0;
        const currDate = new Date();
        const date1 = new Date(currDate.getFullYear(), currDate.getMonth() + 1, currDate.getDate());
        const date2 = new Date(lastDate.substr(0, 4), lastDate.substr(5, 2), lastDate.substr(8, 2));
        const date = (date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24);
        return date;
    }
    toIndex = () => {
        this.props.history.go(-1)
    }
    edit = (oldVal, fileName, title) => {
        this.setDialog(oldVal, fileName, title);
    }
    handleChange = (e, fileName) => {
        const newUserInfo = this.state.newUserInfo;
        newUserInfo[fileName] = e.target.value;
        this.setState({
            newUserInfo
        });
    };
    getDialogContent = (oldVal, fileName) => {
        let currHtml = '';
        const fileType = oldVal;
        const radioHtml = <div className="radioWarp"><RadioGroup defaultValue={fileType} onChange={(e) => { this.handleChange(e, fileName) }} >
            <div className="radioItem"><Radio value={1}>公开</Radio></div>
            <div className="radioItem"><Radio value={0}>私有</Radio></div>
        </RadioGroup></div>;
        const inputHtml = <div><Input allowClear defaultValue={oldVal} placeholder="" onChange={(e) => { this.handleChange(e, fileName) }} /></div>;
        const pwdHtml = <div className="radioWarp">
            <div className="radioItem"><Input.Password className="loginInput" autoComplete="off" datasource={[]} type="password" placeholder="原密码" onChange={(e) => { this.handleChange(e, 'old_pwd') }} /></div>
            <div className="radioItem"><Input.Password className="loginInput" autoComplete="off" datasource={[]} type="password" placeholder="新密码" onChange={(e) => { this.handleChange(e, 'new_pwd') }} /></div>
        </div>;
        switch (fileName) {
            case 'is_public':
                currHtml = radioHtml;
                break;
            case 'changePWD':
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
        const { newUserInfo, userInfo } = this.state;
        const requestData = {};
        let url = '';
        if (fileName === 'changePWD') {
            requestData['old_pwd'] = newUserInfo['old_pwd'];
            requestData['new_pwd'] = newUserInfo['new_pwd'];
            url = '/user/_pwd'
        } else {
            requestData[fileName] = newUserInfo[fileName];
            url = '/user/_info'
        }
        HTTP.put(url, requestData).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.getUserInfo();
                message.success('修改成功！')
            } else {
                message.error(res.error)
            }
        })
    }
    logout = () => {
        const _this = this;
        confirm({
            title: '退出登录',
            content: '确定要退出登录吗？',
            okText: '退出',
            className: 'confirmDialog',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                cookie.remove('Authorization');
                cookie.remove('userInfo');
                sessionStorage.removeItem('userInfo');
                localStorage.clear();
                sessionStorage.clear();
                _this.props.history.push('/login');
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file) => {

        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPG) {
            message.error('请上传PNG或JPG格式的图片!');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('图片大小不能超过10MB!');
        }
        return isJPG && isLt10M;
    }
    handleImgChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            this.getUserInfo();
            this.getBase64(info.file.originFileObj, imageUrl => {
                const newUserInfo = this.state.userInfo;
                newUserInfo['photo'] = imageUrl;
                this.setState({
                    userInfo: newUserInfo
                })
            }
            );
        }
    };
    render() {
        const userInfo = this.state.userInfo;
        const nickName = userInfo.nick_name || "";
        const username = nickName[0];
        const photo = userInfo.photo || '';
        return (
            <div className="userInfoWarp">
                <div className="publicHeader"><div className="menuBtn"><Icon onClick={this.toIndex} type={'arrow-left'} /></div></div>
                <div className="content">
                    <div className="ms-tc">

                        {/* {photo.length>0 ? <img className="userPhoto" src={photo} alt=""/> : <span className="username">{username}</span>} */}
                        <Upload
                            name="photo"
                            listType="picture-card"
                            className="avatar-uploader userImgUpload"
                            showUploadList={false}
                            action={`/user/_photo?access_token=${cookie.get('Authorization')}`}
                            beforeUpload={this.beforeUpload}
                            onChange={this.handleImgChange}
                        >
                            {photo.length > 0 ? <img className="userPhoto" src={photo} alt="" /> : <span className="username">{username}</span>}
                        </Upload>
                    </div>
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
                            <span className="edit ms_fr" onClick={() => { this.edit('', 'changePWD', '修改密码') }}>编辑</span>
                            <span className="value ms_fr">{this.state.days}天未修改密码</span>
                        </div>
                        <div className="subItem clearFix">
                            <span className="label ms_fl">存储空间</span>
                            <span className="edit ms_fr" ></span>
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
                            <span className="edit ms_fr"><Tooltip overlayClassName="myToolTip"  placement="topRight" title={text}><Icon style={{color: "#333"}} type="info-circle" /></Tooltip></span>
                            <span className="value ms_fr">kindle@yuedu.pro</span> </div>
                        <div className="subItem clearFix">
                            <span className="label ms_fl">接收邮箱</span>
                            <span className="edit ms_fr" onClick={() => { this.edit(userInfo.kindle_email, 'kindle_email', '修改接收邮箱') }}>编辑</span>
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