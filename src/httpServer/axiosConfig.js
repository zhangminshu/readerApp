import axios from 'axios';
import cookie from 'js-cookie';
import qs from 'qs';
import {Modal,Notification} from 'antd';

const confirm = Modal.confirm;
let loginout =null;
const HTTP = axios.create({
    headers:{},
    timeout:60000
});

HTTP.interceptors.request.use(
    config =>{
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
        return response;
    },
    error =>{
        const status = error && error.response && error.response.status;
        if(status === 401){
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