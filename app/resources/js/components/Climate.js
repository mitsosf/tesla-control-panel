import React from 'react';
import {LeftOutlined, RightOutlined, PoweroffOutlined} from '@ant-design/icons';
import {Button, Col, notification, Row} from "antd";
import axios from "axios";


export default class Climate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
            temps: this.props.temps,
            seat_heaters: null,
            climate_keeper: null,
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

    openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: type === 'success' ? 'Success!' : 'Oops!',
            description: message,
            placement: 'bottomRight'
        });
    };

    minTempReached = () => {
        return this.state.temps.driver <= this.state.temps.min
    }

    maxTempReached = () => {
        return this.state.temps.driver >= this.state.temps.max
    }

    decreaseTemp = () => {
        if (this.minTempReached())
            return

        const newTemp = Math.ceil(this.state.temps.driver) - 1
        axios.post('/api/climate/temperature',
            {
                driver: newTemp,
                passenger: newTemp,
            },
            {headers: {token: this.state.token}})
            .then(() => {
                let temps = {...this.state.temps};
                temps.driver = newTemp
                temps.passenger = newTemp
                this.setState({temps})
                this.openNotificationWithIcon('success', `Temperature decreased.`)
            }).catch((error)=>{
                this.openNotificationWithIcon('error', error.response.data)
            }
        )
    }
    //TODO unify handler
    increaseTemp = () => {
        if (this.maxTempReached())
            return

        const newTemp = Math.floor(this.state.temps.driver) + 1

        axios.post('/api/climate/temperature',
            {
                driver: newTemp,
                passenger: newTemp,
            },
            {headers: {token: this.state.token}})
            .then(() => {
                let temps = {...this.state.temps};
                temps.driver = newTemp
                temps.passenger = newTemp
                this.setState({temps})
                this.openNotificationWithIcon('success', `Temperature increased.`)
            }).catch((error)=>{
                this.openNotificationWithIcon('error', error.response.data)
            }
        )
    }

    turnClimateOff = () => {
        axios.post('/api/climate/off', {}, {headers: {token: this.state.token}}).then((res) => {
            if (res.status === 200) {
                this.openNotificationWithIcon('success', `Climate OFF sent.`)
            } else {
                this.openNotificationWithIcon('error', res.data)
            }
        }).catch((error) => {
            this.openNotificationWithIcon('error', error.response.data)
        });
    }

    // fireColorCalculator = (seat) => {
    //     switch (this.state[seat]) {
    //         case 0:
    //             return '000000'
    //         case 1:
    //             return 'FFCE54'
    //         case 2:
    //             return 'FC6E51'
    //         case 3:
    //             return 'D8334A'
    //     }
    // }

    render() {
        return this.state.temps && (
            <div style={{'marginTop': '3%'}}>
                <h3>Climate:</h3>
                    <Row>
                        <Col><Button shape="round" icon={<LeftOutlined className='climate-arrows'/>} size='large' onClick={this.decreaseTemp} disabled={this.minTempReached()}/></Col>
                        <Col><span style={{fontSize: '85px'}}>{this.state.temps.driver}&#176;</span></Col>
                        <Col><Button shape="round" icon={<RightOutlined className='climate-arrows'/>} size='large' onClick={this.increaseTemp} disabled={this.maxTempReached()}/></Col>
                        <Col><Button shape="round" icon={<PoweroffOutlined className='climate-arrows'/>} size='large' onClick={this.turnClimateOff}/></Col>
                        <Col></Col>
                    </Row>
                    {/*<Row>*/}
                    {/*    <FireFilled className='climate-fire' style={{color: '000000'}}/>*/}
                    {/*    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*/}
                    {/*    <FireFilled className='climate-fire' style={{color: 'D8334A'}}/>*/}
                    {/*</Row>*/}
                    {/*<Row>*/}
                    {/*    <FireFilled className='climate-fire' style={{color: 'FC6E51'}}/>*/}
                    {/*    <FireFilled style={{padding: '4px'}}/>*/}
                    {/*    <FireFilled className='climate-fire' style={{color: 'FFCE54'}}/>*/}
                    {/*</Row>*/}
            </div>
        );
    }
}
