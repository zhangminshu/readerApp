import React from 'react';
import { Layout, Menu, Table, Input, Icon, Button, message, Modal, Radio, Popover, Checkbox,Spin, Drawer } from 'antd';
import HTTP from '../../httpServer/axiosConfig.js'
import './style.less'
import cookie from 'js-cookie';
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
            currBookUrl:'',
            showTipModal:false,
            isLoading:false,
            isAddTag:false,
            editTag:'',//编辑中的标签
            showTagDialog:false,
            categoryList:[],
            tagList:[],
            editTagInfo:{
                addTag:'',
                newTag:''
            },
            selectBookId:"",//需要修改标签文件id
            tableSelectedRowKeys: [],
            selectedRow: [],
            showCheckBox: false,
            visible: false,
            role:1,
            showTable:false,
            tableData:[],
            navList: []
        }
    }
    componentDidMount() {
        document.title = '阅读链 - 分享'
        this.getShareBookList()
        const Authorization = cookie.get('Authorization')
        // this.getUserInfo();
        if(Authorization){
            this.getCategory()
        }
        
    }
    getCategory = () => {
        const url = '/category';
        HTTP.get(url, {}).then(response => {
            const res = response.data;
            if (res.status === 0) {
                res.data.list.map(item=>{
                    item.key = item.id;
                })
                const tagList =[];
                const newTagList = tagList.concat(res.data.list);
                this.setState({
                    categoryList:res.data.list,
                    tagList:newTagList.reverse()
                })
            }
        })
    }
    getShareBookList=()=>{
        const shareParams = location.href.split("?")[1];
        if(!shareParams) return localStorage.setItem('shareIds','');
        const ids = shareParams.split("=")[1];
        localStorage.setItem('shareIds',ids);
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
                localStorage.setItem('userInfo',JSON.stringify(res.data));
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
        const unAllowOnline = ['txt','mobi','azw3']
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

        }else if(unAllowOnline.includes(bookInfo.extension)){
            return message.error('txt、mobi、azw3格式不支持在线查看，请下载后查看')
        } else {
            sessionStorage.setItem('bookInfo', JSON.stringify(bookInfo));
            location.href = '#/reader';
        }
    }
    fileClone = (type, item) => {
        const userInfo = localStorage.getItem('userInfo');
        if(!userInfo){
            this.unLoginTip();
            return;
        }
        localStorage.setItem('shareIds','')
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
        const category_id = categoryIds.join(',');
        // if(category_id ==='')return message.error('标签不能为空！')
        let requestJson ={};
        if(category_id === ''){
            requestJson={book_ids:bookid,is_public:'0'}
        }else{
            requestJson={book_ids:bookid,category_ids:category_id,is_public:'0'}
        }
        const url = `/book/_save`;
        HTTP.post(url,requestJson).then(response=>{
            const res = response.data;
            if(res.status === 0){
                this.setState({
                    showTagDialog:false
                })
                message.success('克隆成功！')
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
    unLoginTip=()=>{
        const _this = this;
        confirm({
            title: '请登录',
            content: "登录后可使用该功能",
            okText: '登录',
            className:'confirmDialog',
            cancelText: '取消',
            onOk() {
                _this.props.history.push('/login?from=sharePage')
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
        const Authorization = cookie.get('Authorization')
        if(Authorization){
            this.props.history.push('/desk')
        }else{
            this.props.history.push('/')
        }
    }
    toUserInfo =()=>{
        this.props.history.push('/userInfo')
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
        const userInfo = localStorage.getItem('userInfo');
        if(!userInfo){
            this.unLoginTip();
            return;
        }
        localStorage.setItem('shareIds','')
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
                          <p className="optItem" onClick={() => { this.fileClone('single', record)}}>克隆</p>
                          <p className="optItem" onClick={() => { this.downloadEvent('single', record) }}>下载</p>
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
                            <span style={{cursor:'pointer'}} onClick={()=>{this.readerBook(record)}} className={`${record.is_owner === 1 ? 'isOwerFile':''}`}>{text}</span>
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
                          <p className="optItem" onClick={() => { this.fileClone('single', record)}}>克隆</p>
                          <p className="optItem" onClick={() => { this.downloadEvent('single', record) }}>下载</p>
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
        console.log(this.state.tagList)
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
                                            <div className="title ms_fl">全部文件</div>
                                            <div className={`${this.state.showCheckBox ? 'showBtnList' : ''} btn_list ms_fr`}>
                                                <Button className="btn btn_clone" type="primary" onClick={this.fileClone}>克隆</Button>
                                                <Button className="btn btn_download" onClick={this.downloadEvent}>下载</Button>
                                            </div>
                                        </div>
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInBig`} pagination={false} columns={columns} rowSelection={rowSelection} dataSource={this.state.tableData} />
                                        <Table rowKey={(record, index) => `complete${record.id}${index}`} className={`${this.state.showCheckBox ? 'showCheckBox' : ''} showInSmall`} pagination={false} columns={smallColumns} rowSelection={rowSelection} dataSource={this.state.tableData} />
                                    </div>
                                    {/* : ''} */}
                            </Content>
                        </Layout>
                </Layout>
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
                            {this.state.isAddTag ?<Input className="addTag tagInput" defaultValue="" onChange={(value)=>{this.handleTagChange(value,'addTag')}} placeholder="创建标签" />:""}
                            <i className="icon icon_ok ms_fr" title="保存" onClick={()=>{this.addNewTag('create')}}></i>
                        </div>
                        {this.state.tagList.map((item,index) => {
                            return <div key={`complete${item.id}${index}`} className={`${this.state.editTag === item.id ? 'tagAdding' :''} checkItem clearFix`}>
                                <Checkbox className="checkItem" onChange={(value)=>{this.handleCheckBox(value,item.id)}}><span className="tagText">{item.title}</span></Checkbox>
                                <i className="icon icon_del" title="删除" onClick={() => { this.delTag(item.id) }}></i>
                                <Input className="addTag tagInput" onChange={(value)=>{this.handleTagChange(value,'newTag')}} placeholder="" defaultValue={item.title} />
                                <i className="icon icon_edit ms_fr" onClick={()=>{this.setState({editTag:item.id})}}></i>
                                <i className="icon icon_ok ms_fr" title="保存" onClick={()=>{this.addNewTag('edit',item.id)}}></i>
                                </div>
                        })}
                    </div>
                </Modal>
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

export default SharePage;