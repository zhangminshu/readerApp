import React from 'react';
import cookie from 'js-cookie'
import { Form, Icon, Input, Button, Checkbox,message,Modal } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import { Link } from 'react-router-dom';
import './style.less'
import wxBg from '../../img/wxCode.png'
const FormItem = Form.Item;
class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isRegister:true,
            showKfModal:false
        }
    }
    handleSubmit = e => {
        let isVaild = false;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                isVaild = true;
            }
        });
        const isRegister = this.state.isRegister;
        const formVals = this.props.form.getFieldsValue();
        if(!isVaild){return;
        }
        const email = formVals.email;
        const pwd = formVals.password;
        if(isRegister){
            if(!formVals.isAgree) return message.warning('请先阅读并接受《用户协议》及《服务协议》')
            const registerUrl = '/user/_signup';
            HTTP.post(registerUrl,{email,pwd}).then(response=>{
                const res = response.data;
                if(res.status === 0){
                    message.success('注册成功，请重新登录！')
                    this.setState({isRegister:false})
                }else{
                    message.error(res.error);
                }
            })
        }else{
            const loginUrl = '/user/_signin';
            HTTP.post(loginUrl,{email,pwd}).then(response=>{
                const res = response.data;
                if(res.status === 0){
                    console.log('11',res.data.token)
                    cookie.set('Authorization',res.data.token);
                    this.getUserInfo()
                    // message.success('登录成功！')
                }else{
                    message.error(res.error);
                }
            })
        }        
    };
    getUserInfo = () => {
        const url = '/user/_info';
        HTTP.get(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                sessionStorage.setItem('userInfo',JSON.stringify(res.data));
                localStorage.setItem('userInfo',JSON.stringify(res.data))
                if(res.data.role === 2){
                    this.props.history.push('/manager')
                }else{
                    this.props.history.push('/desk')
                }
            }
        })
    }
    changeLoginState =()=>{
        this.setState({
            isRegister:!this.state.isRegister
        })
    }
    jumpToIndex =()=>{
        this.props.history.push('/')
    }
    render() {
        const {isRegister} = this.state;
        const changeTxt = isRegister ? '已有账号？立即登录':'没有账号？免费注册';
        const loginBtnTxt = isRegister ? '注册' : '登录';
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="loginWarp">
                <div className="toIndex"><Icon onClick={this.jumpToIndex} type={'arrow-left'} /></div>
                <div className="loginRegister">
                    <div className="logImg"><span className="icon_log"></span></div>
                    <div className="mainBox">
                        <Form  className="">
                            <FormItem>
                                {getFieldDecorator('email', {
                                    initialValue:'',
                                    rules: [{type: 'email',message: '邮箱格式不正确!'},
                                        {required: true,message: '请输入邮箱地址!'},],
                                })(
                                    <Input className="loginInput" autoComplete="off" datasource={[]} allowClear placeholder="邮箱" />,
                                )}
                            </FormItem>
                            <FormItem >
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入登陆密码!' }],
                                })(
                                    <Input.Password className="loginInput" autoComplete="off" datasource={[]} type="password" placeholder="密码"/>,
                                )}
                            </FormItem>
                            <Button type="primary" className="btn_login" onClick={this.handleSubmit}>{loginBtnTxt}</Button>
                            {!isRegister?<div className="forgetPw" onClick={()=>{this.setState({showKfModal:true})}}>忘记密码？</div>:""}
                            {isRegister?
                            <FormItem className="userAgreement">
                                {getFieldDecorator('isAgree', {
                                })(
                                    <div><Checkbox ></Checkbox><span>阅读并接受<Link to="/userAgreement">《用户协议》</Link>及<Link to="/serverAgreement">《服务协议》</Link></span></div>
                                )}
                            </FormItem>:""}
                            <Button className="btn_change" onClick={this.changeLoginState}>{changeTxt}</Button>
                        </Form>
                    </div>
                </div>
                <Modal className="kfModal" visible={this.state.showKfModal} onCancel={()=>{this.setState({showKfModal:false})}} footer={null}>
                        <div className="ms-tc"><img className="wxCodeBg" src={wxBg} alt=""/></div>
                        <div className="ms-tc wx_desc">请扫码联系客服</div>
                    </Modal>
            </div>
        )
    }
}
LoginPage = Form.create()(LoginPage);
export default LoginPage;