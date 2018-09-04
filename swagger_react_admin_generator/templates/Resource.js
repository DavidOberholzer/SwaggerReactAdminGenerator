/**
 * Generated {{ resource.title }}.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import {
    {% for import in resource.imports %}
    {{ import }},
    {% endfor %}
    {% if resource.remove %}
    DeleteButton,
    {% endif %}
    {% if resource.edit %}
    EditButton,
    {% endif %}
    ShowButton
} from 'admin-on-rest';
{% for import in resource.custom_imports %}
import {{ import.name }} from '{{ import.directory }}';
{% endfor %}
{% if resource.filters %}
import {{ resource.title }}Filter from '../filters/{{ resource.title }}Filter';
{% endif %}

{% if resource.create %}
const validationCreate{{ name }} = values => {
    const errors = {};
    {% for attribute in resource.create.fields %}
    {% if attribute.required %}
    if (!values.{{ attribute.source }}) {
        errors.{{ attribute.source }} = ["{{ attribute.source }} is required"];
    }
    {% endif %}
    {% endfor %}
    return errors;
};

{% endif %}
{% if resource.edit %}
const validationEdit{{ name }} = values => {
    const errors = {};
    {% for attribute in resource.edit.fields %}
    {% if attribute.required %}
    if (!values.{{ attribute.source }}) {
        errors.{{ attribute.source }} = ["{{ attribute.source }} is required"];
    }
    {% endif %}
    {% endfor %}
    return errors;
};

{% endif %}
{% for component, entries in resource.items() %}
{% for attribute in entries.fields %}
{% if attribute.choices %}
const choice{{ component|title }}{{ attribute.source|title }} = [
    {% if attribute.type == "integer" %}
    {% for choice in attribute.choices %}
    { id: {{ choice }}, name: {{ choice }} },
    {% endfor %}
    {% else %}
    {% for choice in attribute.choices %}
    { id: '{{ choice }}', name: '{{ choice }}' },
    {% endfor %}
    {% endif%}
];

{% endif %}
{% endfor %}
{% endfor %}
{% for component, entries in resource.items() %}
{% if component in supported_components and (entries.fields|length > 0 or entries.inlines) %}
export const {{ resource.title }}{{ component|title }} = props => (
    <{{ component|title }} {...props} title="{{ resource.title }} {{ component|title }}"{% if component == "list" and resource.filters %} filters={<{{ resource.title }}Filter />}{% endif %}>
        <{% if component == "list" %}Datagrid bodyOptions={ { showRowHover: true } }{% elif component == "show" %}SimpleShowLayout{% else %}SimpleForm validate={validation{{ component|title }}{{ name }}()}{% endif %}>
            {% for attribute in entries.fields %}
            {% if attribute.related_component %}
            <{{ attribute.component }} label="{{ attribute.label }}" source="{{ attribute.source }}" reference="{{ attribute.reference }}" {% if "Field" in attribute.component %}linkType="show" {% else %}perPage={0} {% endif %}allowEmpty>
                <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.related_component }}{% endif %} {% if "Input" in attribute.related_component %}optionText={% else %}source={% endif %}"{{ attribute.option_text }}" />
            </{{ attribute.component }}>
            {% else %}
            <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.component }}{% endif %} source="{{ attribute.source }}"{% if attribute.choices %} choices={choice{{ component|title }}{{ attribute.source|title }}}{% endif %}{% if attribute.type == "object" and "Input" in attribute.component %} format={value => value instanceof Object ? JSON.stringify(value) : value} parse={value => { try { return JSON.parse(value); } catch (e) { return value; } }}{% endif %}{% if attribute.component == "ObjectField" %} addLabel{% endif %} />
            {% endif %}
            {% endfor %}
            {% for inline in entries.inlines %}
            <{{ inline.component }} label="{{ inline.label }}" reference="{{ inline.reference }}" target="{{ inline.target }}">
                <Datagrid bodyOptions={ { showRowHover: true } }>
                    {% for attribute in inline.fields %}
                    {% if attribute.related_component %}
                    <{{ attribute.component }} label="{{ attribute.label }}" source="{{ attribute.source }}" reference="{{ attribute.reference }}" {% if "Field" in attribute.component %}linkType="show" {% endif %}allowEmpty>
                        <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.related_component }}{% endif %} source="{{ attribute.option_text }}" />
                    </{{ attribute.component }}>
                    {% else %}
                    <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.component }}{% endif %} source="{{ attribute.source }}"{% if attribute.type == "object" and "Input" in attribute.component %} format={value => value instanceof Object ? JSON.stringify(value) : value} parse={value => { try { return JSON.parse(value); } catch (e) { return value; } }}{% endif %}{% if attribute.component == "ObjectField" %} addLabel{% endif %} />
                    {% endif %}
                    {% endfor %}
                </Datagrid>
            </{{ inline.component }}>
            {% endfor %}
            {% if component == "list" %}
            {% if resource.edit %}
            <EditButton />
            {% endif %}
            {% if resource.show %}
            <ShowButton />
            {% endif %}
            {% if resource.remove %}
            <DeleteButton />
            {% endif %}
            {% endif %}
        </{% if component == "list" %}Datagrid{% elif component == "show" %}SimpleShowLayout{% else %}SimpleForm{% endif %}>
    </{{ component|title }}>
);

{% endif %}
{% endfor %}
/** End of Generated Code **/
