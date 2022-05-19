import React from 'react';
import {Button, Col, Row} from 'antd';
import {PlayCircleFilled, PauseCircleFilled, StepBackwardFilled, StepForwardFilled, MinusCircleFilled, SoundFilled, PlusCircleFilled} from '@ant-design/icons';
import axios from 'axios';

export default class Media extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
        }
    }

    moveBackwards = () => {
        //Request to previous track
        axios.post('/api/media/track', {step: -1}, {headers: {token: this.state.token}})
    }

    moveForwards = () => {
        axios.post('/api/media/track', {step: 1}, {headers: {token: this.state.token}})
        //Request to previous track
    }

    togglePlayPause = () => {
        axios.post('/api/media/togglePlayback', {}, {headers: {token: this.state.token}})
    }

    volumeDown = () => {
        axios.post('/api/media/volume', {step: -11}, {headers: {token: this.state.token}})
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
            <Row>
                <Col className=''>
                    <Button shape="round" icon={<StepBackwardFilled/>} size='default' onClick={this.moveBackwards}/>
                    <Button shape="round" icon={playPauseButton} size='default' onClick={this.togglePlayPause}/>
                    <Button shape="round" icon={<StepForwardFilled/>} size='default' onClick={this.moveForwards}/>
                </Col>
                <Col style={{marginLeft: '2%'}}>
                    <Button shape="round" icon={<MinusCircleFilled/>} size='default' onClick={this.volumeDown}/>
                    <SoundFilled/>
                    <Button shape="round" icon={<PlusCircleFilled/>} size='default' onClick={this.volumeUp}/>
                </Col>
                &nbsp;&nbsp;&nbsp;

            </Row>
        );
    }
}