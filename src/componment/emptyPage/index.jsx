import React from 'react';
import { Icon, Button } from 'antd';
import './style.less';
import emptyBg from '../../img/emptyBg.svg'
class EmptyPage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      
    }
  }
  findBook =()=>{
      window.open('https://jinshuju.net/f/0Dggwt')
  }
  handleClick =()=>{
      window.open('https://jinshuju.net/f/peZNo8')
  }
  evaluate =()=>{
    window.open('https://jinshuju.net/f/1xfVB8')
  }
  render() {
      const type = this.props.type;
    return (
      <div className="emptyWarp">
        <img className="emptyBg" src={emptyBg} alt=""/>
        <div className="text ms-tc">什么也没有</div>
        {type!=='desk'?<div className="desc ms-tc">大概躲猫猫了，稍后再试试吧</div>:""}
        {type==='desk'?<div className="desc ms-tc">点击右下角的“+”可以上传文件</div>:""}
        {type!=='desk'?<div><Button className="btn_fb" type="primary" onClick={this.findBook}>书籍代找</Button></div>:""}
        {/* {type==='desk'?<div><Button className="btn_fb" type="primary" onClick={this.evaluate}>评价阅读链</Button></div>:""} */}
        <div><Button className="btn_q" type="default" onClick={this.handleClick}>问题反馈</Button></div>
      </div>
    )
  }
}

export default EmptyPage;