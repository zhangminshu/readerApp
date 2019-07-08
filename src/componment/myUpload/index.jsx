import React from 'react';
import cookie from 'js-cookie';
// import MD5 from 'browser-md5-file';
import { Upload, Button, Icon, Modal, Table,message } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import './style.less'
import loading from '../../img/loading.gif';
import success from '../../img/iconSuccess.svg'
import coverPDF from '../../img/coverPDF.svg'
import coverAZW3 from '../../img/coverAZW3.svg'
import coverEPUB from '../../img/coverEPUB.svg'
import coverMOBI from '../../img/coverMOBI.svg'
import coverTXT from '../../img/coverTXT.svg'
// const bmf = new MD5();
class MyUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            visible: false
        }
        this.unVaildList=[];
    }

    getFileIcon = (type) => {
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
    handleChange = info => {
        let fileList = [...info.fileList];
        const newFileList = [];
        console.log('info',info)
        fileList.forEach(file=>{
            if(!this.unVaildList.includes(file.uid)){
                newFileList.push(file);
            }
        })
        this.setState({ fileList:newFileList, visible: true });
        // this.unVaildList =[];
        
        console.log('unVaildList',this.unVaildList)
    };
    beforeUpload = (file) => {
        console.log('beforeUpload:', file)
        let isUploaded ='uploading';
        // bmf.md5(file,(err, md5) => {
        //         console.log('md5 string:', md5); // 97027eb624f85892c69c4bcec8ab0f11
        //         isUploaded = this.isUpload(md5)
        //     }
        // );
        const fileSplit = file.name.split('.');
        const fileType = fileSplit[fileSplit.length-1];
        const accpetType=['txt','epub','mobi','pdf','azw3'];
        const isValid = accpetType.includes(fileType);
        if (!isValid) {
            message.error('只能上传txt、epub、mobi、pdf、azw3格式的文件!');
        }
        const isLt200M = file.size / 1024 / 1024 < 200;
        if (!isLt200M) {
            message.error('文件大小不能超过200MB!');
        }
        if(!isValid || !isLt200M){
            this.unVaildList.push(file.uid);
        }
        return isValid && isLt200M ;
        
    }
    /**
     * 校验文件是否已经存在
     */
    isUpload =(md5)=>{
        const url ='/book/_repeat';
        let flag =false;
        HTTP.post(url,{md5:md5}).then(response=>{
            const res = response.data;
            if(res.status === 0 && res.data === 1){
                flag = true;
            }
        })
        return flag;
    }
    handleCancel = e => {
        this.setState({
            visible: false,
        });
        this.unVaildList =[];
    };
    render() {
        const props = {
            showUploadList: false,
            name: 'book',
            action: '/book',
            beforeUpload: this.beforeUpload,
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
                    const fileIcon = this.getFileIcon(fileType);
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
                    const icon = text==='done' ? success : loading;
                    return <img style={{width:'16px',height:'16px'}} src={icon} alt=""/>
                }
            },
        ];
        return (
            <div className="myUpload">

                <Upload {...props} className={`${this.state.visible ? 'hidden' : ''}`}>
                    <Button className="btn_upload" type="primary"><Icon type="plus" /> </Button>
                </Upload>
                <Modal
                    width="416px"
                    className="uploadDetail"
                    closable={false} destroyOnClose={false} footer={null}
                    visible={this.state.visible}
                >
                    <div className="uploadWarp">
                        <div className="main">
                            <div className="title ms-tc">上传详情</div>
                            <Table className="uploadList" dataSource={this.state.fileList} columns={columns} pagination={false} showHeader={false} rowKey={(record, index) => `complete${record.uid}${index}`} />
                            <div className="footer">
                                <Upload className="btn_upload" {...props} >
                                    <Button className="btn_add">添加文件</Button>
                                </Upload>
                                <Button className="btn_hide" type="primary" onClick={this.handleCancel}>隐藏</Button>
                            </div>
                        </div>
                        {/* <div className="overview"><span>展开</span></div>
                        <div className="desc">拖入文件上传</div> */}
                    </div>
                </Modal>
            </div>

        );
    }
}

export default MyUpload;