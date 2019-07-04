import React from 'react';
import { Layout, Menu, Table, Input, Icon, Button, message, Modal, Radio, Popover, Checkbox, Drawer } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import './style.less'

import coverPDF from '../../img/coverPDF.svg'
import coverAZW3 from '../../img/coverAZW3.svg'
import coverEPUB from '../../img/coverEPUB.svg'
import coverMOBI from '../../img/coverMOBI.svg'
import coverTXT from '../../img/coverTXT.svg'
const { confirm } = Modal;
const RadioGroup = Radio.Group;
const SUCCESS_CODE = 0;
const { Header, Footer, Sider, Content } = Layout;
class SharePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            role:1,
            showTable:false,
            tableData:[],
            navList: []
        }
    }
    componentDidMount() {
        this.getShareBookList()
    }
    getShareBookList=()=>{
        const shareParams = location.href.split("?")[1];
        if(!shareParams) return;
        const ids = shareParams.split("=")[1];
        this.getBookListById(ids);
    }
    getBookListById = (id) => {
        let requestJson ={}
        const url = '/book/_share_list';
        if(id !==''){
            requestJson={
                book_ids:id
            }
        }else{
            return;
        }
        HTTP.get(url, { params: requestJson }).then(response => {
            const res = response.data;
            debugger

            if (res.status === 0) {
                this.setState({
                    showTable: true,
                    result: res.data.total,
                    tableData: res.data.list
                })
            } else {
                message.error(res.error)
            }
        })
    }
    getUserInfo = () => {
        const url = '/user/_info';
        HTTP.get(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.setState({
                    userInfo: res.data,
                    role:res.data.role
                })
                sessionStorage.setItem('userInfo',JSON.stringify(res.data));
            }
        })
    }
    getCategory = () => {
        const url = '/category';
        HTTP.get(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                console.log(res.data)
                const newList = this.state.navList.concat(res.data.list);
                this.setState({
                    navList: newList
                })
            } else {
                message.error(res.error);
            }
        })
    }


    fileClone=()=>{
        const bookId = this.state.selectedRow[0].id;
        const fileType = this.state.selectedRow[0].is_public;
        const _this = this;
        confirm({
          title: '修改标签',
          content: <div className="checkWarp">
                        <div className="checkItem"><i className="icon icon_add"></i><span>创建标签</span></div>
                        <div className="checkItem clearFix"><Checkbox onChange={this.handleCheckBox}>标签一</Checkbox><i className="icon icon_edit ms_fr"></i></div>
                        <div className="checkItem clearFix"><Checkbox onChange={this.handleCheckBox}>标签二</Checkbox><i className="icon icon_edit ms_fr"></i></div>
                    </div>,
          okText: '确认',
          className:'confirmDialog',
          cancelText: '取消',
          onOk() {
            const isPublic = _this.state.fileType;
            
          },
          onCancel() {}
        });
    }
    handleChange =(selectedRowKeys, selectedRows)=>{
        this.setState({
            tableSelectedRowKeys:selectedRowKeys
        })
    }
    handleSelect =(record, selected, selectedRows)=>{
        let isShowCheckBox = false;
        if(selectedRows.length > 0){
            isShowCheckBox= true;
        }
        this.setState({
            selectedRow:selectedRows,
            showCheckBox:isShowCheckBox
        })
    }
    handleSelectAll =(selected, selectedRows, changeRows)=>{
        if(selected){
            const selectedLen = this.state.selectedRow.length;
            if(selectedLen > 0){
                this.setState({
                    tableSelectedRowKeys:[],
                    selectedRow:[],
                    showCheckBox:false
                })
            }else{
                this.setState({showCheckBox:true,selectedRow:selectedRows})
            }
        }else{
            this.setState({showCheckBox:false})
        }
    }
    toLogin = () => {
        const userInfo = sessionStorage.getItem("userInfo")
        if(userInfo){
            this.props.history.push('/')
        }else{
            this.props.history.push('/login')
        }
    }
    toUserInfo =()=>{
        this.props.history.push('/userInfo')
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
        const userInfo = this.state.userInfo;
        const role = this.state.role;
        let isLogin = false; let userName = '';let photo = '';let hasPhoto =false;
        if (userInfo) {
            if(userInfo.photo && userInfo.photo.length > 0){
                photo = userInfo.photo;
                hasPhoto = true;
            }else{
                userName = userInfo.nick_name[0];
                isLogin = true;
            }
        }

        const columns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                render:(text,record)=>{
                    const fileIcon = this.getFileIcon(record.extension);
                    let displayText = <div className="fileName">
                            <img className="fileIcon" src={fileIcon} alt=""/>
                            <span className={`${record.is_owner === 1 ? 'isOwerFile':''}`}>{text}</span>
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
                title: '文件类型',
                dataIndex: 'is_public',
                key: 'is_public',
                render:(text)=>{
                    let val = text==0?'私有' :'公开';
                    return val;
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                render:(text,record)=>{
                    const optContent = (
                        <div>
                          <p className="optItem" onClick={()=>{this.fileClone("row",record.id)}}>克隆</p>
                          <p className="optItem">下载</p>
                          <p className="optItem">阅读</p>
                        </div>
                      );
                    const optHtml = <div className="optWarp">
                    
                    <Popover placement="rightTop" content={optContent} trigger="focus">
                    <Button className="btn_more_opt"><Icon style={{fontSize:'16px'}} type="ellipsis" /></Button> 
                    </Popover>
                        </div>
                    return optHtml;
                }
            },
        ];
        const smallColumns=[
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                render:(text,record)=>{
                    const fileIcon = this.getFileIcon(record.extension);
                    let displayText = <div className="fileName">
                            <img className="fileIcon" src={fileIcon} alt=""/>
                            <span className={`${record.is_owner === 1 ? 'isOwerFile':''}`}>{text}</span>
                        </div>;
                    return displayText;
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                render:(text,record)=>{
                    const optContent = (
                        <div>
                          <p className="optItem" onClick={()=>{this.fileClone("row",record.id)}}>克隆</p>
                          <p className="optItem">下载</p>
                          <p className="optItem">阅读</p>
                        </div>
                      );
                    const optHtml = <div className="optWarp">
                    
                    <Popover placement="rightTop" content={optContent} trigger="focus">
                    <Button className="btn_more_opt"><Icon style={{fontSize:'16px'}} type="ellipsis" /></Button> 
                    </Popover>
                        </div>
                    return optHtml;
                }
            },
        ];
        const isAdminUser = false;
        const rowSelection = {
            columnWidth:'30px',
            onChange: this.handleChange,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys:this.state.tableSelectedRowKeys
        };
        return (
            <div className="deskWarp">
                <Layout>
                    <Header className="publicHeader">
                        <div className="menuBtn showInBig"><Icon onClick={this.toLogin} type='arrow-left' /></div>                        
                    </Header>

                        <Layout>
                            <Content className="mainContent">
                                {/* {this.state.showTable ? */}
                                    <div className="myTableWarp">
                                        <div className="clearFix">
                                            <div className="title ms_fl">全部文件</div>
                                            <div className={`${this.state.showCheckBox ? 'showBtnList' : ''} btn_list ms_fr`}>
                                                <Button className="btn btn_clone" type="primary" onClick={this.fileClone}>克隆</Button>
                                                <Button className="btn btn_download">下载</Button>
                                            </div>
                                        </div>
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInBig`} pagination={false} columns={columns} rowSelection={rowSelection} dataSource={this.state.tableData} />
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInSmall`} pagination={false} columns={smallColumns} rowSelection={rowSelection} dataSource={this.state.tableData} />
                                    </div>
                                    {/* : ''} */}
                            </Content>
                        </Layout>



                </Layout>
            </div>
        )
    }
}

export default SharePage;