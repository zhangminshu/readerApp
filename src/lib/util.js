import React from 'react'
import {  Modal,message } from 'antd';
import coverPDF from '../img/coverPDF.svg'
import coverAZW3 from '../img/coverAZW3.svg'
import coverEPUB from '../img/coverEPUB.svg'
import coverMOBI from '../img/coverMOBI.svg'
import coverTXT from '../img/coverTXT.svg'
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

    },
    getFileIcon:function(type) {
        let fileIcon = coverPDF;
        switch (type) {
            case 'pdf':
                fileIcon = coverPDF;
                break;
            case 'txt':
                fileIcon = coverTXT;
                break;
            case 'azw3':
                fileIcon = coverAZW3;
                break;
            case 'epub':
                fileIcon = coverEPUB;
                break;
            case 'mobi':
                fileIcon = coverMOBI;
                break;
            default:
                fileIcon = coverPDF;
                break;
        }
        return fileIcon;
    }
}

export default util;