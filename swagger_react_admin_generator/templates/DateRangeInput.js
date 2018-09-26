/**
 * Generated DateRangeInput.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { DateInput } from 'react-admin';
import { renderDateTimeField } from './DateTimeInput';

const COMPONENTS = {
    date: DateInput,
    datetime: renderDateTimeField
};

class DateRangeInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            from: this.props.input.value.from,
            to: this.props.input.value.to
        };
        this.component = props.time ? COMPONENTS.datetime : COMPONENTS.date;
        this.handleFromOnChange = this.handleFromOnChange.bind(this);
        this.handleToOnChange = this.handleToOnChange.bind(this);
    }

    handleFromOnChange(event, value) {
        this.setState({ from: value });
    }

    handleToOnChange(event, value) {
        this.setState({ to: value });
    }

    render() {
        const { label, source, style } = this.props;
        const props = {
            customStyles: style
        };
        return (
            <span>
                <Field
                    name={`${source}.from`}
                    component={this.component}
                    props={props}
                    label={`From ${label}`}
                    onChange={this.handleFromOnChange}
                />
                <Field
                    name={`${source}.to`}
                    component={this.component}
                    props={props}
                    label={`To ${label}`}
                    onChange={this.handleToOnChange}
                />
            </span>
        );
    }
}
DateRangeInput.propTypes = {
    time: PropTypes.bool
};
DateRangeInput.defaultProps = {
    time: false
};
export default DateRangeInput;
/** End of Generated Code **/
