import React from 'react';
import {LeftOutlined, RightOutlined, FireFilled} from '@ant-design/icons';


export default class Climate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: this.props.token,
        }
    }

    render() {
        return (
            <div>
                <h2>Climate</h2>
                <h3>
                    <LeftOutlined style={{fontSize:'20px', padding:'5px'}}/>
                    <span style={{fontSize:'30px'}}>19.5&#176;</span>
                    <RightOutlined style={{fontSize:'20px', padding:'5px'}}/>
                    <br></br>
                    <FireFilled style={{padding:'10px'}}/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <FireFilled style={{padding:'10px', color:'D8334A'}}/>
                    <br></br>
                    <FireFilled style={{padding:'10px', color:'FC6E51'}}/>
                    <FireFilled style={{padding:'4px'}}/>
                    <FireFilled style={{padding:'10px', color:'FFCE54'}}/>
                </h3>
            </div>
        );
    }
}
