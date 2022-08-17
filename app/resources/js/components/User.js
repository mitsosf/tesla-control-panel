import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';

import {Col, Form, Image, Input, notification, Row, Select} from "antd";
import axios from "axios";
import Icon from "@ant-design/icons";

export default class User extends React.Component {
    constructor() {
        super();

        const element = document.getElementById('user');
        const props = Object.assign({}, element.dataset);

        const user = JSON.parse(props.user);
        let user_roles = []
        user.roles.map(role => {
            user_roles.push(role.name)
        })

        this.state = {
            token: props.token,
            user,
            user_roles: user_roles,
            roles: JSON.parse(props.roles),
            url: props.url
        }
    }

    openNotificationWithIcon = (type, message) => {
        notification[type]({
            message: type === 'success' ? 'Success!' : 'Oops!',
            description: message,
            placement: 'bottomRight'
        });
    };

    handleRolesChange = (values) => {
        axios.post(this.state.url + `/api/user/roles`,
            {
                'user_id': this.state.user.id,
                'updated_roles': values,
            },
            {
                headers: {
                    'token': this.state.token
                }
            }).then((res) => {
            if (res.status === 200) {
                this.openNotificationWithIcon('success', `Role ${res.data.name} has been ${res.data.status}`)
            } else {
                this.openNotificationWithIcon('error', res.data)
            }
        }).catch((error) => {
            if (error.response.status === 599) {
                this.setState({
                    loading: false
                })
                this.openNotificationWithIcon('error', error.response.data)
            }
        });
        console.log(values)
    }


    render() {
        const {Option} = Select;
        console.log(this.state.user)
        console.log(this.state.roles)
        return (
            <>
                <Row>
                    <Form className="login-form">
                        <Col>
                            <Form.Item label='Avatar'>
                                <Image
                                    width={200}
                                    src={this.state.user.avatar}
                                />
                            </Form.Item>
                            <Form.Item label='Name'>
                                <Input
                                    value={this.state.user.name}
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item label='Email'>
                                <Input
                                    value={this.state.user.email}
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item label='Google ID'>
                                <Input
                                    value={this.state.user.google_id}
                                    disabled
                                />
                            </Form.Item>
                            <Form.Item label='Facebook ID'>
                                <Input
                                    value={this.state.user.facebook_id}
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item label='Roles'>
                                <Select
                                    mode="multiple"
                                    style={{width: '100%'}}
                                    placeholder="Please select"
                                    defaultValue={this.state.user_roles}
                                    onChange={this.handleRolesChange}
                                >
                                    {this.state.roles.map(role => (
                                        <Option key={role.id} value={role.name}>{role.description}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Form>
                </Row>
            </>
        );
    }
}

if (document.getElementById('user')) {
    ReactDOM.render(<User/>,
        document.getElementById('user'))
    ;
}
