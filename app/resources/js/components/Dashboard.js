import React from 'react';
import ReactDOM from 'react-dom';
import Media from "./Media";
import Climate from "./Climate";
import 'antd/dist/antd.css';
import {Row} from "antd";
import Lock from "./Lock";
import HeatedSeats from "./HeatedSeats";
import axios from "axios";

export default class Dashboard extends React.Component {
    constructor() {
        super();

        const element = document.getElementById('dashboard');
        const props = Object.assign({}, element.dataset);

        this.state = {
            token: props.token,
            car: props.car,
            url: props.url,
            temps: null,
            seat_heaters: null,
            climate_keeper: null,
        }
    }

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

    render() {
        return (
            <div>
                <Row>
                    <h1>{this.state.car}</h1>
                </Row>
                <Row>
                    <Lock token={this.state.token}/>
                </Row>
                <Row>
                    <img src="img/model3.png" alt="tesla" style={{width:'35%'}}></img>
                </Row>
                <Row>
                    <Media token={this.state.token}/>
                </Row>
                <Row>
                    <Climate token={this.state.token} temps={this.state.temps}/>
                </Row>
                <HeatedSeats token={this.state.token}/>
            </div>
        );
    }
}

if (document.getElementById('dashboard')) {
    ReactDOM.render(<Dashboard/>,
        document.getElementById('dashboard'))
    ;
}
