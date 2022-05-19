import React from 'react';
import {Button, Col, Row} from 'antd';
import axios from 'axios';
import {LockFilled, StepBackwardFilled, UnlockFilled} from "@ant-design/icons";

export default class Lock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
        }
    }

    lock = () => {
        //Request to previous track
        axios.post('/api/lock', {}, {headers: {token: this.state.token}})
    }

    unlock = () => {
        axios.post('/api/unlock', {}, {headers: {token: this.state.token}})
        //Request to previous track
    }

    render() {
        return (
            <>
                <Col><h3><Button shape="round" icon={<LockFilled/>} size='default' onClick={this.lock}/></h3></Col>
                <Col><h3><Button shape="round" icon={<UnlockFilled/>} size='default' onClick={this.unlock}/></h3></Col>
            </>
        );
    }
}
