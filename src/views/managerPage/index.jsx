import React from 'react';
import { Layout, Table, Input, Icon, Button, message, Modal, Radio, Popover, Checkbox, Menu, Drawer,Upload,Spin } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import copy from 'copy-to-clipboard';
import cookie from 'js-cookie';
import EmptyComp from '../../componment/emptyPage/index.jsx'
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
            currBookUrl:'',
            showTipModal:false,
            showEmpty:false,
            userStatus:"",
            isLoading:false,
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
        this.activeMenu = '0'
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
        this.activeMenu = sessionStorage.getItem('activeMenu') || '0'
        this.changeMenu(navList[this.activeMenu])
    }
    componentWillUnmount(){
        
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
        const currUrl = urlList[this.activeMenu];
        const value = e.target.value
        this.searchBookOrFille(currUrl, value,'')
    }
    searchBookOrFille = (url, value,changeType) => {
        let requestJson = {}
        const {pageNum,pageSize} = this.state;
        if(changeType === 'menu'){
            requestJson = {
                pn: 1,
                ps: pageSize
            }
            this.setState({pageNum:1})
        }else{
            requestJson = {
                keyword: value,
                pn: pageNum,
                ps: pageSize
            }
        }


        HTTP.get(url, { params: requestJson }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                let isEmpty = false;
                // if(res.data.total === 0)isEmpty =true;
                if (url === '/user') {
                    this.setState({
                        result: res.data.total,
                        showEmpty:isEmpty,
                        userTableData: res.data.list,
                        searchBookName: value
                    })
                } else {
                    this.setState({
                        result: res.data.total,
                        showEmpty:isEmpty,
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
        const activeMenu = this.state.activeMenu;
        if(activeMenu === '1'){
            // this.props.history.push({pathname:'/searchResult?type=user'})
            location.href = '#/searchResult?type=user'
        }else{
            this.props.history.push('/searchResult')
        }
    }
    changeMenu = (item, type,changeType) => {
        
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
        this.activeMenu = item.key;
        sessionStorage.setItem('activeMenu',item.key)
        if (item.key === "0") {
            this.getUserStatis();
            this.getFileStatis();
        } else {
            this.setState({
                tableSelectedRowKeys: [],
                selectedRow: [],
                showCheckBox: false
            })
            this.searchBookOrFille(currUrl,undefined,changeType)
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
            menuList.push(<Menu.Item onClick={() => { this.changeMenu(item, type,'menu') }} key={item.key}> <span>{item.name}</span></Menu.Item>)
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
                this.changeMenu(navList[this.activeMenu])
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
    handleStatusChange =(e)=>{
        const userStatus =e.target.value;
        this.setState({userStatus})
    }
    userStatusChange = () => {
        let userIdArr = [];
        let defStatus = 2;
        this.state.selectedRow.forEach(item=>{
            userIdArr.push(item.id)
            if(item.status ===1 && defStatus ===2){
                defStatus = 1
            }
        });
        const userId = userIdArr.join(',')
        const _this = this;
        confirm({
            title: '修改账户状态',
            content: <div className="radioWarp"><RadioGroup defaultValue={defStatus} onChange={this.handleStatusChange} >
                <div className="radioItem"><Radio value={1}>激活</Radio></div>
                <div className="radioItem"><Radio value={2}>冻结</Radio></div>
            </RadioGroup></div>,
            okText: '确认',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {
                const userStatus = _this.state.userStatus || defStatus;
                const url = '/user'
                HTTP.put(url,{user_ids:userId,status:userStatus}).then(response=>{
                    const res = response.data;
                    if(res.status === 0){
                        _this.setState({userStatus:''})
                        _this.changeMenu(navList[_this.activeMenu])
                        message.success('修改成功！')
                    }else{
                        message.error(res.error)
                    }
                })
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
        this.setState({isLoading:false})
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
        this.setState({isLoading:true})
        const url = "/book/_package";
        HTTP.get(url, { params: { book_ids: ids } }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                this.fileDownload(res.data)
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
        const nameSplit = item.title.split('.');
        const bookType = nameSplit.pop();
        const bookName = nameSplit.join('.');
        const _this = this;
        const inputHtml = <div><Input allowClear defaultValue={bookName} placeholder="" onChange={(e) => { this.handleNameChange(e) }} /></div>;
        confirm({
            title: '名称修改',
            content: <div>{inputHtml}</div>,
            okText: '确认',
            className: 'confirmDialog',
            cancelText: '取消',
            onOk() {

                _this.changeBookName(item,bookType);
            },
            onCancel() { }
        });
    }
    changeBookName = (item,bookType) => {
        const url = `/book/${item.id}/_info`;
        let bookName = this.state.bookName + '.'+bookType;
        HTTP.put(url, { title: bookName }).then(response => {
            const res = response.data;
            if (res.status === 0) {
                message.success('修改成功！')
                this.changeMenu(navList[this.activeMenu])
            } else {
                message.error(res.error)
            }
        })
    }
    handleTipCheckBox=e=>{
        if(e.target.checked){
            sessionStorage.setItem("noMoreTip",'1')
        }else{
            sessionStorage.setItem("noMoreTip",'0')
        }
    }
    handleOkTip=()=>{
        const bookUrl = this.state.currBookUrl;
        this.setState({showTipModal:false},()=>{
            window.open(bookUrl, "_blank")
        })
    }
    readerBook=(bookInfo)=>{
        if (!bookInfo.url) return message.error('书本链接不存在！')
        const userAgent = navigator.userAgent;
        if (bookInfo.extension === 'pdf') {
            if (userAgent.indexOf("Chrome") > -1) {
                window.open(bookInfo.url, "_blank")
            } else {
                const noMoreTip = sessionStorage.getItem('noMoreTip')
                if(noMoreTip==='1'){
                    window.open(bookInfo.url, "_blank")
                }else{
                    this.setState({showTipModal:true,currBookUrl:bookInfo.url})
                }
            }

        } else {
            sessionStorage.setItem('bookInfo', JSON.stringify(bookInfo));
            location.href = '#/reader';
        }
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
          
        if (info.file.status === 'uploading') {
          this.setState({ loading: true });
          return;
        }
        if (info.file.status === 'done') {
            message.success('修改成功！')
            this.changeMenu(navList[this.activeMenu])
          // Get this url from response in real world.
        //   this.getBase64(info.file.originFileObj, imageUrl =>
        //     this.setState({
        //       imageUrl,
        //       loading: false,
        //     }),
        //   );
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
    customRequest =(option,item)=>{
        
        const formData = new FormData();
        formData.append('files[]',option.file);
        const url =`/user/${item.id}/_info`
        HTTP.put(url,{photo:formData}).then(response=>{
            console.log(response)
        })
    }
    getDialogContent = (oldVal, fileName) => {
        
        let currHtml = '';
        // if(fileName === 'status'){
        //     fileType = oldVal[fileName] == 1 ? 2 :1;   
        // }else{
        //     fileType = oldVal[fileName];
        // }
        let fileType = oldVal[fileName];
        const radioHtml = <div className="radioWarp"><RadioGroup defaultValue={fileType} onChange={(e) => { this.handleModify(e, fileName) }} >
            <div className="radioItem"><Radio value={1}>激活</Radio></div>
            <div className="radioItem"><Radio value={2}>冻结</Radio></div>
        </RadioGroup></div>;
        const inputHtml = <div><Input allowClear defaultValue={oldVal[fileName]} placeholder="" onChange={(e) => { this.handleModify(e, fileName) }} /></div>;
        const pwdHtml = <div className="radioWarp">
            {/* <div className="radioItem"><Input.Password className="loginInput" autoComplete="off" datasource={[]} type="password" placeholder="原密码" onChange={(e) => { this.handleModify(e, 'old_pwd') }} /></div> */}
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
            name: 'photo',
            action:`/user/${oldVal.id}/_info`,
            headers: {
                authorization: cookie.get('Authorization'),
                method:'put'
            },
            beforeUpload:this.beforeUpload,
            onChange:this.handleImgChange
          };
        const imgHtml = <Upload 
            className="avatar-uploader userImgUpload"
            showUploadList={false}
            beforeUpload={this.beforeUpload}
            customRequest={this.customRequest}
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
                this.changeMenu(navList[this.activeMenu])
                message.success('修改成功！')
            } else {
                if(fileName ==='email'){
                    message.error('已存在相同的邮箱')
                }else{
                    message.error(res.error)
                }
                
            }
        })
    }
    pageChange =(current, pageSize)=>{
        this.setState({
            pageNum:current
        },()=>{
            this.changeMenu(navList[this.activeMenu])
        });
    }
    render() {
        const currPagination =this.state.result>10?{
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
                const props = {
                    name: 'photo',
                    action:`/user/${record.id}/_info`,
                    headers: {
                        authorization: cookie.get('Authorization'),
                        method:'put'
                    },
                    beforeUpload:this.beforeUpload,
                    onChange:this.handleImgChange
                  };
                const optContent = (
                    <div>
                        {/* onClick={() => { this.edit(record, 'photo', '修改头像') }} */}
                        <div className="optItem">
                        <Upload {...props}  className="avatar-uploader userImgUpload"
                            showUploadList={false}
                        >
                            修改头像
                        </Upload>
                        </div> 
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
                    const fileSplit = text.split('.');
                    const fileType = fileSplit[fileSplit.length-1];
                    switch (fileType) {
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
                        <span style={{cursor:'pointer'}} onClick={()=>{this.readerBook(record)}} className={`${record.is_owner === 1 ? 'isOwerFile' : ''}`}>{text}</span>
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
                            <p className="optItem" onClick={() => { this.fileShare("row", record.id) }}>分享</p>
                            <p className="optItem" onClick={() => { this.downloadEvent('single', record) }}>下载</p>
                            <p className="optItem" onClick={() => { this.renameDialog(record) }}>重命名</p>
                            <p className="optItem" onClick={() => { this.fileTypeChange('single', record) }}>文件类型</p>
                            <p className="optItem" style={{color:'#FF3B30'}} onClick={() => { this.showDeleteConfirm('single', record) }}>删除</p>
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
        // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const cookUserInfo = cookie.get('userInfo') || null
        const userInfo = JSON.parse(cookUserInfo)
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
        this.activeMenu = sessionStorage.getItem('activeMenu') || '0'
        // const currRowSelection = this.state.activeMenu ==='0'?null:rowSelection;
        return (
            <Spin tip="正在下载请稍等" spinning={this.state.isLoading}>
            <div className="managerWarp">
                <Layout>
                    <Header className="publicHeader">
                        <div className="menuBtn showInBig"><Icon onClick={this.toggleCollapsed} type={this.state.collapsed ? 'menu' : 'arrow-left'} /></div>
                        <div className="menuBtn showInSmall"><Icon onClick={this.showDrawer} type="menu" /></div>
                        <div className="searchWarp"><Input allowClear placeholder="搜索" onClick={this.toResultPage} /> <span className="result"></span></div>
                        <div className="loginInfo" > {hasPhoto ? <img className="userPhoto" onClick={this.toUserInfo} src={photo} alt="" /> : (!isLogin ? <span onClick={this.toLogin}>登录</span> : <span className="userName" onClick={this.toUserInfo}>{userName}</span>)} </div>
                    </Header>

                    <Layout>
                        <Sider className="siderWarp" collapsed={this.state.collapsed}>
                            {/* <SiderMenu></SiderMenu> */}
                            <Menu defaultSelectedKeys={[this.activeMenu]} mode="inline" theme="light">
                                {this.getSider()}
                            </Menu>
                        </Sider>

                        <Layout>
                            <Content className="mainContent">
                            {!this.state.showEmpty?
                                <div className={`${this.activeMenu === '0' ? 'grayTh' : ''} myTableWarp`}>
                                    <div className="clearFix">
                                        <div className="title ms_fl" style={{ fontSize: '20px', color: '#1B2733' }}>{this.state.tableName}</div>
                                        <div className={`${this.state.showCheckBox ? 'showBtnList' : ''} btn_list ms_fr`}>
                                            {/* {this.state.activeMenu === '1' ? <Button className="btn btn_fileType" type="primary" onClick={this.setFileSize.bind(this)}>存储</Button> : ""} */}
                                            {this.state.activeMenu === '1'?<Button className="btn btn_fileType" onClick={this.userStatusChange.bind(this)}>状态</Button>:""}
                                            {this.activeMenu === '2' ? <Button className="btn btn_fileType" type="primary" onClick={this.fileTypeChange.bind(this)}>类型</Button> : ""}
                                            {this.activeMenu === '2' ? <Button className="btn btn_del" type="danger" onClick={this.showDeleteConfirm}>删除</Button> : ""}
                                        </div>
                                    </div>
                                    {this.activeMenu === '0' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} `} pagination={false} columns={statisticsCol} dataSource={this.state.statisticsData} /> : ""}
                                    {this.activeMenu === '1' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInBig`} pagination={currPagination} columns={userCol} rowSelection={rowSelection} dataSource={this.state.userTableData} /> : ""}
                                    {this.activeMenu === '2' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInBig`} pagination={currPagination} columns={fileCol} rowSelection={rowSelection} dataSource={this.state.fileTableData} /> : ""}

                                    {this.activeMenu === '1' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInSmall`} pagination={currSmallPagination} columns={smallUserCol} rowSelection={rowSelection} dataSource={this.state.userTableData} /> : ""}
                                    {this.activeMenu === '2' ? <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInSmall`} pagination={currSmallPagination} columns={smallFileCol} rowSelection={rowSelection} dataSource={this.state.fileTableData} /> : ""}
                                </div>
                                :""}
                                {this.state.showEmpty? <EmptyComp /> :''}
                            </Content>
                        </Layout>

                    </Layout>

                </Layout>
                <Drawer title="" placement="left" closable={false} onClose={this.onClose} visible={this.state.visible} className="mySider">
                    <Menu defaultSelectedKeys={[this.activeMenu]} mode="inline" theme="light">
                        {this.getSider("small")}
                    </Menu>
                </Drawer>
                <Modal
                    width="416px" title="阅读提示" visible={this.state.showTipModal} className="tipDialog" closable={false}
                    footer={null}
                >
                    <div className="tipContent">当前的浏览器可能无法阅读PDF文件，建议<br />使用谷歌浏览器</div>
                    <div className="footer">
                        <Checkbox className="tipCheck" onChange={(value)=>{this.handleTipCheckBox(value)}}>不再提示</Checkbox>
                        
                        <Button type="primary" className="ms_fr" onClick={this.handleOkTip}>确认</Button>
                        <Button type="default" className="ms_fr" style={{marginRight:"14px"}} onClick={()=>{this.setState({showTipModal:false})}}>取消</Button>
                    </div>
                </Modal>
            </div>
            </Spin>
        )
    }
}

export default ManagerPage;