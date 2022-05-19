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
            <div className='media-controls'>
                <StepBackwardFilled/>
                <PlayCircleFilled/>
                <PauseCircleFilled/>
                <StepForwardFilled/>
                &nbsp;&nbsp;&nbsp;
                <MinusCircleFilled/>
                <SoundFilled/>
                <PlusCircleFilled/>
            </div>
        );
    }
}
