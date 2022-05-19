import React from 'react';
import {PlayCircleFilled, PauseCircleFilled, StepBackwardFilled, StepForwardFilled, MinusCircleFilled, SoundFilled, PlusCircleFilled} from '@ant-design/icons';


export default class Media extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
        }
    }

    render() {
        return (
            <div>
                <h3>
                    <StepBackwardFilled className='media-controls'/>
                    <PlayCircleFilled className='media-controls'/>
                    <PauseCircleFilled className='media-controls'/>
                    <StepForwardFilled className='media-controls'/>
                    &nbsp;&nbsp;&nbsp;
                    <MinusCircleFilled className='media-controls'/>
                    <SoundFilled className='media-controls'/>
                    <PlusCircleFilled className='media-controls'/>
                </h3>
            </div>
        );
    }
}
