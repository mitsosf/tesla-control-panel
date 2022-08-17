import React from 'react';
import {Button, Col, notification, Row} from 'antd';
import axios from 'axios';
import {LockFilled, SignalFilled, ThunderboltFilled, UnlockFilled} from "@ant-design/icons";

export default class Lock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
        }
    }

    openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: type === 'success' ? 'Success!' : 'Oops!',
            description: message,
            placement: 'bottomRight'
        });
    };

    wakeUp = () => {
        axios.post('/api/wakeup', {}, {headers: {token: this.state.token}}).then((res) => {
            if (res.status === 200) {
                this.openNotificationWithIcon('success', `Wakeup sent. Wait up to 30".`)
            } else {
                this.openNotificationWithIcon('error', res.data)
            }
        }).catch((error) => {
            this.openNotificationWithIcon('error', error.response.data)
        });
    }

    lock = () => {
        axios.post('/api/lock', {}, {headers: {token: this.state.token}}).then((res) => {
            if (res.status === 200) {
                this.openNotificationWithIcon('success', `Lock sent.`)
            } else {
                this.openNotificationWithIcon('error', res.data)
            }
        }).catch((error) => {
            this.openNotificationWithIcon('error', error.response.data)
        });
    }

    unlock = () => {
        axios.post('/api/unlock', {}, {headers: {token: this.state.token}}).then((res) => {
            if (res.status === 200) {
                this.openNotificationWithIcon('success', `Unlock sent.`)
            } else {
                this.openNotificationWithIcon('error', res.data)
            }
        }).catch((error) => {
            this.openNotificationWithIcon('error', error.response.data)
        });
    }

    start = () => {
        axios.post('/api/start', {}, {headers: {token: this.state.token}}).then((res) => {
            if (res.status === 200) {
                this.openNotificationWithIcon('success', `Car started. Valid for 120".`)
            } else {
                this.openNotificationWithIcon('error', res.data)
            }
        }).catch((error) => {
            this.openNotificationWithIcon('error', error.response.data)
        });
    }

    render() {
        return (
            <>
                <Row>
                    <h3>Locks:</h3>
                </Row>
                <Row>
                    <Col><Button shape="round" icon={<SignalFilled/>} size='large' onClick={this.wakeUp}/></Col>
                    <Col><Button shape="round" icon={<LockFilled/>} size='large' onClick={this.lock}/></Col>
                    <Col><Button shape="round" icon={<UnlockFilled/>} size='large' onClick={this.unlock}/></Col>
                    <Col><Button shape="round" icon={<ThunderboltFilled/>} size='large' onClick={this.start}/></Col>
                </Row>
                </>
        );
    }
}
