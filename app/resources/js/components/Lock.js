import React from 'react';
import {Button, Col} from 'antd';
import axios from 'axios';
import {LockFilled, SignalFilled, ThunderboltFilled, UnlockFilled} from "@ant-design/icons";

export default class Lock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
        }
    }

    wakeUp = () => {
        axios.post('/api/wakeup', {}, {headers: {token: this.state.token}})
    }

    lock = () => {
        axios.post('/api/lock', {}, {headers: {token: this.state.token}})
    }

    unlock = () => {
        axios.post('/api/unlock', {}, {headers: {token: this.state.token}})
    }

    start = () => {
        axios.post('/api/start', {}, {headers: {token: this.state.token}})
    }

    render() {
        return (
            <>
                <Col><h3><Button shape="round" icon={<SignalFilled/>} size='default' onClick={this.wakeUp}/></h3></Col>
                <Col><h3><Button shape="round" icon={<LockFilled/>} size='default' onClick={this.lock}/></h3></Col>
                <Col><h3><Button shape="round" icon={<UnlockFilled/>} size='default' onClick={this.unlock}/></h3></Col>
                <Col><h3><Button shape="round" icon={<ThunderboltFilled/>} size='default' onClick={this.start}/></h3></Col>
            </>
        );
    }
}
