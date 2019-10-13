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
const { confirm } = Modal;
const SUCCESS_CODE = 0;
const { Header, Content } = Layout;
class DownloadCenter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableData:[],
            isLoading:false,
            pageNum: 1,
            pageSize: 10,
        }
        this.timer =null;
    }
    componentDidMount() {
        document.title = '阅读链 - 下载中心';
        const _this = this;
        const Authorization = cookie.get('Authorization')
        if(Authorization){
            this.getDownloadList()
            _this.timer = setInterval(()=>{
                _this.getDownloadList();
            },10000)
        }
        
    }
    componentWillUnmount(){
        clearInterval(this.timer)
        this.setState = (state, callback) => {
            return
          }
    }
    getDownloadList =()=>{
        let {pageNum,pageSize} = this.state;
        let requestJson = {
            pn: pageNum,
            ps: pageSize
        }
        const url= '/book/_download'
        HTTP.get(url,{ params: requestJson }).then(response=>{
            const res = response.data;
            if(res.status === SUCCESS_CODE){
                this.setState({
                    tableData:res.data.list,
                    result:res.data.list.length || 0
                })
            }
        })
    }
    pageChange =(current, pageSize)=>{
        this.setState({
            pageNum:current
        },()=>{
            this.getDownloadList()
        });
        
    }
    delDownload =(id)=>{
        const _this = this;
        const url = `/book/_download/${id}`;
        HTTP.delete(url,{}).then(response=>{
            const res = response.data;
            if(res.status === SUCCESS_CODE){
                message.success('删除成功！');
                this.getDownloadList();
            }else{
                message.error(res.error);
            }
        })
    }
    toIndex = () => {
        this.props.history.go(-1)
    }
    getFileIcon =(type)=>{
        let fileIcon = coverPDF;
        switch(type.toLocaleLowerCase()){
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
        const currPagination = this.state.result>10?{
            total:this.state.result,
            pageSize:this.state.pageSize,
            current:this.state.pageNum,
            onChange:this.pageChange.bind(this)
        }:false
        const currSmallPagination =this.state.result>10?{
            size:'small',
            total:this.state.result,
            pageSize:this.state.pageSize,
            current:this.state.pageNum,
            onChange:this.pageChange.bind(this)
        }:false
        const columns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                render:(text,record)=>{
                    const fileSplit = text.split('.');
                    const fileType = fileSplit[fileSplit.length-1];
                    const fileIcon = this.getFileIcon(fileType);
                    let displayText = <div className="fileName">
                            <img className="fileIcon" src={fileIcon} alt=""/>
                            <span>{text}</span>
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
                className:'downloadOpt',
                render:(text,record)=>{
                    let displayText =''
                    if(!record.expired){
                        if(record.status === 1){
                            displayText = <div style={{minWidth:'35px',display:'inlineBlock'}}><Icon style={{color: '#1890ff'}} className="" type="loading-3-quarters" spin  /></div>
                        }else if(record.status === 2){
                            displayText =  <a style={{minWidth:'35px',display:'inlineBlock'}} download href={`/book/_download_link?download_id=${record.id}`}>保存</a>
                        }else{
                            displayText = <span style={{color:'#FF3B30',cursor: 'pointer',minWidth:'35px',display:'inlineBlock'}} onClick={()=>{this.delDownload(record.id)}}>删除</span>
                        }
                    }else{
                        displayText = <span style={{color:'#FF3B30',cursor: 'pointer',minWidth:'35px',display:'inlineBlock'}} onClick={()=>{this.delDownload(record.id)}}>删除</span>
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
                        <div className="menuBtn"><Icon onClick={this.toIndex} type='arrow-left' /></div>                        
                    </Header>

                        <Layout>
                            <Content className="mainContent">
                                {/* {this.state.showTable ? */}
                                    <div className="myTableWarp">
                                        <div className="clearFix">
                                            <div className="downloadTitle ms_fl">下载中心</div>
                                        </div>
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} pagination={currPagination} className={`showInBig`}  columns={columns} dataSource={this.state.tableData} />
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} pagination={currSmallPagination} className={`showInSmall`}  columns={smallColumns}  dataSource={this.state.tableData} />
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