import axios from 'axios';
import cookie from 'js-cookie';
import qs from 'qs';
import {Modal,Notification} from 'antd';

const confirm = Modal.confirm;
let loginout =null;
let hasLoginDialog = false
const HTTP = axios.create({
    headers:{},
    timeout:60000
});

HTTP.interceptors.request.use(
    config =>{
        // config.url = 'http://47.96.81.45:8080' + config.url
        if(!config.headers.Authorization && cookie.get('Authorization')){
            config.headers.Authorization = cookie.get('Authorization');
        }
        if(config.method === 'post'){

            if(!config.headers['Content-Type']){
                config.headers['Content-Type'] ='application/json;charset=UTF-8';
                config.data = JSON.stringify(config.data ? config.data : {});
            }else if(config.headers['Content-Type'] === 'application/x-www-form-urlencoded'){
                config.data = qs.stringify(config.data)
            }
        }
        return config;
    },
    error =>{
        throw new Error(error);
    }
);

HTTP.interceptors.response.use(
    response =>{
        const status = response && response.data && response.data.status;
        const isSearchPage = location.href.indexOf('searchResult')>0;
        if(status === 2){
            if(hasLoginDialog || isSearchPage) return;
            hasLoginDialog = true
            confirm({
                title: "请登录",
                content: "登录后可使用该功能",
                okText: '登录',
                className: 'confirmDialog',
                cancelText: '取消',
                onOk() {
                    hasLoginDialog = false;
                    location.href = '#/login';
                },
                onCancel() {
                    hasLoginDialog = false;
                 }
            });
        }else{
            return response;
        }
    },
    error =>{
         
        const status = error && error.data && error.data.status;
        if(status === 2){
            cookie.remove('Authorization');
            if(!loginout && location.href.indexOf('/login') < 0){
                loginout = true;
                confirm({
                    title:'温馨提示',
                    content:'系统超时，是否返回重新登录？',
                    onOk(){
                        location.href = '#/login';
                        loginout = false;
                    },
                    onCancel(){}
                })
            }
        }else if(status === 400){
            Notification['warning']({
                message:'温馨提示',
                description:error.response.data && error.response.data.error_description || '账号异常，请检查账号'
            })
        }else if(status === 403){
            Notification['warning']({
                message:'温馨提示',
                description:'账号授权失效'
            })
        }
        throw new Error(error);
    }
);

export default HTTP;