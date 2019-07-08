import React from 'react';
import { Layout, Menu, Table, Input, Icon, Button, message, Modal, Radio, Popover, Checkbox, Drawer, Upload } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import MyUpload from '../../componment/myUpload/index.jsx'
import axios from 'axios'
import copy from 'copy-to-clipboard';
import cookie from 'js-cookie';
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
class DeskPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed:true,
            fileList: [],
            visible: false,
            role: 1,
            bookName: '',
            activeItem: '-2',
            showTable: false,
            tableData: [],
            navList: [{
                id: "-2",
                title: '最近阅读',
                remark: ''
            }, {
                id: "",
                title: '全部书籍',
                remark: ''
            }, {
                id: "-1",
                title: '未分类',
                remark: ''
            }]
        }
    }
    componentDidMount() {
        this.getUserInfo();
        this.getCategory();
        this.getBookListById(this.state.activeItem)
    }
    getUserInfo = () => {
        const url = '/user/_info';
        HTTP.get(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.setState({
                    userInfo: res.data,
                    role: res.data.role
                })
                sessionStorage.setItem('userInfo', JSON.stringify(res.data));
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
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    toResultPage = () => {
        this.props.history.push('/searchResult')
    }
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    getSider = (type) => {
        const navList = this.state.navList;
        const menuList = [];
        navList.map(item => {
            menuList.push(<Menu.Item onClick={() => { this.changeMenu(item.id, type) }} key={item.id}> <span>{item.title}</span></Menu.Item>)
        })
        return menuList;
    }
    getBookListById = (id) => {
        let requestJson = {}
        const url = '/book';
        if (id !== '') {
            requestJson = {
                category_id: id
            }
        }
        HTTP.get(url, { params: requestJson }).then(response => {
            const res = response.data;
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
    changeMenu = (id, type) => {
        if (type === 'small') {
            this.setState({
                visible: false,
                tableSelectedRowKeys: [],
                selectedRow: [],
                showCheckBox: false,
                activeItem: id.toString()
            })
        } else {
            this.setState({
                tableSelectedRowKeys: [],
                selectedRow: [],
                showCheckBox: false,
                activeItem: id.toString()
            })
        }

        this.getBookListById(id)
    }
    showDeleteConfirm = (type, item) => {
        const _this = this;
        const ids = [];
        let bookIds = "";
        if (type === 'single') {
            bookIds = item.id.toString();
        } else {
            this.state.selectedRow.forEach(item => {
                ids.push(item.id)
            })
            bookIds = ids.join(',');
        }
        confirm({
            title: '删除文件',
            content: '删除后将不可找回，确认删除？',
            okText: '删除',
            className: 'confirmDialog',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                _this.deleteBooks(bookIds, ids)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    deleteBooks = (bookIds, ids) => {
        const url = '/book';
        HTTP.delete(url, { params: { book_ids: bookIds } }).then(response => {
            const res = response.data;
            if (res.status === SUCCESS_CODE) {
                message.success('删除成功！');
                this.changeMenu(this.state.activeItem)
            } else {
                message.error(res.error)
            }
        })
    }
    fileTypeChange = (type, item) => {
        const ids = [];
        let defType = 0;
        let bookId = "";

        if (type === 'single') {
            bookId = item.id.toString();
            defType = item.is_public;
        } else {
            this.state.selectedRow.forEach(item => {
                ids.push(item.id);
                defType = defType || item.is_public;
            })
            bookId = ids.join(',')
        }
        const _this = this;
        confirm({
            title: '修改类型',
            content: <div className="radioWarp"><RadioGroup defaultValue={defType} onChange={this.handleRadioChange} >
                <div className="radioItem"><Radio value={1}>公开</Radio></div>
                <div className="radioItem"><Radio value={0}>私有</Radio></div>
            </RadioGroup></div>,
            okText: '确认',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {
                const isPublic = _this.state.fileType;
                _this.modifyFileType(bookId, isPublic);
            },
            onCancel() { }
        });
    }
    modifyFileType = (bookId, isPublic) => {
        const url = '/book/_public';
        HTTP.put(url, { book_ids: bookId, is_public: isPublic }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                const fileTableData = this.state.fileTableData;
                const ids = bookId.split(",")
                fileTableData.forEach(item => {
                    if (ids.includes(item.id.toString())) item.is_public = isPublic;
                })
                this.setState({
                    fileTableData
                })
                message.success('修改成功！')
            } else {
                message.error(res.error)
            }
        })
    }
    fileClone = () => {
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
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {
                const isPublic = _this.state.fileType;
                _this.modifyFileType(bookId, isPublic);
            },
            onCancel() { }
        });
    }
    fileShare = (type, id) => {
        const ids = [];
        let bookIds = "";
        if (type === "row") {
            bookIds = id;
        } else {
            this.state.selectedRow.forEach(item => {
                ids.push(item.id)
            })
            bookIds = ids.join(',');
        }
        const shareUrl = location.origin + "/#/share?bid=" + bookIds;
        this.showShareConfirm(shareUrl)
    }
    showShareConfirm = (shareUrl) => {
        confirm({
            title: '分享文件',
            content: <div><Input className="shareUrl" disabled defaultValue={shareUrl} /><p className="desc">把链接通过微信、QQ、微博等方式分享给好友</p></div>,
            okText: '复制',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {
                copy(shareUrl);
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    fileDownload = (href) => {
        const a = document.createElement("a"), //创建a标签
            e = document.createEvent("MouseEvents"); //创建鼠标事件对象
        e.initEvent("click", false, false); //初始化事件对象
        a.href = href; //设置下载地址
        // a.download = name; //设置下载文件名
        a.dispatchEvent(e); //给指定的元素，执行事件click事件
    }
    downloadEvent = (type, item) => {
        let bookIds = "";
        const ids = []
        if (type === 'single') {
            bookIds = item.id;
        } else {
            const fileList = this.state.selectedRow;
            fileList.forEach(item => {
                ids.push(item.id)
                // download(item.title, item.url);
            })
            bookIds = ids.join(",");
        }
        this.getDownUrl(bookIds)
    }
    getDownUrl = (ids) => {
        const url = "/book/_package";
        HTTP.get(url, { params: { book_ids: ids } }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.fileDownload(res.data)
            }
        })
    }
    handleRowChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            tableSelectedRowKeys: selectedRowKeys
        })
    }
    handleSelect = (record, selected, selectedRows) => {
        let isShowCheckBox = false;
        if (selectedRows.length > 0) {
            isShowCheckBox = true;
        }
        this.setState({
            selectedRow: selectedRows,
            showCheckBox: isShowCheckBox
        })
    }
    handleSelectAll = (selected, selectedRows, changeRows) => {
        if (selected) {
            const selectedLen = this.state.selectedRow.length;
            if (selectedLen > 0) {
                this.setState({
                    tableSelectedRowKeys: [],
                    selectedRow: [],
                    showCheckBox: false
                })
            } else {
                this.setState({ showCheckBox: true, selectedRow: selectedRows })
            }
        } else {
            this.setState({ showCheckBox: false })
        }
    }
    toLogin = () => {
        this.props.history.push('/login')
    }
    toUserInfo = () => {
        this.props.history.push('/userInfo')
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
    sendToKindle = (bid) => {
        const url = `/book/${bid}/_push`;
        HTTP.post(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                message.success('发送成功！')
            } else {
                message.error(res.error)
            }
        })
    }
    handleNameChange = (e) => {
        const bookName = e.target.value;
        this.setState({
            bookName
        })
    }
    renameDialog = (item) => {

        const _this = this;
        const inputHtml = <div><Input allowClear defaultValue={item.title} placeholder="" onChange={(e) => { this.handleNameChange(e) }} /></div>;
        confirm({
            title: '名称修改',
            content: <div>{inputHtml}</div>,
            okText: '确认',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {

                _this.changeBookName(item);
            },
            onCancel() { }
        });
    }
    changeBookName = (item) => {
        const url = `/book/${item.id}/_info`;
        const bookName = this.state.bookName;
        HTTP.put(url, { title: bookName }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                message.success('修改成功！')
                this.changeMenu(this.state.activeItem)
            } else {
                message.error(res.error)
            }
        })
    }
    beforeUpload= (file) => {
        console.log('beforeUpload:',file)
        this.setState((state) => ({
          fileList: [...state.fileList, file],
        }));
        // return false;
      }
      handleChange = info => {
        debugger
        console.log(info)
        let fileList = [...info.fileList];

        // 1. Limit the number of uploaded files
        // Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2);

        // 2. Read from response and show file link
        fileList = fileList.map(file => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.url;
            }
            return file;
        });

        this.setState({ fileList });
    };
    readerBook=(bookInfo)=>{
        if(bookInfo.extension ==='epub'){
            sessionStorage.setItem('bookInfo',JSON.stringify(bookInfo));
            this.props.history.push('/reader')
        }

    }
    render() {
        const userInfo = this.state.userInfo;
        const role = this.state.role;
        let isLogin = false; let userName = ''; let photo = ''; let hasPhoto = false;
        if (userInfo) {
            if (userInfo.photo && userInfo.photo.length > 0) {
                photo = userInfo.photo;
                hasPhoto = true;
            } else {
                userName = userInfo.nick_name[0];
                isLogin = true;
            }
        }

        const columns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                width: '50%',
                render: (text, record) => {
                    const fileIcon = this.getFileIcon(record.extension);
                    let displayText = <div className="fileName">
                        <img className="fileIcon" src={fileIcon} alt="" />
                        <span style={{cursor:'pointer'}} onClick={()=>{this.readerBook(record)}} className={`${record.is_owner === 1 ? 'isOwerFile' : ''}`}>{text}</span>
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
                title: '文件类型',
                dataIndex: 'is_public',
                key: 'is_public',
                width: '20%',
                render: (text) => {
                    let val = text == 0 ? '私有' : '公开';
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
                            <p className="optItem" onClick={() => { this.fileShare("row", record.id) }}>分享</p>
                            <p className="optItem" onClick={() => { this.sendToKindle(record.id) }}>kindle</p>
                            <p className="optItem" onClick={() => { this.downloadEvent('single', record) }}>下载</p>
                            <p className="optItem">标签</p>
                            <p className="optItem" onClick={() => { this.renameDialog(record) }}>重命名</p>
                            <p className="optItem" onClick={() => { this.fileTypeChange('single', record) }}>文件类型</p>
                            <p className="optItem" onClick={() => { this.showDeleteConfirm('single', record) }}>删除</p>
                        </div>
                    );
                    const optHtml = <div className="optWarp">

                        <Popover placement="rightTop" content={optContent} trigger="focus">
                            <Button className="btn_more_opt"><Icon style={{ fontSize: '16px' }} type="ellipsis" /></Button>
                        </Popover>
                    </div>
                    return optHtml;
                }
            },
        ];
        const smallColumns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => {
                    const fileIcon = this.getFileIcon(record.extension);
                    let displayText = <div className="fileName">
                        <img className="fileIcon" src={fileIcon} alt="" />
                        <span style={{cursor:'pointer'}} onClick={()=>{this.readerBook(record)}} className={`${record.is_owner === 1 ? 'isOwerFile' : ''}`}>{text}</span>
                    </div>;
                    return displayText;
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                render: (text, record) => {
                    const optContent = (
                        <div>
                            <p className="optItem" onClick={() => { this.fileShare("row", record.id) }}>分享</p>
                            <p className="optItem" onClick={() => { this.sendToKindle(record.id) }}>kindle</p>
                            <p className="optItem" onClick={() => { this.downloadEvent('single', record) }}>下载</p>
                            <p className="optItem" >标签</p>
                            <p className="optItem">重命名</p>
                            <p className="optItem" onClick={() => { this.fileTypeChange('single', record) }}>文件类型</p>
                            <p className="optItem" onClick={() => { this.showDeleteConfirm('single', record) }}>删除</p>
                        </div>
                    );
                    const optHtml = <div className="optWarp">

                        <Popover placement="rightTop" content={optContent} trigger="focus">
                            <Button className="btn_more_opt"><Icon style={{ fontSize: '16px' }} type="ellipsis" /></Button>
                        </Popover>
                    </div>
                    return optHtml;
                }
            },
        ];
        const isAdminUser = false;
        const rowSelection = {
            columnWidth: '30px',
            onChange: this.handleRowChange,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys: this.state.tableSelectedRowKeys
        };
        const props = {
            showUploadList: false,
            name: 'book',
            action: '/book',
            beforeUpload: this.beforeUpload,
            onChange: this.handleChange,
            multiple: true,
            headers: { Authorization: cookie.get('Authorization') }
        };
        return (
            <div className="deskWarp">
                <Layout>
                    <Header className="publicHeader">
                        <div className="menuBtn showInBig"><Icon onClick={this.toggleCollapsed} type={this.state.collapsed ? 'menu' : 'arrow-left'} /></div>
                        <div className="menuBtn showInSmall"><Icon onClick={this.showDrawer} type="menu" /></div>
                        <div className="searchWarp"><Input allowClear placeholder="搜索" onClick={this.toResultPage} /> <span className="result"></span></div>
                        <div className="loginInfo" > {hasPhoto ? <img className="userPhoto" onClick={this.toUserInfo} src={photo} alt="" /> : (!isLogin ? <span onClick={this.toLogin}>注册</span> : <span className="userName" onClick={this.toUserInfo}>{userName}</span>)} </div>
                    </Header>

                    <Layout>
                        <Sider className="siderWarp" collapsed={this.state.collapsed}>
                            <Menu defaultSelectedKeys={[this.state.activeItem]} mode="inline" theme="light">
                                {this.getSider()}
                            </Menu>
                        </Sider>

                        <Layout>
                            <Content className="mainContent">
                                {this.state.showTable ?
                                    <div className="myTableWarp">
                                        <div className="clearFix">
                                            <div className="title ms_fl">全部文件</div>
                                            <div className={`${this.state.showCheckBox ? 'showBtnList' : ''} btn_list ms_fr`}>
                                                {/* {role===1?<Button className="btn btn_clone" type="primary" onClick={this.fileClone}>克隆</Button>:''} */}
                                                {role !== 2 ? <Button className="btn btn_share" type="primary" onClick={this.fileShare}>分享</Button> : ''}
                                                {role !== 2 ? <Button className="btn btn_download" onClick={this.fileClone}>标签</Button> : ""}
                                                {role !== 2 ? <Button className="btn btn_download" onClick={this.downloadEvent}>下载</Button> : ""}
                                                {role === 2 ? <Button className="btn btn_fileType" onClick={this.fileTypeChange.bind(this)}>类型</Button> : ""}
                                                {role === 2 ? <Button className="btn btn_del" type="danger" onClick={this.showDeleteConfirm}>删除</Button> : ""}
                                            </div>
                                        </div>
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInBig`} pagination={false} columns={columns} rowSelection={rowSelection} dataSource={this.state.tableData} />
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInSmall`} pagination={false} columns={smallColumns} rowSelection={rowSelection} dataSource={this.state.tableData} />
                                    </div>
                                    : ''}
                            </Content>
                        </Layout>

                    </Layout>

                </Layout>
                <Drawer title="" placement="left" closable={false} onClose={this.onClose} visible={this.state.visible} className="mySider">
                    <Menu defaultSelectedKeys={[this.state.activeItem]} mode="inline" theme="light">
                        {this.getSider("small")}
                    </Menu>
                </Drawer>
                <MyUpload />
                {/* <div className="myUpload">
                
                    <Upload {...props} >
                        <Button className="btn_upload" type="primary"><Icon type="plus" /> </Button>
                    </Upload>
                </div> */}
            </div>
        )
    }
}

export default DeskPage;