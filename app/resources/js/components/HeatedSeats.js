import React from 'react';
import { Slider } from 'antd';
import axios from "axios";

export default class HeatedSeats extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
            seat_heaters: this.props.seat_heaters,
        }
    }

    //TODO Remove
    componentDidMount() {
        axios.post('/api/climate', {}, {headers: {token: this.state.token}
        }).then((res) => {
            const data = res.data.msg
            this.setState({
                temps: data.temps,
                seat_heaters: data.seat_heaters,
                seat_climate_keeper: data.climate_keeper,
            })
        }).catch((errors) => {
            console.log(errors);
        });
    }

    //TODO make this more compact

    calculateValue = (level) => {
        if (level === 0) {
            return 0
        } else if (level === 1) {
            return 33
        } else if (level === 2) {
            return 66
        } else if (level === 3) {
            return 100
        } else {
            return 0
        }
    }

    //TODO Heated seats keep their value when the AC is turned off.
    //TODO Make sure 0ing requests are sent to the rest of the seats when switching AC on
    handleChange = (seat) => (value) => {
        let level
        if (value === 0) {
            level = 0
        } else if (value === 33) {
            level = 1
        } else if (value === 66) {
            level = 2
        } else if (value === 100) {
            level = 3
        } else {
            level = 0
        }

        axios.post('/api/climate/seat',
            {
                level,
                heater: seat,
            },
            {headers: {token: this.state.token}})
            .then(() => {
                // TODO toast
            })
    }

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

        return this.state.seat_heaters && (
            <>
                <h4>Driver</h4>
                <Slider marks={marks}
                        step={null}
                        defaultValue={this.calculateValue(this.state.seat_heaters.front_driver)}
                        onAfterChange={this.handleChange(0)}
                />
                <h4>Passenger</h4>
                <Slider marks={marks}
                        step={null}
                        defaultValue={this.calculateValue(this.state.seat_heaters.front_passenger)}
                        onAfterChange={this.handleChange(1)}
                />
                <h4>Left</h4>
                <Slider marks={marks}
                        step={null}
                        defaultValue={this.calculateValue(this.state.seat_heaters.back_driver)}
                        onAfterChange={this.handleChange(2)}
                />
                <h4>Middle</h4>
                <Slider marks={marks}
                        step={null}
                        defaultValue={this.calculateValue(this.state.seat_heaters.back_middle)}
                        onAfterChange={this.handleChange(4)}
                />
                <h4>Right</h4>
                <Slider marks={marks}
                        step={null}
                        defaultValue={this.calculateValue(this.state.seat_heaters.back_passenger)}
                        onAfterChange={this.handleChange(5)}
                />
            </>
        );
    }
}
