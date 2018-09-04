/**
 * Generated DateRangeInput.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/
import React, { Component } from 'react';
import { Field } from 'redux-form';
import { DateInput } from 'react-admin';

const timezoneOffset = new Date().getTimezoneOffset();


class DateRangeInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            from: this.props.input.value.from,
            to: this.props.input.value.to
        };
        this.handleFromOnChange = this.handleFromOnChange.bind(this);
        this.handleToOnChange = this.handleToOnChange.bind(this);
    }

    handleFromOnChange(event, value) {
        this.setState({ from: value });
    }

    handleToOnChange(event, value) {
        this.setState({ to: value });
    }

    dateParser(value) {
        // Value received is a string in the DateInput.
        const regexp = /(\d{4})-(\d{2})-(\d{2})/;
        let match = regexp.exec(value);
        if (match === null) return;

        let year = match[1];
        let month = match[2];
        let day = match[3];

        if (timezoneOffset < 0) {
            // Negative offset means our picked UTC date got converted to previous day
            var date = new Date(value);
            date.setDate(date.getDate() + 1);
            match = regexp.exec(date.toISOString());
            year = match[1];
            month = match[2];
            day = match[3];
        }
        const correctDate = [year, month, day].join('-');

        return correctDate;
    }

    render() {
        const { source, time } = this.props;
        const today = new Date();
        const fromProps = {
            options: {
                maxDate: this.state.to
                    ? new Date(this.state.to)
                    : new Date(today.getFullYear() + 100, today.getMonth(), today.getDay())
            }
        };
        const toProps = {
            options: {
                minDate: this.state.from
                    ? new Date(this.state.from)
                    : new Date(today.getFullYear() - 100, today.getMonth(), today.getDay())
            }
        };
        return (
            <span>
                <Field
                    name={`${source}.from`}
                    component={DateInput}
                    props={fromProps}
                    label="From"
                    parse={this.dateParser}
                    onChange={this.handleFromOnChange}
                />
                <Field
                    name={`${source}.to`}
                    component={DateInput}
                    props={toProps}
                    label="To"
                    parse={this.dateParser}
                    onChange={this.handleToOnChange}
                />
            </span>
        );
    }
}

export default DateRangeInput;
/** End of Generated Code **/
