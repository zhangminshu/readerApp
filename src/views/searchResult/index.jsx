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
class SearchResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tableSelectedRowKeys: [],
            selectedRow: [],
            showCheckBox: false,
            pageNum: 1,
            pageSize: 10,
            showTable: false,
            tableData: [],
            fileType: 0,
            searchBookName: '',
            searchText: '',
            totalNum: 0,
            tagList: []
        }
    }
    componentDidMount() {
        this.getTotal();
        this.getCategory();
    }
    getCategory = () => {
        const url = '/category';
        HTTP.get(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                console.log(res.data)
                const newList = this.state.tagList.concat(res.data.list);
                console.log(newList)
                this.setState({
                    tagList: newList
                })
            } else {
                message.error(res.error);
            }
        })
    }
    getTotal = () => {
        const url = "/book/_total";
        HTTP.get(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                const searchText = `可搜索 ${res.data} 个文件`;
                this.setState({
                    searchText,
                    totalNum: res.data
                })
            }
        })
    }

    searchBook = (e, type) => {
        const bookName = type === 'search' ? e.target.value : e;
        const url = '/book/_search';
        const requestJson = {
            keyword: bookName,
            pn: this.state.pageNum,
            ps: this.state.pageSize
        }
        if (bookName === '') {
            const searchText = `可搜索 ${this.state.totalNum} 个文件`
            this.setState({ showTable: false, searchText })
        } else {
            HTTP.get(url, { params: requestJson }).then(response => {
                const res = response.data;
                if (res.status === 0) {
                    const searchText = `找到约 ${res.data.total} 条结果`
                    this.setState({
                        showTable: true,
                        searchText: searchText,
                        tableData: res.data.list,
                        searchBookName: bookName
                    })
                } else {
                    message.error(res.error)
                }


            })
        }
    }
    handleChange = (selectedRowKeys, selectedRows) => {
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
    toIndex = () => {
        this.props.history.push('/')
    }
    handleRadioChange = e => {
        this.setState({
            fileType: e.target.value,
        });
    };
    showDeleteConfirm = () => {
        const _this = this;
        const ids = [];
        this.state.selectedRow.forEach(item => {
            ids.push(item.id)
        })
        const bookIds = ids.join(',');
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
                this.searchBook(this.state.searchBookName, 'delete')
            } else {
                message.error(res.error)
            }
        })
    }
    showShareConfirm = () => {
        confirm({
            title: '分享文件',
            content: <div><Input className="shareUrl" /><p className="desc">把链接通过微信、QQ、微博等方式分享给好友</p></div>,
            okText: '复制',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    fileTypeChange = () => {
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
        const url = `/book/${bookId}/_info`;
        HTTP.put(url, { is_public: isPublic }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                const tableData = this.state.tableData;
                tableData.forEach(item => {
                    if (item.id === bookId) item.is_public = isPublic;
                })
                this.setState({
                    tableData
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
                {_this.state.tagList.map(item=>{
                    return <div key={item.id} className="checkItem clearFix"><Checkbox onChange={this.handleCheckBox}>{item.title}</Checkbox><i className="icon icon_edit ms_fr"></i></div>
                })}
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
    handleCheckBox(checkedValues) {
        console.log('checked = ', checkedValues);
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
    render() {

        const columns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => {
                    const fileIcon = this.getFileIcon(record.extension);
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
                render: (text) => {
                    let val = text.toFixed(2) + 'MB';
                    return val;
                }
            },
            {
                title: '上传时间',
                dataIndex: 'address',
                key: 'address',
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
                            <p className="optItem" onClick={() => { this.fileClone(record.id) }}>克隆</p>
                            <p className="optItem" onClick={() => { this.downloadEvent('single', record) }}>下载</p>
                            <p className="optItem">阅读</p>
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
        const smallColumns = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                render: (text, record) => {
                    const fileIcon = this.getFileIcon(record.extension);
                    let displayText = <div className="fileName">
                        <img className="fileIcon" src={fileIcon} alt="" />
                        <span className={`${record.is_owner === 1 ? 'isOwerFile' : ''} bookName`}>{text}</span>
                    </div>;
                    return displayText;
                }
            },
            {
                title: '操作',
                wdith:'90px',
                dataIndex: 'opt',
                key: 'opt',
                render: (text, record) => {
                    const optContent = (
                        <div>
                            <p className="optItem" onClick={() => { this.fileClone(record.id) }}>克隆</p>
                            <p className="optItem" onClick={() => { this.downloadEvent('single', record) }}>下载</p>
                            <p className="optItem" >阅读</p>
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
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
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
        const isAdminUser = false;
        const rowSelection = {
            onChange: this.handleChange,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys: this.state.tableSelectedRowKeys
        };
        const role = userInfo.role;
        return (
            <div className="deskWarp">
                <Layout>
                    <div className="publicHeader">
                        <div className="menuBtn"><Icon onClick={this.toIndex} type={'arrow-left'} /></div>
                        <div className="searchWarp"><Input allowClear placeholder="搜索" onChange={(value) => { this.searchBook(value, 'search') }} /> <span className="result">{this.state.searchText}</span></div>
                        <div className="loginInfo" > {hasPhoto ? <img className="userPhoto" onClick={this.toUserInfo} src={photo} alt="" /> : (!isLogin ? <span onClick={this.toLogin}>注册</span> : <span className="userName" onClick={this.toUserInfo}>{userName}</span>)} </div>
                    </div>

                    <Layout className="ant-layout-has-sider">
                        <Layout>
                            <Content className="mainContent">
                                {this.state.showTable ?
                                    <div className="myTableWarp">
                                        <div className="clearFix">
                                            <div className="title ms_fl">全部文件</div>
                                            <div className={`${this.state.showCheckBox ? 'showBtnList' : ''} btn_list ms_fr`}>
                                                {role !== 2 ? <Button className="btn btn_clone" type="primary" onClick={this.fileClone}>克隆</Button> : ""}
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
            </div>
        )
    }
}

export default SearchResult;