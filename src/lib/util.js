import React from 'react'
import {  Modal,message } from 'antd';
import HTTP from '../httpServer/axiosConfig.js'
const { confirm } = Modal;
const util ={
    showReaderTip:function(bookInfo){
        if(!bookInfo.url) return message.error('书本链接不存在！')
        const userAgent = navigator.userAgent; 
        if (userAgent.indexOf("Chrome") > -1) {
            if(bookInfo.extension ==='pdf'){
                window.open(bookInfo.url,"_blank")
            }else{
                sessionStorage.setItem('bookInfo',JSON.stringify(bookInfo));
                location.href = '#/reader';
            }
        }else{
            confirm({
                title: '阅读提示',
                content: <div>当前的浏览器可能无法阅读PDF文件，建议<br />使用谷歌浏览器</div>,
                okText: '确认',
                className: 'confirmDialog',
                cancelText: '取消',
                onOk() {
                },
                onCancel() { }
            });
        }

    }
}

export default util;