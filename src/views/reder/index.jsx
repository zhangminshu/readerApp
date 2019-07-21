import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import { ReactReader } from "./modules";
import { Button, Icon,Modal,Checkbox,Input,message,Popover,Spin } from 'antd';
import cookie from 'js-cookie';
import { Container, ReaderContainer, Bar, Logo, CloseButton, CloseIcon, FontSizeButton } from "./Components";
import HTTP from '../../httpServer/axiosConfig.js'
import copy from 'copy-to-clipboard';
const { confirm } = Modal;
const storage = global.localStorage || null;

const GlobalStyle = createGlobalStyle`
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
    line-height: 1.4;
    word-break: break-word;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-size: 1.8rem;
    background: #333;
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;
  }
`;

class RederPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAddTag: false,
      editTag: '',//编辑中的标签
      showTagDialog: false,
      categoryList:[],
      tagList:[],
      editTagInfo:{
          addTag:'',
          newTag:''
      },
      selectBookId:"",//需要修改标签文件id
      fullscreen: true,
      location:
        storage && storage.getItem("epub-location")
          ? storage.getItem("epub-location")
          : 2,
      largeText: false
    };
    this.rendition = null;
  }

  componentDidMount() {
    const Authorization = cookie.get('Authorization')
    // this.getUserInfo();
    if(Authorization){
        this.getCategory()
        this.joinTag()
    }
  }
  componentWillUnmount(){
    this.saveRead('leave');
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
      selectBookId: bookId,
      showTagDialog: true
    })
  }
  /**
   * 加入最近阅读
   */
  joinTag=()=>{
    const bookInfo = JSON.parse(sessionStorage.getItem('bookInfo'));
    const url = `/book/_shiftin`;
    const requestJson={book_ids:bookInfo.id.toString(),category_ids:"-2"}
    HTTP.post(url,requestJson).then(response=>{
        const res = response.data;
        if(res.status === 0){

        }else{
            console.log(res.error)
        }
    })
  }
  /**
* 保存文件标签
*/
  saveTagChange = () => {
    const bookid = this.state.selectBookId;
    const categoryList = this.state.categoryList;
    const categoryIds = [];
    categoryList.forEach(item => {
      if (item.isChecked) {
        categoryIds.push(item.id)
      }
    })
    const category_id = categoryIds.join(',');
    // if(category_id ==='')return message.error('标签不能为空！')
    let requestJson = {};
    if (category_id === '') {
      requestJson = { book_ids: bookid }
    } else {
      requestJson = { book_ids: bookid, category_ids: category_id }
    }
    const url = `/book/_shiftin`;
    HTTP.post(url, requestJson).then(response => {
      const res = response.data;
      if (res.status === 0) {
        this.setState({
          showTagDialog: false
        })
        message.success('克隆成功！')
      } else {
        message.error(res.error);
      }
    })

  }
  handleCheckBox(e, id) {
    const isChecked = e.target.checked;
    const newList = []
    this.state.categoryList.forEach(item => {
      if (item.id === id) {
        item.isChecked = isChecked
      }
      newList.push(item);
    })
    this.setState({
      categoryList: newList
    })
  }
  handleTagChange = (e, name) => {
    const value = e.target.value;
    const newTagInfo = this.state.editTagInfo;
    newTagInfo[name] = value;
    this.setState({
      editTagInfo: newTagInfo
    })
  }
  addNewTag = (type, id) => {
    if (type === 'create') {
      const title = this.state.editTagInfo.addTag;
      const url = '/category';
      if (title === '') return message.error('标签名称不能为空！');
      HTTP.post(url, { title: title }).then(response => {
        const res = response.data;
        const newTagInfo = this.state.editTagInfo;
        newTagInfo['addTag'] = '';
        if (res.status === 0) {
          this.setState({
            isAddTag: false,
            editTagInfo: newTagInfo
          })
          message.success('创建成功！')
          this.getCategory();
        }
      })
    } else {
      const url = `/category/${id}`;
      const title = this.state.editTagInfo.newTag;
      HTTP.put(url, { title: title }).then(response => {
        const res = response.data;
        const newTagInfo = this.state.editTagInfo;
        newTagInfo['newTag'] = '';
        if (res.status === 0) {
          this.setState({
            editTag: null,
            editTagInfo: newTagInfo
          })
          message.success('修改成功！')
          this.getCategory();
        }
      })
    }
  }
  delTag = (id) => {
    const url = `/category/${id}`;
    HTTP.delete(url, {}).then(response => {
      const res = response.data;
      if (res.status === 0) {
        this.getCategory();
        message.success('删除成功！')
      } else {
        message.error(res.error)
      }
    })
  }
  onLocationChanged = location => {
    
    const bookInfo = JSON.parse(sessionStorage.getItem('bookInfo'));
    this.setState(
      {
        location
      },
      () => {
        storage && storage.setItem("bookLocation"+bookInfo.id, location);
      }
    );
  };

  onToggleFontSize = () => {
    const nextState = !this.state.largeText;
    this.setState(
      {
        largeText: nextState
      },
      () => {
        this.rendition.themes.fontSize(nextState ? "140%" : "100%");
      }
    );
  };

  getRendition = rendition => {
    // Set inital font-size, and add a pointer to rendition for later updates
    const { largeText } = this.state;
    this.rendition = rendition;
    rendition.themes.fontSize(largeText ? "140%" : "100%");
  };
  saveRead=(type)=>{
    const bookInfo = JSON.parse(sessionStorage.getItem('bookInfo'));
    const currPer = sessionStorage.getItem('currPercent') *100;
    const url = `/book/${bookInfo.id}/_process`;
    HTTP.put(url,{process:currPer}).then(response=>{
      const res = response.data;
      if(res.status === 0){
        if(type !=='leave'){
          message.success('保存成功！') 
        }
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
  render() {
    const { fullscreen } = this.state;
    const bookInfo = JSON.parse(sessionStorage.getItem('bookInfo'));
    const locationPre = localStorage.getItem('bookLocation'+bookInfo.id)
    const bookUrl = "https://" + bookInfo.url.split("://")[1];
    const bookTitle = bookInfo.title;
    const location = locationPre || bookInfo.process/100 || 0;
    const optContent = (
      <div>
          <p className="optItem" onClick={() => { this.fileShare("row", bookInfo.id) }}>分享</p>
          <p className="optItem" onClick={() => { this.saveRead }}>保存进度</p>
          <p className="optItem" onClick={() => { window.open(bookInfo.url,"_self") }}>下载</p>
          <p className="optItem" onClick={() => { window.open("https://jinshuju.net/f/peZNo8","_blank")}}>用户反馈</p>
          {/* <p className="optItem" onClick={() => { window.open('https://jinshuju.net/f/1xfVB8',"_blank") }}>评价阅读链</p> */}
      </div>
  );
    return (
      <Container>
        <GlobalStyle />
        <ReaderContainer fullscreen={fullscreen}>
          {/* <Button onClick={() => { this.fileClone('single', bookInfo)}} style={{ position: "absolute", zIndex: "9", right: "100px", top: "10px" }} className="btn_clone" type="primary">克隆</Button> */}
          <Popover placement="bottomRight" content={optContent} trigger="focus">
            <Button className="btn_more" style={{position:"absolute",right: "50px","zIndex": "9",top: "10px",padding: "0px 10px",textAlign: "center"}}><Icon style={{ fontSize: '16px' }} type="ellipsis" /></Button>
          </Popover>
          <ReactReader
            url={bookUrl}
            locationChanged={this.onLocationChanged}
            title={bookTitle}
            location={location}
            getRendition={this.getRendition}
          />
          {/* <FontSizeButton onClick={this.onToggleFontSize}>
            Toggle font-size
          </FontSizeButton> */}
        </ReaderContainer>
        <Modal
          width="416px" title="" visible={this.state.showTagDialog} className="tagDialog" closable={false}
          cancelText="取消" okText="确定"
          onOk={this.saveTagChange} onCancel={() => { this.setState({ showTagDialog: false }) }}
        >
          <div className="title">修改标签</div>
          <div className="checkWarp">
            <div className={`${this.state.isAddTag ? 'tagAdding' : ''} checkItem clearFix`}>
              <i className="icon icon_add" title="新增" onClick={() => { this.setState({ isAddTag: true }) }}></i>
              <i className="icon icon_cancel" title="取消" onClick={() => { this.setState({ isAddTag: false }) }}></i>
              <span className="addText">创建新标签</span>
              {this.state.isAddTag ? <Input className="addTag tagInput" defaultValue="" onChange={(value) => { this.handleTagChange(value, 'addTag') }} placeholder="创建标签" /> : ""}
              <i className="icon icon_ok ms_fr" title="保存" onClick={() => { this.addNewTag('create') }}></i>
            </div>
            {this.state.tagList.map((item, index) => {
              return <div key={`complete${item.id}${index}`} className={`${this.state.editTag === item.id ? 'tagAdding' : ''} checkItem clearFix`}>
                <Checkbox className="checkItem" onChange={(value) => { this.handleCheckBox(value, item.id) }}>{item.title}</Checkbox>
                <i className="icon icon_del" title="删除" onClick={() => { this.delTag(item.id) }}></i>
                <Input className="addTag tagInput" onChange={(value) => { this.handleTagChange(value, 'newTag') }} placeholder="" defaultValue={item.title} />
                <i className="icon icon_edit ms_fr" onClick={() => { this.setState({ editTag: item.id }) }}></i>
                <i className="icon icon_ok ms_fr" title="保存" onClick={() => { this.addNewTag('edit', item.id) }}></i>
              </div>
            })}
          </div>
        </Modal>
      </Container>
    );
  }
}

export default RederPage;
