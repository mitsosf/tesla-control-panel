import React from 'react';
import { Slider } from 'antd';

export default class HeatedSeats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
        }
    }

    // lock = () => {
    //     axios.post('/api/lock', {}, {headers: {token: this.state.token}})
    // }
    //
    // unlock = () => {
    //     axios.post('/api/unlock', {}, {headers: {token: this.state.token}})
    // }



    render() {
        const marks = {
            0: {
                style: {
                    color: '#f50',
                },
                label: <strong>Off</strong>,
            },
            33: '1',
            66: '2',
            100: {
                style: {
                    color: '#f50',
                },
                label: <strong>100°C</strong>,
            },
        };

        return (
            <>
                <h4>Driver</h4>
                <Slider marks={marks} step={null} defaultValue={0} />
                <h4>Passenger</h4>
                <Slider marks={marks} step={null} defaultValue={0} />
                <h4>Left</h4>
                <Slider marks={marks} step={null} defaultValue={0} />
                <h4>Middle</h4>
                <Slider marks={marks} step={null} defaultValue={0} />
                <h4>Right</h4>
                <Slider marks={marks} step={null} defaultValue={0} />
            </>
        );
    }
}
