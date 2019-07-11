import React from 'react';
import { Layout, Menu, Table, Input, Icon, Button, message, Modal, Radio, Popover, Checkbox, Drawer,Spin, Upload } from 'antd';
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
            isLoading:false,
            isAddTag:false,
            editTag:'',//编辑中的标签
            showTagDialog:false,
            selectBookId:"",//需要修改标签文件id
            tableSelectedRowKeys: [],
            categoryList:[],
            selectedRow: [],
            showCheckBox: false,
            collapsed:true,
            fileList: [],
            visible: false,
            role: 1,
            bookName: '',
            activeItem: '',
            showTable: false,
            tableData: [],
            tagList:[],
            editTagInfo:{
                addTag:'',
                newTag:''
            },
            navList: [{
                id: "",
                title: '全部书籍',
                remark: '',
                key:'all'
            },{
                id: "-2",
                title: '最近阅读',
                remark: '',
                key:'-2'
            },{
                id: "-1",
                title: '未分类',
                remark: '',
                key:'-1'
            }]
        }
        this.deskActiveMenu =''
    }
    componentDidMount() {    
        this.deskActiveMenu = sessionStorage.getItem('deskActiveMenu') || 'all';
        const currId = this.deskActiveMenu === 'all'?'':this.deskActiveMenu;
        this.getUserInfo();
        this.getCategory();
        this.getBookListById(currId)
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
                res.data.list.map(item=>{
                    item.key = item.id;
                })
                const tagList =[];
                const navList= [{
                    id: "",
                    title: '全部书籍',
                    remark: '',
                    key:'all'
                },{
                    id: "-2",
                    title: '最近阅读',
                    remark: '',
                    key:'-2'
                },{
                    id: "-1",
                    title: '未分类',
                    remark: '',
                    key:'-1'
                }]
                const newList = navList.concat(res.data.list);
                const newTagList = tagList.concat(res.data.list);
                this.setState({
                    categoryList:res.data.list,
                    navList: newList,
                    tagList:newTagList
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
            menuList.push(<Menu.Item onClick={() => { this.changeMenu(item.id, type) }} key={item.key}> <span>{item.title}</span></Menu.Item>)
        })
        return menuList;
    }
    getBookListById = (id) => {
        if(id==='all'){
            id = '';
        }
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
        this.deskActiveMenu = id.toString() || 'all';
        sessionStorage.setItem('deskActiveMenu',this.deskActiveMenu);

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
                this.changeMenu(this.deskActiveMenu)
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
    /**
     * 标签修改
     */
    fileClone = (type, item) => {
        const ids = [];
        let bookId = "";
        if (type === 'single') {
            bookId = item.id.toString();
        } else {
            this.state.selectedRow.forEach(item => {
                ids.push(item.id);
            })
            bookId = ids.join(',')
        }
        this.setState({
            selectBookId:bookId,
            showTagDialog:true
        })
    }
    /**
     * 保存文件标签
     */
    saveTagChange =()=>{
        const bookid = this.state.selectBookId;
        const categoryList = this.state.categoryList;
        const categoryIds =[];
        categoryList.forEach(item=>{
            if(item.isChecked){
                categoryIds.push(item.id)
            }
        })
        const category_id = categoryIds.join(',')
        if(category_id ==='')return message.error('标签不能为空！')
        const url = `/category/${category_id}/_shiftin`;
        HTTP.post(url,{book_ids:bookid}).then(response=>{
            const res = response.data;
            if(res.status === 0){
                this.setState({
                    showTagDialog:false
                })
                message.success('修改成功！')
            }else{
                message.error(res.error);
            }
        })

    }
    handleCheckBox(e,id) {
        const isChecked = e.target.checked;
        const newList =[]
        this.state.categoryList.forEach(item=>{
            if(item.id === id){
                item.isChecked = isChecked
            }
            newList.push(item);
        })
        this.setState({
            categoryList:newList
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
    sendToKindle = (bid,isOverLimit) => {
        if(isOverLimit) return message.info('请选择10M以内的文件');
        const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
        if(userInfo){
            const kindle_email = userInfo.kindle_email;
            if(!kindle_email)return message.info('请到设置页面添加您的kindle邮箱')
        }else{
            return message.info('请到设置页面添加您的kindle邮箱')
        }

        const url = `/book/${bid}/_push`;
        HTTP.post(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                message.success('推送成功！')
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
                this.changeMenu(this.deskActiveMenu)
            } else {
                message.error(res.error)
            }
        })
    }
    readerBook=(bookInfo)=>{
        if(bookInfo.extension ==='pdf'){
            window.open(bookInfo.url,"_blank")
        }else{
            sessionStorage.setItem('bookInfo',JSON.stringify(bookInfo));
            this.props.history.push('/reader')
        }

    }
    handleTagChange=(e,name)=>{
        const value = e.target.value;
        const newTagInfo = this.state.editTagInfo;
        newTagInfo[name] = value;
        this.setState({
            editTagInfo:newTagInfo
        })
    }
    addNewTag=(type,id)=>{
        if(type === 'create'){
            const title = this.state.editTagInfo.addTag;
            const url = '/category';
            if(title==='')return message.error('标签名称不能为空！');
            HTTP.post(url,{title:title}).then(response=>{
                const res = response.data;
                const newTagInfo = this.state.editTagInfo;
                newTagInfo['addTag'] = '';
                if(res.status === 0){
                    this.setState({
                        isAddTag:false,
                        editTagInfo:newTagInfo
                    })
                    message.success('创建成功！')
                    this.getCategory();
                }
            })
        }else{
            const url =`/category/${id}`;
            const title = this.state.editTagInfo.newTag;
            HTTP.put(url,{title:title}).then(response=>{
                const res = response.data;
                const newTagInfo = this.state.editTagInfo;
                newTagInfo['newTag'] = '';
                if(res.status === 0){
                    this.setState({
                        editTag:null,
                        editTagInfo:newTagInfo
                    })
                    message.success('修改成功！')
                    this.getCategory();
                }
            })
        }
    }
    delTag=(id)=>{
        const url = `/category/${id}`;
        HTTP.delete(url,{}).then(response=>{
            const res = response.data;
            if(res.status === 0){
                this.getCategory();
                message.success('删除成功！')
            }else{
                message.error(res.error)
            }
        })
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
                    const isOver10M = record.size > 10;
                    const optContent = (
                        <div>
                            <p className="optItem" onClick={() => { this.fileShare("row", record.id) }}>分享</p>
                            <p className={`${isOver10M ? 'overLimit':''} optItem`} onClick={() => { this.sendToKindle(record.id,isOver10M) }}>kindle</p>
                            <p className="optItem" onClick={() => { this.downloadEvent('single', record) }}>下载</p>
                            <p className="optItem" onClick={() => { this.fileClone('single', record)}}>标签</p>
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
                    const isOver10M = record.size > 10;
                    const optContent = (
                        <div>
                            <p className="optItem" onClick={() => { this.fileShare("row", record.id) }}>分享</p>
                            <p className={`${isOver10M ? 'overLimit':''} optItem`} onClick={() => { this.sendToKindle(record.id,isOver10M) }}>kindle</p>
                            <p className="optItem" onClick={() => { this.downloadEvent('single', record) }}>下载</p>
                            <p className="optItem" onClick={() => { this.fileClone('single', record)}}>标签</p>
                            <p className="optItem" onClick={() => { this.renameDialog(record) }}>重命名</p>
                            <p className="optItem" onClick={() => { this.fileTypeChange('single', record) }}>文件类型</p>
                            <p className="optItem" onClick={() => { this.showDeleteConfirm('single', record) }}>删除</p>
                        </div>
                    );
                    const optHtml = <div className="optWarp">

                        <Popover placement="rightTop" content={optContent} trigger="click">
                            <Button className="btn_more_opt"><Icon style={{ fontSize: '16px' }} type="ellipsis" /></Button>
                        </Popover>
                    </div>
                    return optHtml;
                }
            },
        ];
        const rowSelection = {
            columnWidth: '30px',
            onChange: this.handleRowChange,
            onSelect: this.handleSelect,
            onSelectAll: this.handleSelectAll,
            selectedRowKeys: this.state.tableSelectedRowKeys
        };
        this.deskActiveMenu = sessionStorage.getItem('deskActiveMenu') || 'all'
        
        return (
            <Spin tip="正在下载请稍等" spinning={this.state.isLoading}>
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
                            <Menu defaultSelectedKeys={[this.deskActiveMenu]} mode="inline" theme="light">
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
                    <Menu defaultSelectedKeys={[this.deskActiveMenu]} mode="inline" theme="light">
                        {this.getSider("small")}
                    </Menu>
                </Drawer>
                <MyUpload />

                <Modal
                    width="416px" title="" visible={this.state.showTagDialog} className="tagDialog" closable={false}
                    cancelText="取消" okText="确定"
                    onOk={this.saveTagChange} onCancel={()=>{this.setState({showTagDialog:false})}}
                >
                    <div className="title">修改标签</div>
                    <div className="checkWarp">
                        <div className={`${this.state.isAddTag ? 'tagAdding':''} checkItem clearFix`}>
                            <i className="icon icon_add" title="新增" onClick={() => { this.setState({ isAddTag: true }) }}></i> 
                            <i className="icon icon_cancel" title="取消" onClick={() => { this.setState({ isAddTag: false }) }}></i>
                            <span className="addText">创建新标签</span>
                            <Input className="addTag tagInput" defaultValue="" onChange={(value)=>{this.handleTagChange(value,'addTag')}} placeholder="创建标签" />
                            <i className="icon icon_ok ms_fr" title="保存" onClick={()=>{this.addNewTag('create')}}></i>
                        </div>
                        {this.state.tagList.map((item,index) => {
                            return <div key={`complete${item.id}${index}`} className={`${this.state.editTag === item.id ? 'tagAdding' :''} checkItem clearFix`}>
                                <Checkbox className="checkItem" onChange={(value)=>{this.handleCheckBox(value,item.id)}}>{item.title}</Checkbox>
                                <i className="icon icon_del" title="删除" onClick={() => { this.delTag(item.id) }}></i>
                                <Input className="addTag tagInput" onChange={(value)=>{this.handleTagChange(value,'newTag')}} placeholder="" defaultValue={item.title} />
                                <i className="icon icon_edit ms_fr" onClick={()=>{this.setState({editTag:item.id})}}></i>
                                <i className="icon icon_ok ms_fr" title="保存" onClick={()=>{this.addNewTag('edit',item.id)}}></i>
                                </div>
                        })}
                    </div>
                </Modal>
            </div>
            </Spin>
        )
    }
}

export default DeskPage;