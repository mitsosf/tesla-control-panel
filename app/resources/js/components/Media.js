import React from 'react';
import ReactDOM from 'react-dom';
import {PlayCircleFilled, PauseCircleFilled, StepBackwardFilled, StepForwardFilled, MinusCircleFilled, SoundFilled, PlusCircleFilled} from '@ant-design/icons';


export default class Media extends React.Component {
    constructor() {
        super();

        const element = document.getElementById('media');
        const props = Object.assign({}, element.dataset);

        this.state = {
            token: props.token,
        }
    }

    render() {
        return (
            <div>
                <h3>
                    <StepBackwardFilled style={{padding:'5px'}}/>
                    <PlayCircleFilled style={{padding:'5px'}}/>
                    <PauseCircleFilled style={{padding:'5px'}}/>
                    <StepForwardFilled style={{padding:'5px'}}/>
                    &nbsp;&nbsp;&nbsp;
                    <MinusCircleFilled style={{padding:'5px'}}/>
                    <SoundFilled style={{padding:'5px'}}/>
                    <PlusCircleFilled style={{padding:'5px'}}/>
                </h3>
            </div>
        );
    }
}

if (document.getElementById('media')) {
    ReactDOM.render(<Media/>,
        document.getElementById('media'))
    ;
}
