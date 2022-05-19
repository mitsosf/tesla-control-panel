import React from 'react';
import ReactDOM from 'react-dom';
import {LockFilled, UnlockFilled} from '@ant-design/icons';
import Media from "./Media";
import Climate from "./Climate";

export default class Dashboard extends React.Component {
    constructor() {
        super();

        const element = document.getElementById('dashboard');
        const props = Object.assign({}, element.dataset);

        this.state = {
            token: props.token,
            car: props.car,
            url: props.url,
        }
    }

    render() {
        return (
            <div>
                <h1>{this.state.car}</h1><h3><LockFilled/><UnlockFilled/></h3>
                <div>
                    <img src="img/model3.png" alt="tesla" style={{width:'35%'}}></img>
                </div>
                <Media token={this.state.token}/>
                <br></br>
                <Climate token={this.state.token}/>
            </div>
        );
    }
}

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard/>,
        document.getElementById('dashboard'))
    ;
}
