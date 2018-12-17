import ReactDOM from 'react-dom';
import React ,{Component} from 'react';

class App extends Component {
    render (){
        return <div>Hello React</div>
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
)