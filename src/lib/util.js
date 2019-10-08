import React from 'react'
import {  Modal,message } from 'antd';
import HTTP from '../httpServer/axiosConfig.js'
const { confirm } = Modal;
const util ={
    showReaderTip:function(bookInfo){
        
        confirm({
            title: '阅读提示',
            content: <div>当前的浏览器可能无法阅读PDF文件，建议使用谷歌浏览器</div>,
            okText: '确认',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {
                window.open(bookInfo.url,"_blank")
            },
            onCancel() { }
        });
        // if(!bookInfo.url) return message.error('书本链接不存在！')
        // const userAgent = navigator.userAgent; 
        // if(bookInfo.extension ==='pdf'){
        //     if(userAgent.indexOf("Chrome") > -1){
        //         window.open(bookInfo.url,"_blank")
        //     }else{
        //         confirm({
        //             title: '阅读提示',
        //             content: <div>当前的浏览器可能无法阅读PDF文件，建议<br />使用谷歌浏览器</div>,
        //             okText: '确认',
        //             className: 'confirmDialog',
        //             cancelText: '取消',
        //             onOk() {
        //                 window.open(bookInfo.url,"_blank")
        //             },
        //             onCancel() { }
        //         });
        //     }
            
        // }else{
        //     sessionStorage.setItem('bookInfo',JSON.stringify(bookInfo));
        //     location.href = '#/reader';
        // }

    }
}

export default util;