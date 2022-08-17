import React from 'react';
import {Button, Col, notification, Row} from 'antd';
import {PlayCircleFilled, PauseCircleFilled, StepBackwardFilled, StepForwardFilled, MinusCircleFilled, SoundFilled, PlusCircleFilled} from '@ant-design/icons';
import axios from 'axios';

export default class Media extends React.Component {
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

    moveBackwards = () => {
        //Request to previous track
        axios.post('/api/media/track', {step: -1}, {headers: {token: this.state.token}})
            .then((res) => {
                if (res.status === 200) {
                    this.openNotificationWithIcon('success', `Move backwards sent.`)
                } else {
                    this.openNotificationWithIcon('error', res.data)
                }
            }).catch((error) => {
            this.openNotificationWithIcon('error', error.response.data)
        });
    }

    moveForwards = () => {
        axios.post('/api/media/track', {step: 1}, {headers: {token: this.state.token}}).then((res) => {
            if (res.status === 200) {
                this.openNotificationWithIcon('success', `Move forwards sent.`)
            } else {
                this.openNotificationWithIcon('error', res.data)
            }
        }).catch((error) => {
            this.openNotificationWithIcon('error', error.response.data)
        });
        //Request to previous track
    }

    togglePlayPause = () => {
        axios.post('/api/media/togglePlayback', {}, {headers: {token: this.state.token}}).then((res) => {
            if (res.status === 200) {
                this.openNotificationWithIcon('success', `Play/pause sent.`)
            } else {
                this.openNotificationWithIcon('error', res.data)
            }
        }).catch((error) => {
            this.openNotificationWithIcon('error', error.response.data)
        });

    }

    volumeDown = () => {
        axios.post('/api/media/volume', {step: -1}, {headers: {token: this.state.token}})
        //Request to previous track
    }

    volumeUp = () => {
        //Request to previous track
        axios.post('/api/media/volume', {step: 1}, {headers: {token: this.state.token}})
    }


    render() {
        const playPauseButton = (
            <Row>
                <Col><PlayCircleFilled/></Col>
                <Col><PauseCircleFilled/></Col>
            </Row>
        )

        let test = () => {
            alert('test')
        }

        return (
            <>
                <Row>
                    <h3>Music:</h3>
                </Row><br/>
                <Row>
                    <Button shape="round" icon={<StepBackwardFilled/>} size='large' onClick={this.moveBackwards}/>
                    <Button shape="round" icon={playPauseButton} size='large' onClick={this.togglePlayPause}/>
                    <Button shape="round" icon={<StepForwardFilled/>} size='large' onClick={this.moveForwards}/>
                </Row>
                <Row style={{marginTop: '3%', marginLeft: '20%'}}>
                    <Button shape="round" icon={<MinusCircleFilled/>} size='large' onClick={this.volumeDown}/>
                    <div style={{marginTop: '7%'}}><SoundFilled style={{'fontSize': '80px'}}/></div>
                    <Button shape="round" icon={<PlusCircleFilled/>} size='large' onClick={this.volumeUp}/>
                </Row>
            </>
        );
    }
}
