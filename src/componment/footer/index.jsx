import React from 'react';

class MyFooter extends React.Component {
  constructor(props){
    super(props);
    this.state={
      
    }
  }
  render() {
    return (
      <div className="footerWarp ms-tc" style={{height: "40px",lineHeight: "40px",background: "#F3F5F7"}}>
        <span><a style={{fontSize:"16px",color:'#637282'}} href="http://www.beian.miit.gov.cn/" target="_blank">渝ICP备18017390号-2</a></span>
      </div>
    )
  }
}

export default MyFooter;