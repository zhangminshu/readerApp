import React from 'react';
import { Layout, Menu, Table, Input, Icon, Button, message, Modal, Popover, Checkbox,Spin } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import './style.less'
import cookie from 'js-cookie';
import coverPDF from '../../img/coverPDF.svg'
import coverAZW3 from '../../img/coverAZW3.svg'
import coverEPUB from '../../img/coverEPUB.svg'
import coverMOBI from '../../img/coverMOBI.svg'
import coverTXT from '../../img/coverTXT.svg'
import iconLoading from '../../img/loading.gif'
const { confirm } = Modal;
const SUCCESS_CODE = 0;
const { Header, Footer, Sider, Content } = Layout;
class DownloadCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData:[],
            isLoading:false
        }
    }
    componentDidMount() {
        document.title = '阅读链 - 下载中心'
        const Authorization = cookie.get('Authorization')
        if(Authorization){
            this.getDownloadList()
        }
        
    }
    getDownloadList =()=>{
        const url= '/book/_download'
        HTTP.get(url,{}).then(response=>{
            const res = response.data;
            if(res.status === SUCCESS_CODE){
                this.setState({
                    tableData:res.data.list
                })
            }
        })
    }
    getDownUrl = (ids) => {
        this.setState({isLoading:true})
        const url = "/book/_download_link";
        HTTP.get(url, { params: { download_id: ids } }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.fileDownload(res.data)
            }else{
                message.error(res.error);
            }
        })
    }
    fileDownload = (href) => {
        const a = document.createElement("a"), //创建a标签
            e = document.createEvent("MouseEvents"); //创建鼠标事件对象
        e.initEvent("click", false, false); //初始化事件对象
        a.href = href; //设置下载地址
        // a.download = name; //设置下载文件名
        a.dispatchEvent(e); //给指定的元素，执行事件click事件
        this.setState({isLoading:false})
    }
    delDownload =(id)=>{
        const _this = this;
        const url = `/book/_download/${id}`;
        HTTP.put(url,{download_id:id}).then(response=>{
            const res = response.data;
            if(res.status === SUCCESS_CODE){
                this.getDownloadList();
            }else{
                message.error(res.error);
            }
        })
    }
    getFileIcon =(type)=>{
        let fileIcon = coverPDF;
        switch(type){
            case 'pdf':
            fileIcon =coverPDF;
            break;
            case 'txt':
            fileIcon =coverTXT;
            break;
            case 'azw3':
            fileIcon = coverAZW3;
            break;
            case 'epub':
            fileIcon =coverEPUB;
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
    render() {
        const columns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                render:(text,record)=>{
                    const fileIcon = this.getFileIcon(record.extension);
                    let displayText = <div className="fileName">
                            <img className="fileIcon" src={fileIcon} alt=""/>
                            <span style={{cursor:'pointer'}} onClick={()=>{this.readerBook(record)}} className={`${record.is_owner === 1 ? 'isOwerFile':''}`}>{text}</span>
                        </div>;
                    return displayText;
                }
            },
            {
                title: '大小',
                dataIndex: 'size',  
                key: 'size',
                render:(text)=>{
                    let val = text.toFixed(2) + 'MB';
                    return val;
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render:(status,record)=>{
                    let displayText =''
                    if(!record.expired){
                        const statusList =['处理中','处理成功','处理失败']
                        displayText =statusList[status-1]
                    }else{
                        displayText = '已过期'
                    }
                    return displayText;
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                render:(text,record)=>{
                    debugger
                    let displayText =''
                    if(!record.expired){
                        if(record.status === 1){
                            displayText = <img src={iconLoading} alt="" style={{display:'inlineBlock',width: '16px'}}/>
                        }else if(record.status === 2){
                            displayText = <span style={{color:'#0070E0',cursor: 'pointer'}} onClick={()=>{this.getDownUrl(record.id)}}>保存</span>
                        }else{
                            displayText = <span style={{color:'#FF3B30',cursor: 'pointer'}} onClick={()=>{this.delDownload(record.id)}}>删除</span>
                        }
                    }else{
                        displayText = <span style={{color:'#FF3B30',cursor: 'pointer'}} onClick={()=>{this.delDownload(record.id)}}>删除</span>
                    }
                    return displayText;
                }
            },
        ];
        const smallColumns=[]
        smallColumns.push(columns[0])
        smallColumns.push(columns[3])
        return (
            <Spin tip="正在下载请稍等" spinning={this.state.isLoading}>
            <div className="deskWarp">
                <Layout>
                    <Header className="publicHeader">
                        <div className="menuBtn"><Icon onClick={this.toLogin} type='arrow-left' /></div>                        
                    </Header>

                        <Layout>
                            <Content className="mainContent">
                                {/* {this.state.showTable ? */}
                                    <div className="myTableWarp">
                                        <div className="clearFix">
                                            <div className="title ms_fl">下载中心</div>
                                        </div>
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`showInBig`} pagination={false} columns={columns} dataSource={this.state.tableData} />
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`showInSmall`} pagination={false} columns={smallColumns}  dataSource={this.state.tableData} />
                                    </div>
                                    {/* : ''} */}
                            </Content>
                        </Layout>
                </Layout>
            </div>
            </Spin>
        )
    }
}

export default DownloadCenter;