import React from 'react';
import ReactDOM from 'react-dom';
import {Tabs} from "antd";

export default class Dashboard extends React.Component {
    constructor() {
        super();

        const element = document.getElementById('dashboard');
        const props = Object.assign({}, element.dataset);

        this.state = {
            token: props.token,
            url: props.url,
        }
    }

    render() {
        return (
            <h1>This is Dashboard.js and this is the user's token {this.state.token}
            </h1>
        );
    }
}

if (document.getElementById('dashboard')) {
    console.log('dashboard')
    ReactDOM.render(<Dashboard/>,
        document.getElementById('dashboard'))
    ;
}
