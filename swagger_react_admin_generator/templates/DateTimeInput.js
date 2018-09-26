/**
 * Generated DateTimeInput.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/
import React from 'react';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import LeftArrow from '@material-ui/icons/ChevronLeft';
import RightArrow from '@material-ui/icons/ChevronRight';
import CalendarIcon from '@material-ui/icons/Today';
import TimeIcon from '@material-ui/icons/Schedule';
import { Field } from 'redux-form';

import { titleCase } from '../utils';
import { styles } from '../theme';

export const renderDateTimeField = ({ input, label, customStyles }) => (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
            label={label}
            value={input.value || null}
            onChange={input.onChange}
            dateRangeIcon={<CalendarIcon />}
            timeIcon={<TimeIcon />}
            leftArrowIcon={<LeftArrow />}
            rightArrowIcon={<RightArrow />}
            style={customStyles || styles.dateTimeInput}
            showTodayButton
        />
    </MuiPickersUtilsProvider>
);

const DateTimeInput = ({ label, source }) => (
    <span>
        <Field
            name={source}
            component={renderDateTimeField}
            label={label || titleCase(source.replace('_', ' '))}
        />
    </span>
);

export default DateTimeInput;
/** End of Generated Code **/
