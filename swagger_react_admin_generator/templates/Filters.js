/**
 * Generated Filters.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import {
    {% for import in filters.imports %}
    {% if "DateRange" not in import %}
    {{ import }},
    {% endif %}
    {% endfor %}
    Filter
} from 'react-admin';

{% for _import in filters.custom_imports %}
import {{ _import.name }} from '{{ _import.directory }}';
{% endfor %}

{% for filter in filters.filters %}
{% if not filter.relation %}
{% if filter.array %}

const parse{{ filter.title }} = value => value.replace(/[^\w]/gi, ',');
{% endif %}
{% if filter.array == "integer" %}

const validate{{ filter.title }} = value => {
    if (value) {
        const valid = value.replace(/[^\w]/gi, ',').split(',').every(item => !isNaN(item));
        if (!valid) {
            return "{{ filter.label }} are not all numbers.";
        }
    }
};
{% endif %}
{% endif %}
{% endfor %}

const {{ title }}Filter = props => (
    <Filter {...props}>
        {% for filter in filters.filters %}
        {% if filter.relation %}
        <{{ filter.component }} label="{{ filter.label }}" source="{{ filter.source}}" reference="{{ filter.relation.resource }}" allowEmpty>
            <{{ filter.relation.component }}{% if filter.relation.text %} optionText="{{ filter.relation.text }}"{% endif %} />
        </{{ filter.component }}>
        {% else %}
        <{{ filter.component }} label="{{ filter.label }}" source="{{ filter.source }}"{% if filter.array %} parse={parse{{ filter.title }}}{% if filter.array == "integer" %} validate={validate{{ filter.title }}}{% endif %}{% endif %}{% if filter.props %}{% for name, value in filter.props.items() %} {{ name }}{% if value %}={{ value }}{% endif %}{% endfor %}{% endif %} />
        {% endif %}
        {% endfor %}
    </Filter>
);

export default {{ title }}Filter;
/** End of Generated Code **/