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
                    <LeftOutlined className='climate-arrows'/>
                    <span style={{fontSize:'30px'}}>19.5&#176;</span>
                    <RightOutlined className='climate-arrows'/>
                    <br></br>
                    <FireFilled className='climate-fire'/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <FireFilled className='climate-fire' style={{color:'D8334A'}}/>
                    <br></br>
                    <FireFilled className='climate-fire' style={{color:'FC6E51'}}/>
                    <FireFilled style={{padding:'4px'}}/>
                    <FireFilled className='climate-fire' style={{color:'FFCE54'}}/>
                </h3>
            </div>
        );
    }
}
