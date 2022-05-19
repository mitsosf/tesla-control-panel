import React from 'react';
import ReactDOM from 'react-dom';
import {LockFilled, UnlockFilled} from '@ant-design/icons';
import Media from "./Media";
import Climate from "./Climate";
import 'antd/dist/antd.css';
import {Col, Row} from "antd";
import Lock from "./Lock";

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
                <Row>
                    <h1>{this.state.car}</h1>
                </Row>
                <Row>
                    <Lock token={this.state.token}/>
                </Row>
                <Row>
                    <img src="img/model3.png" alt="tesla" style={{width:'35%'}}></img>
                </Row>
                <Row>
                    <Media token={this.state.token}/>
                </Row>
                <Row>
                    <Climate token={this.state.token}/>
                </Row>
            </div>
        );
    }
}

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard/>,
        document.getElementById('dashboard'))
    ;
}
