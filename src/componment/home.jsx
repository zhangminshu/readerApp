import React from 'react';
import {Button} from 'antd'
import imgBg from '../img/user3.jpg'
class App extends React.Component {

  render() {
    return (
        <div className="homeWarp">
            <h1 >hello react </h1>
            <img src={imgBg} alt=""/>
            <Button>button</Button>
        </div>
      
    )
  }
}

export default App;