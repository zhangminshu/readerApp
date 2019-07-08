import React from 'react';
import { Layout, Table, Input, Icon, Button, message, Modal, Radio, Popover, Checkbox, Menu, Drawer,Upload } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import cookie from 'js-cookie';
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
    name: '用户管理',
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
            collapsed: true,
            loading:false,
            tableSelectedRowKeys: [],
            selectedRow: [],
            showCheckBox: false,
            pageNum: 1,
            pageSize: 10,
            fileSize: '5000',
            result: 0,
            userTableData: [],
            fileTableData: [],
            statisticsData: [],
            fileType: 0,
            searchBookName: '',
            tableName: '统计概览',
            activeMenu: '0',
            visible: false,
            newUserInfo: {
                email: '',
                nick_name: "",
                new_pwd: '',
                status: '',
                kindle_email: '',
                old_pwd: '',
                new_pwd: ''
            }
        }
        this.statisticsList = [{
            name: '用户',
            num: 0,
            id: 's0'
        }, {
            name: '文件',
            num: 0,
            id: 's1'
        }]
    }
    componentDidMount() {
        this.changeMenu(navList[0])
    }
    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    toLogin = () => {
        this.props.history.push('/login')
    }
    toUserInfo = () => {
        this.props.history.push('/userInfo')
    }
    handleSearchChange = (e) => {
        const urlList = ["/book", "/user", "/file"];
        const currUrl = urlList[this.state.activeMenu];
        const value = e.target.value
        this.searchBookOrFille(currUrl, value)
    }
    searchBookOrFille = (url, value) => {
        const requestJson = {
            keyword: value,
            pn: this.state.pageNum,
            ps: this.state.pageSize
        }
        HTTP.get(url, { params: requestJson }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                if (url === '/user') {
                    this.setState({
                        result: res.data.total,
                        userTableData: res.data.list,
                        searchBookName: value
                    })
                } else {
                    this.setState({
                        result: res.data.total,
                        fileTableData: res.data.list,
                        searchBookName: value
                    })
                }

            } else {
                message.error(res.error)
            }
        })
    }
    toResultPage = () => {
        this.props.history.push('/searchResult')
    }
    changeMenu = (item, type) => {
        const urlList = ["/book", "/user", "/file"];
        const currUrl = urlList[item.key];

        if (type === "small") {
            this.setState({
                activeMenu: item.key,
                tableName: item.name,
                visible: false
            })
        } else {
            this.setState({
                activeMenu: item.key,
                tableName: item.name
            })
        }
        if (item.key === "0") {
            this.getUserStatis();
            this.getFileStatis();
        } else {
            this.setState({
                tableSelectedRowKeys: [],
                selectedRow: [],
                showCheckBox: false
            })
            this.searchBookOrFille(currUrl)
        }

    }
    getUserStatis = () => {
        const url = '/user/_statistics';
        HTTP.get(url, { params: {} }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.statisticsList[0].num = res.data;
                this.setState({ statisticsData: this.statisticsList })
            } else {
                message.error(res.error)
            }
        })
    }
    getFileStatis = () => {
        const url = '/file/_statistics';
        HTTP.get(url, { params: {} }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.statisticsList[1].num = res.data;
                this.setState({ statisticsData: this.statisticsList })
            } else {
                message.error(res.error)
            }
        })
    }
    getSider = (type) => {
        const menuList = [];
        navList.map(item => {
            menuList.push(<Menu.Item onClick={() => { this.changeMenu(item, type) }} key={item.key}> <span>{item.name}</span></Menu.Item>)
        })
        return menuList;
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
    handleRadioChange = e => {
        this.setState({
            fileType: e.target.value,
        });
    };
    fileSizeChange = e => {
        this.setState({
            fileSize: e.target.value,
        });
    };
    setFileSize = (fileName) => {

        const _this = this;
        const inputHtml = <div><Input allowClear defaultValue={"5000"} placeholder="" onChange={(e) => { this.fileSizeChange(e) }} /></div>;
        confirm({
            title: "修改存储空间",
            content: <div>{inputHtml}</div>,
            okText: '确认',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {

                // _this.updateUserInfo(fileName);
            },
            onCancel() { }
        });
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
                this.changeMenu(navList[this.state.activeMenu])
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
    userStatusChange = () => {
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
    handleCheckBox(checkedValues) {
        console.log('checked = ', checkedValues);
    }
    getBase64 =(img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      }
      
     beforeUpload=(file)=> {

        const isJPG = file.type === 'image/jpeg'|| file.type === 'image/png';
        if (!isJPG) {
          message.error('图片仅支持jpg、png格式!');
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          message.error('图片大小不能超过10MB!');
        }
        return isJPG && isLt10M;
      }
      handleImgChange = info => {
          debugger
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
          // Get this url from response in real world.
          this.getBase64(info.file.originFileObj, imageUrl =>
            this.setState({
              imageUrl,
              loading: false,
            }),
          );
        }
      };
    edit = (item, fileName, title) => {
        this.setDialog(item, fileName, title);
    }
    handleModify = (e, fileName) => {
        const newUserInfo = this.state.newUserInfo;
        newUserInfo[fileName] = e.target.value;
        this.setState({
            newUserInfo
        });
    };
    getDialogContent = (oldVal, fileName) => {
        let currHtml = '';
        const fileType = oldVal[fileName];
        const radioHtml = <div className="radioWarp"><RadioGroup defaultValue={fileType} onChange={(e) => { this.handleModify(e, fileName) }} >
            <div className="radioItem"><Radio value={1}>激活</Radio></div>
            <div className="radioItem"><Radio value={2}>冻结</Radio></div>
        </RadioGroup></div>;
        const inputHtml = <div><Input allowClear defaultValue={oldVal[fileName]} placeholder="" onChange={(e) => { this.handleModify(e, fileName) }} /></div>;
        const pwdHtml = <div className="radioWarp">
            <div className="radioItem"><Input.Password className="loginInput" autoComplete="off" datasource={[]} type="password" placeholder="原密码" onChange={(e) => { this.handleModify(e, 'old_pwd') }} /></div>
            <div className="radioItem"><Input.Password className="loginInput" autoComplete="off" datasource={[]} type="password" placeholder="新密码" onChange={(e) => { this.handleModify(e, 'new_pwd') }} /></div>
        </div>;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const imageUrl = oldVal[fileName];
        const props = {
            name: 'file',
            action:'/user/_photo',
            headers: {
                authorization: cookie.get('Authorization')
            },
            beforeUpload:this.beforeUpload,
            onChange:this.handleImgChange
          };
        const imgHtml = <Upload
            name="photo"
            listType="picture-card"
            className="avatar-uploader userImgUpload"
            showUploadList={false}
            action={`/user/_photo?access_token=${cookie.get('Authorization')}`}
            beforeUpload={this.beforeUpload}
            onChange={this.handleImgChange}
        >
            {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
        </Upload>
        switch (fileName) {
            case 'status':
                currHtml = radioHtml;
                break;
            case 'changePWD':
                currHtml = pwdHtml;
                break;
            case 'photo':
                currHtml = imgHtml;
                break;
            default:
                currHtml = inputHtml
        }
        return currHtml;
    }
    setDialog = (oldVal, fileName, title) => {

        const _this = this;
        const contentHtml = this.getDialogContent(oldVal, fileName)
        confirm({
            title: title,
            content: <div>{contentHtml}</div>,
            okText: '确认',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {

                _this.updateUserInfo(oldVal['id'],fileName);
            },
            onCancel() { }
        });
    }
    updateUserInfo = (id,fileName) => {
        const { newUserInfo, userInfo } = this.state;
        const requestData = {};
        let url = '';
        if (fileName === 'changePWD') {
            // requestData['old_pwd'] = newUserInfo['old_pwd'];
            requestData['new_pwd'] = newUserInfo['new_pwd'];
            url = `/user/${id}/_info`
        } else {
            requestData[fileName] = newUserInfo[fileName];
            url = `/user/${id}/_info`
        }
        HTTP.put(url, requestData).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.changeMenu(navList[this.state.activeMenu])
                message.success('修改成功！')
            } else {
                message.error(res.error)
            }
        })
    }
    render() {
        const statisticsCol = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            align: 'left'
        }, {
            title: '数值',
            dataIndex: 'num',
            key: 'num',
            align: 'right'
        }]
        const userCol = [{
            title: '用户名',
            dataIndex: 'nick_name',
            key: 'nick_name',
            render: (text, record) => {
                return (<div className="tableUserName">{!record.photo ? <span className="name">{text.substr(0, 1)}</span> : <img className="name" src={record.photo} />} {text}</div>)
            }
        }, {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email'
        }, {
            title: '注册日期',
            dataIndex: 'add_time',
            key: 'add_time',
            render: (text, record) => {
                return text.substr(0, 10);
            }
        }, {
            title: '存储空间',
            dataIndex: 'storage_used',
            key: 'storage_used',
            render: (text, record) => {
                return (text + 'MB / ' + record.storage_limit + 'MB')
            }
        }, {
            title: '账户状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, record) => {
                return <span className={`${record.status === 1 ? 'isActive' : 'unActive'}`}>{text === 1 ? '激活' : '冻结'}</span>
            }
        }, {
            title: '操作',
            dataIndex: 'opt',
            key: 'opt',
            render: (text, record) => {
                const optContent = (
                    <div>
                        {/* onClick={() => { this.edit(record, 'photo', '修改头像') }} */}
                        <p className="optItem" onClick={() => { this.edit(record, 'photo', '修改头像') }}>修改头像</p> 
                        <p className="optItem" onClick={() => { this.edit(record, 'nick_name', '修改用户名') }}>修改用户名</p>
                        <p className="optItem" onClick={() => { this.edit(record, 'email', '修改邮箱') }}>修改邮箱</p>
                        <p className="optItem" onClick={() => { this.edit(record, 'changePWD', '修改密码') }}>修改密码</p>
                        <p className="optItem" onClick={() => { this.edit(record, 'status', '修改账户状态') }}>账户状态</p>
                        <p className="optItem" onClick={() => { this.edit(record, 'storage_limit', '修改存储空间') }}>存储空间</p>
                    </div>
                );
                const optHtml = <div className="optWarp">

                    <Popover placement="rightTop" content={optContent} trigger="focus">
                        <Button className="btn_more_opt"><Icon style={{ fontSize: '16px' }} type="ellipsis" /></Button>
                    </Popover>
                </div>
                return optHtml;
            }
        }]
        const fileCol = [
            {
                title: '名称',
                dataIndex: 'title',
                key: 'title',
                // width: '50%',
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
                // width: '20%',
                render: (text) => {
                    let val = text.toFixed(2) + 'MB';
                    return val;
                }
            },
            {
                title: '类型',
                dataIndex: 'is_public',
                key: 'is_public',
                // width: '20%',
                render: (text) => {
                    return text == 1 ? '公开' : '私有'
                }
            },
            {
                title: '操作',
                dataIndex: 'opt',
                key: 'opt',
                render: (text, record) => {
                    const optContent = (
                        <div>
                            <p className="optItem" >分享</p>
                            <p className="optItem">发送至kindle</p>
                            <p className="optItem">下载</p>
                            <p className="optItem">修改标签</p>
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
            }
        ];
        const smallFileCol = [];
        const smallUserCol = [];
        smallFileCol.push(fileCol[0]);
        smallFileCol.push(fileCol[3]);
        smallUserCol.push(userCol[0]);
        smallUserCol.push(userCol[5]);
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
            columnWidth: '30px',
            onChange: this.handleChange,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys: this.state.tableSelectedRowKeys
        };
        // const currRowSelection = this.state.activeMenu ==='0'?null:rowSelection;
        return (
            <div className="managerWarp">
                <Layout>
                    <Header className="publicHeader">
                        <div className="menuBtn showInBig"><Icon onClick={this.toggleCollapsed} type={this.state.collapsed ? 'menu' : 'arrow-left'} /></div>
                        <div className="menuBtn showInSmall"><Icon onClick={this.showDrawer} type="menu" /></div>
                        <div className="searchWarp"><Input allowClear placeholder="搜索" onClick={this.toResultPage} /> <span className="result"></span></div>
                        <div className="loginInfo" > {hasPhoto ? <img className="userPhoto" onClick={this.toUserInfo} src={photo} alt="" /> : (!isLogin ? <span onClick={this.toLogin}>注册</span> : <span className="userName" onClick={this.toUserInfo}>{userName}</span>)} </div>
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
                                <div className={`${this.state.activeMenu === '0' ? 'grayTh' : ''} myTableWarp`}>
                                    <div className="clearFix">
                                        <div className="title ms_fl" style={{ fontSize: '20px', color: '#1B2733' }}>{this.state.tableName}</div>
                                        <div className={`${this.state.showCheckBox ? 'showBtnList' : ''} btn_list ms_fr`}>
                                            {/* {this.state.activeMenu === '1' ? <Button className="btn btn_fileType" type="primary" onClick={this.setFileSize.bind(this)}>存储</Button> : ""} */}
                                            {/* {this.state.activeMenu === '1'?<Button className="btn btn_fileType" onClick={this.userStatusChange.bind(this)}>状态</Button>:""} */}
                                            {this.state.activeMenu === '2' ? <Button className="btn btn_fileType" type="primary" onClick={this.fileTypeChange.bind(this)}>类型</Button> : ""}
                                            {this.state.activeMenu === '2' ? <Button className="btn btn_del" type="danger" onClick={this.showDeleteConfirm}>删除</Button> : ""}
                                        </div>
                                    </div>
                                    {this.state.activeMenu === '0' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} `} pagination={false} columns={statisticsCol} dataSource={this.state.statisticsData} /> : ""}
                                    {this.state.activeMenu === '1' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInBig`} pagination={false} columns={userCol} rowSelection={rowSelection} dataSource={this.state.userTableData} /> : ""}
                                    {this.state.activeMenu === '2' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInBig`} pagination={false} columns={fileCol} rowSelection={rowSelection} dataSource={this.state.fileTableData} /> : ""}

                                    {this.state.activeMenu === '1' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInSmall`} pagination={false} columns={smallUserCol} rowSelection={rowSelection} dataSource={this.state.userTableData} /> : ""}
                                    {this.state.activeMenu === '2' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInSmall`} pagination={false} columns={smallFileCol} rowSelection={rowSelection} dataSource={this.state.fileTableData} /> : ""}
                                </div>
                            </Content>
                        </Layout>

                    </Layout>

                </Layout>
                <Drawer title="" placement="left" closable={false} onClose={this.onClose} visible={this.state.visible} className="mySider">
                    <Menu defaultSelectedKeys={[this.state.activeMenu]} mode="inline" theme="light">
                        {this.getSider("small")}
                    </Menu>
                </Drawer>
            </div>
        )
    }
}

export default ManagerPage;