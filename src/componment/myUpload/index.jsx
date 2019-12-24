import React from 'react';
import cookie from 'js-cookie';
import MD5 from 'browser-md5-file';
import { Upload, Button, Icon, Modal, Table,message } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import './style.less'
import util from '../../lib/util.js';
import loading from '../../img/loading.gif';
import success from '../../img/iconSuccess.svg'
const { Dragger } = Upload;

class MyUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            uploadingList:[],
            showDetail:false,
            showUploading:true,
            showFinash:false,
            visible: false,
            isFinash:false
        }
        this.unVaildList=[];
        this.uploadingList=[];
        this.limitStorage=5000;
        this.usedStorage='';
    }

    handleChange = info => {
        
        let fileList = [...info.fileList];
        const newFileList = [];
        const newUploadingList =[];
        fileList.forEach(file=>{
            if(!this.unVaildList.includes(file.uid)){
                newFileList.push(file);
                if(file.status !=='done'){
                    newUploadingList.push(file.name)
                }
            }
        })
        if(newUploadingList.length > 0){
            this.setState({ fileList:newFileList,uploadingList:newUploadingList,visible:true,isFinash:false });
        }else{
            this.setState({ showFinash:true,showDetail:false,isFinash:true });
            this.props.updateTable(true);
            const totalList = fileList.length;
            const unVaildList = this.unVaildList.length;
            if(totalList !== unVaildList){
                message.success('上传成功！')
            }
        }        
    };
    beforeUpload = (file) => {
        
        const fileName = file.name;
        const fileSplit = file.name.split('.');
        const fileType = fileSplit[fileSplit.length-1];
        const accpetType=['txt','epub','mobi','pdf','azw3'];
        const isValid = accpetType.includes(fileType.toLocaleLowerCase());
        if (!isValid) {
            message.error('请上传epub、pdf、txt、mobi、azw3格式的文件');
        }
        const fileSize = file.size / 1024 / 1024;
        const isLt200M = fileSize < 200;
        const isOverLimit = fileSize + this.usedStorage > this.limitStorage;
        if (!isLt200M) {
            message.error('文件大小不能超过200MB!');
        }
        if(!isValid || !isLt200M || isOverLimit){
            this.unVaildList.push(file.uid);
        }
        if(isOverLimit){
            message.error(`你可使用的容量最大为${this.limitStorage}MB!`);
            return false;
        }
        if(isValid && isLt200M && !isOverLimit){
            const bmf = new MD5();
            const p1 = new Promise((resolve,reject)=>{
                bmf.md5(file, (err, md5) => {
                    resolve(md5)
                }
            );
            }) 
            return p1.then(md5=>{
                return new Promise((resolve,reject)=>{
                    const url ='/book/_repeat';
                    HTTP.post(url,{md5:md5}).then(response=>{
                        const res = response.data;
                        if(res.status === 0){
                            if(res.data === 0){
                                resolve(true)
                            }else{
                                message.error(`上传文件${fileName}已存在`)
                                this.unVaildList.push(file.uid);
                                reject(false)
                            }
                        }else{
                            message.error(res.error)
                            this.unVaildList.push(file.uid);
                            reject(false)
                        }
                    })
                })
            })
        }else{
            let result = isValid && isLt200M && !isOverLimit
            return  result;
        }
        
        
    }
    checkMd5 = (file) => {
        return new Promise((resolve,reject)=>{
            bmf.md5(file, (err, md5) => {
                resolve(md5)
            }
            );
        })

    }
    /**
     * 校验文件是否已经存在
     */
    isUpload =(file)=>{
        const md5 = this.checkMd5(file)
        const url ='/book/_repeat';
        return new Promise((resolve,reject)=>{
            HTTP.post(url,{md5:md5}).then(response=>{
                const res = response.data;
                if(res.status === 0 && res.data === 1){
                    resolve(true)
                }else{
                    reject(false)
                }
            })
        })
    }
    handleCancel = e => {
        const isFinash = this.state.isFinash;
        if(isFinash){
            this.setState({
                showDetail: false,
                showFinash:true
            });
        }else{
            this.setState({
                showDetail: false,
                showFinash:false
            });
        }

    };
    handldClickUpload=()=>{
        const url = '/user/_info';
        HTTP.get(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.limitStorage = res.data.storage_limit;
                this.usedStorage = res.data.storage_used;
            }
        })
    }
    render() {
        let baseUrl =''
        const pathname =  location.href
        if(pathname.indexOf('dev.yuedu.pro') > 0){
            baseUrl ='//dev-api.yuedu.pro'
        }else if(pathname.indexOf('yuedu.pro') > 0){
            baseUrl = '//api.yuedu.pro'
        }else{
            baseUrl =''
        }
        const props = {
            showUploadList: false,
            name: 'book',
            action: baseUrl + '/book',
            beforeUpload: this.beforeUpload.bind(this),
            onChange: this.handleChange,
            multiple: true,
            headers: { Authorization: cookie.get('Authorization') }
        };
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                width:'180px',
                render: (text, record) => {
                    const fileSplit = text.split('.');
                    const fileType = fileSplit[fileSplit.length-1];
                    const fileIcon = util.getFileIcon(fileType);
                    let displayText = <div className="">
                        <img style={{width:'24px',height:'24px'}} className="fileIcon" src={fileIcon} alt="" />
                        <span className="fileName">{text}</span>
                    </div>;
                    return displayText;
                }
            },
            {
                title: '进度',
                align:'right',
                width:'160px',
                dataIndex: 'percent',
                key: 'percent',
                render:(text,record)=>{
                    const size = (record.size/1024/1024).toFixed(2)+'MB';
                    const hasUploadSize = (text/100 *record.size/1024/1024).toFixed(2) +'MB';
                    return <span>{hasUploadSize}/{size}</span>
                }
            },
            {
                title: '状态',
                align:'center',
                width: '40px',
                dataIndex: 'status',
                key: 'status',
                render:(text,record)=>{
                    //<Icon type="loading" />
                    // const icon = text==='done' ? success : loading;
                    // return <img style={{width:'16px',height:'16px'}} src={icon} alt=""/>
                    if(text==='done'){
                        return <img style={{width:'16px',height:'16px'}} src={success} alt=""/>
                    }else{
                        return <Icon type="loading-3-quarters" spin  />
                    }
                }
            },
        ];
        return (
            <div>
                <div className="myUpload">
                    <Upload {...props} className={`${this.state.visible ? 'hidden' : ''}`}>
                        <Button className="btn_upload" type="primary" onClick={this.handldClickUpload}><Icon type="plus" /> </Button>
                    </Upload>
                    {/* <Modal
                    mask={false}
                        width="416px"
                        className="uploadDetail"
                        closable={false} destroyOnClose={false} footer={null}
                        visible={this.state.visible}
                    >
                    </Modal> */}
                </div>
                {this.state.visible ? <div>
                    <div className={`${this.state.showDetail?'isDetail':""} uploadDetail`}>
                        <div className="uploadWarp">
                        {this.state.showDetail?
                            <div className="main">
                                <div className="title ms-tc">上传详情</div>
                                <Table className="uploadList" dataSource={this.state.fileList} columns={columns} pagination={false} showHeader={false} rowKey={(record, index) => `complete${record.uid}${index}`} />
                                <div className="footer">
                                    {/* <Upload className="btn_upload" {...props} >
                                        <Button className="btn_add">添加文件</Button>
                                    </Upload> */}
                                    <Button className="btn_hide" type="primary" onClick={this.handleCancel}>隐藏</Button>
                                </div>
                            </div>:""}
                            {!this.state.showDetail && !this.state.showFinash?
                            <div className="overview clearFix">
                                {/* <img style={{width:'24px',height:'24px'}} className="fileIcon ms_fl" src={loading} alt="" /> */}
                                <Icon className="fileIcon ms_fl" type="loading-3-quarters" spin  />
                                <span className="descText ms_fl">正在上传</span>
                                <span className="fileNames ms_fl">{this.state.uploadingList[0]}</span>
                                <span className="ms_fl disInBlock">{this.state.fileList.length - this.state.uploadingList.length}/{this.state.fileList.length}</span>
                                <span className="ms_fr disInBlock open" onClick={()=>{this.setState({showDetail:true,showUploading:false})}}>展开</span>
                            </div>:""}
                            {this.state.showFinash?
                            <div className="overview clearFix">
                                <img style={{width:'24px',height:'24px'}} className="fileIcons ms_fl" src={success} alt="" />
                                <span className="descText ms_fl">已上传{this.state.fileList.length}个文件</span>
                                <span className="ms_fr disInBlock btn_close" onClick={()=>{this.setState({visible:false,showFinash:false,fileList:[],uploadingList:[]})}} >关闭</span>
                                <span className="ms_fr disInBlock btn_detail" onClick={()=>{this.setState({showDetail:true,showFinash:false})}} >查看详情</span>
                            </div>:""}
                            {/* <div className="desc">拖入文件上传</div> */}
                        </div>
                    </div>
                    {/* <div className="draggerUpload">
                        <Dragger  {...props}></Dragger>
                    </div> */}
                </div> : ""}
            </div>
        );
    }
}

export default MyUpload;