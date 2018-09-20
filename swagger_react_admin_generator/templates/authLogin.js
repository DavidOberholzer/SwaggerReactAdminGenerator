import React, { Component } from 'react';
import { LoginForm } from 'react-admin';
import classnames from 'classnames';

import { Card, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import LockIcon from 'material-ui/svg-icons/action/lock-outline';


class AuthLoginPage extends Component {

    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(form) {
        console.log(form);
    }

    render() {
        const {
            classes,
            className,
            ...rest
        } = this.props;
        return (
            <div className={classnames(classes.main, className)}>
                <Card className={classes.card}>
                    <div className={classes.avatar}>
                        <Avatar className={classes.icon}>
                            <LockIcon />
                        </Avatar>
                    </div>
                    <LoginForm handleSubmit={this.handleSubmit} />
                </Card>
                <Notification />
            </div>
        );
    }
};

export default AuthLoginPage;
