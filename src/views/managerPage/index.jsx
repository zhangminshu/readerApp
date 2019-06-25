import React from 'react';
import { Layout, Table, Input, Icon, Button, message, Modal, Radio, Popover, Checkbox, Menu } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import SiderMenu from '../../componment/navSider/index.jsx'
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
const navList = [{
    name: '统计概览',
    key: '0'
},
{
    name: '人员管理',
    key: '1'
},
{
    name: '文件管理',
    key: '2'
}]
class ManagerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableSelectedRowKeys:[],
            selectedRow:[],
            showCheckBox:false,
            pageNum:1,
            pageSize:10,
            showTable:false,
            result:0,
            tableData:[],
            fileType:0,
            searchBookName:'',
            tableName:'统计概览',
            activeMenu:'0',
        }
    }
    componentDidMount(){
        debugger
        this.changeMenu(navList[0])
    }
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    handleSearchChange=(e)=>{
        const urlList = ["/book","/user","/file"];
        const currUrl = urlList[this.state.activeMenu];
        const value = e.target.value
        this.searchBookOrFille(currUrl,value)
    }
    searchBookOrFille=(url,value)=>{
        const requestJson={
            keyword:value,
            pn:this.state.pageNum,
            ps:this.state.pageSize
        }
        HTTP.get(url,{params:requestJson}).then(response=>{
            const res = response.data;
            if(res.status === 0){
                this.setState({
                    showTable:true,
                    result:res.data.total,
                    tableData:res.data.list,
                    searchBookName:value
                })
            }else{
                message.error(res.error)
            }
        })
    }
    changeMenu = (item) => {
        const urlList = ["/book","/user","/file"];
        const currUrl = urlList[item.key];
        this.setState({
            activeMenu:item.key,
            tableName:item.name
        })
        this.searchBookOrFille(currUrl)
    }
    getSider = () => {
        const menuList = [];
        navList.map(item => {
            menuList.push(<Menu.Item onClick={() => { this.changeMenu(item) }} key={item.key}> <span>{item.name}</span></Menu.Item>)
        })
        return menuList;
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
    handleRadioChange = e => {
        this.setState({
            fileType: e.target.value,
        });
      };
    showDeleteConfirm=()=> {
        const _this = this;
        const ids = [];
        this.state.selectedRow.forEach(item=>{
            ids.push(item.id)
        })
        const bookIds = ids.join(',');
        confirm({
          title: '删除文件',
          content: '删除后将不可找回，确认删除？',
          okText: '删除',
          className:'confirmDialog',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            _this.deleteBooks(bookIds,ids)
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }
    deleteBooks =(bookIds,ids)=>{
        const url ='/book';
        HTTP.delete(url,{params:{book_ids:bookIds}}).then(response=>{
            const res = response.data;
            if(res.status === SUCCESS_CODE){
                message.success('删除成功！');
                this.searchBookOrFille(this.state.searchBookName,'delete')
            }else{
                message.error(res.error)
            }
        })
    }
    showShareConfirm=()=> {
        confirm({
          title: '分享文件',
          content: <div><Input className="shareUrl" /><p className="desc">把链接通过微信、QQ、微博等方式分享给好友</p></div>,
          okText: '复制',
          className:'confirmDialog',
          cancelText: '取消',
          onOk() {
            console.log('OK');
          },
          onCancel() {
            console.log('Cancel');
          },
        });
    }
    fileTypeChange=()=>{
        const bookId = this.state.selectedRow[0].id;
        const fileType = this.state.selectedRow[0].is_public;
        const _this = this;
        confirm({
          title: '修改类型',
          content: <div className="radioWarp"><RadioGroup defaultValue={fileType} onChange={this.handleRadioChange} >
                        <div className="radioItem"><Radio value={1}>公开</Radio></div>
                        <div className="radioItem"><Radio value={0}>私有</Radio></div>
                    </RadioGroup></div>,
          okText: '确认',
          className:'confirmDialog',
          cancelText: '取消',
          onOk() {
            const isPublic = _this.state.fileType;
            _this.modifyFileType(bookId,isPublic);
          },
          onCancel() {}
        });
    }
    modifyFileType=(bookId,isPublic)=>{
        const url =`/book/${bookId}/_info`;
        HTTP.put(url,{is_public:isPublic}).then(response=>{
            const res = response.data;
            if(res.status === 0){
                const tableData = this.state.tableData;
                tableData.forEach(item=>{
                    if(item.id === bookId) item.is_public = isPublic;
                })
                this.setState({
                    tableData
                })
                message.success('修改成功！')
            }else{
                message.error(res.error)
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
            _this.modifyFileType(bookId,isPublic);
          },
          onCancel() {}
        });
    }
    handleCheckBox(checkedValues) {
        console.log('checked = ', checkedValues);
      }
    render() {
        const statisticsCol =[{
            title:'名称',
            dataIndex: 'title',
            key: 'title',
            align:'left'
        },{
            title:'数值',
            dataIndex: 'total',
            key: 'total',
            align:'right'
        }]
        const columns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                width: '50%',
                render: (text, record) => {
                    let fileIcon = coverPDF;
                    switch (record.extension) {
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
                    let displayText = <div className="fileName">
                        <img className="fileIcon" src={fileIcon} alt="" />
                        <span className={`${record.is_owner === 1 ? 'isOwerFile' : ''}`}>{text}</span>
                    </div>;
                    return displayText;
                }
            },
            {
                title: '大小',
                dataIndex: 'size',
                key: 'size',
                width: '20%',
                render: (text) => {
                    let val = text.toFixed(2) + 'MB';
                    return val;
                }
            },
            {
                title: '上传时间',
                dataIndex: 'address',
                key: 'address',
                width: '20%',
                render: (text) => {
                    let val = '2019/6/5';
                    return val;
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                render: (text, record) => {
                    const optContent = (
                        <div>
                            <p className="optItem" onClick={() => { alert(record.id) }}>分享</p>
                            <p className="optItem">kindle</p>
                            <p className="optItem">下载</p>
                            <p className="optItem">标签</p>
                            <p className="optItem">重命名</p>
                            <p className="optItem">文件类型</p>
                            <p className="optItem">删除</p>
                        </div>
                    );
                    const optHtml = <div className="optWarp">

                        <Popover placement="rightTop" content={optContent} trigger="click">
                            <Icon style={{ fontSize: '16px' }} type="ellipsis" />
                        </Popover>
                    </div>
                    return optHtml;
                }
            },
        ];
        const currCol = this.state.activeMenu === '0' ?statisticsCol : columns;
        const userInfo = sessionStorage.getItem('userInfo');
        let isLogin = false; let userName = '';
        if (userInfo) {
            userName = JSON.parse(userInfo).nick_name[0];
            isLogin = true;
        }
        const isAdminUser = false;
        const rowSelection = {
            onChange: this.handleChange,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys: this.state.tableSelectedRowKeys
        };
        const currRowSelection = this.state.activeMenu ==='0'?null:rowSelection;
        return (
            <div className="managerWarp">
                <Layout>
                    <Header className="publicHeader">
                        <div className="menuBtn"><Icon onClick={this.toggleCollapsed} type={this.state.collapsed ? 'arrow-left' : 'menu'} /></div>
                        <div className="searchWarp"><Input allowClear placeholder="搜索" onChange={(value)=>{this.handleSearchChange(value,'search')}} /> <span className="result">找到约 {this.state.result} 条结果</span></div>
                        <div className="loginInfo" > {!isLogin ? <span onClick={this.toLogin}>注册</span> : <span className="userName">{userName}</span>} </div>
                    </Header>

                    <Layout>
                        <Sider className="siderWarp" collapsed={this.state.collapsed}>
                            {/* <SiderMenu></SiderMenu> */}
                            <Menu defaultSelectedKeys={[this.state.activeMenu]} mode="inline" theme="light">
                                {this.getSider()}
                            </Menu>
                        </Sider>

                        <Layout>
                            <Content className="mainContent">
                                <div  className={`${this.state.activeMenu === '0' ? 'grayTh' : ''} myTableWarp`}>
                                    <div className="clearFix">
                                        <div className="title ms_fl" style={{fontSize: '20px',color: '#1B2733'}}>{this.state.tableName}</div>
                                        <div className={`${this.state.showCheckBox ? 'showBtnList' : ''} btn_list ms_fr`}>
                                            <Button className="btn btn_fileType" type="primary" onClick={this.fileTypeChange.bind(this)}>类型</Button>
                                            <Button className="btn btn_del" type="danger" onClick={this.showDeleteConfirm}>删除</Button>
                                        </div>
                                    </div>
                                    <Table  rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''}`} pagination={false} columns={currCol} rowSelection={currRowSelection} dataSource={this.state.tableData} />
                                </div>
                            </Content>
                        </Layout>

                    </Layout>

                </Layout>
            </div>
        )
    }
}

export default ManagerPage;