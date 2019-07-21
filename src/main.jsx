import React from 'react';
import ReactDOM from 'react-dom';
import Home from './views/homePage/index.jsx';
import Login from './views/loginPage/index.jsx';
import SearchResult from './views/searchResult/index.jsx';
import DeskPage from './views/deskPage/index.jsx';
import ManagerPage from './views/managerPage/index.jsx';
import SharePage from './views/share/index.jsx'
import Reader from './views/reder/index.jsx'
import UserInfo from './views/userInfo/index.jsx';
import UserAgreement from './views/userAgreement/index.jsx'
import Statement from './views/statement/index.jsx'
import ServerAgreement from './views/serverAgreement/index.jsx'
import UploadBook from './views/uploadBook/index.jsx'
import {  Modal,message } from 'antd';
import './css/main.less'
import { HashRouter, Route, hashHistory, Switch } from 'react-router-dom';
const { confirm } = Modal;
const userAgent = navigator.userAgent;
//判断是否IE浏览器
const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion < 10) {
        
        confirm({
          title: '提示',
          content: <div>浏览器不兼容，建议使用谷歌浏览器</div>,
          okText: '确认',
          className: 'confirmDialog',
          cancelText: '取消',
          onOk() {
              
          },
          onCancel() { }
      });
    }
}


const SliderComponent = () => (
    <Switch>
      <Route exact path='/' component={Home} />
      <Route path="/login" component={Login}/>
      <Route path="/desk" component={DeskPage}/>
      <Route path="/manager" component={ManagerPage}/>
      <Route path="/share" component={SharePage}/>
      <Route path="/reader" component={Reader}/>
      <Route path="/userInfo" component={UserInfo}/>
      <Route path="/searchResult" component={SearchResult}/>
      <Route path="/userAgreement" component={UserAgreement}/>
      <Route path="/statement" component={Statement}/>
      <Route path="/serverAgreement" component={ServerAgreement}/>
      <Route path="/uploadBook" component={UploadBook}/>
    </Switch>
  )
  ReactDOM.render((
    <HashRouter history={hashHistory}>
      <SliderComponent />
    </HashRouter>
  ), document.getElementById('root'));