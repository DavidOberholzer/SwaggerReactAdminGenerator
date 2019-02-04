/**
 * Generated {{ title }}.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import {
    {% for _import in resource.imports %}
    {{ _import }},
    {% endfor %}
    {% if resource.methods.edit %}
    EditButton,
    {% endif %}
    {% if resource.methods.show %}
    ShowButton,
    {% endif %}
    {% if resource.methods.remove %}
    DeleteButton,
    {% endif %}
} from 'react-admin';
{% for _import in resource.custom_imports %}
import {{ _import.name }} from '{{ _import.directory }}';
{% endfor %}

{% if resource.methods.edit %}
import {{ title }}EditToolbar from '../customActions/{{ title }}EditToolbar';
{% endif %}
{% if omit_exporter %}
import {{ title }}ListActions from '../customActions/{{ title }}ListActions';
{% endif %}

{% if resource.filters %}
import {{ title }}Filter from '../filters/{{ title }}Filter';
{% endif %}

{% if resource.methods.create %}
{% for attribute in resource.methods.create.fields %}
{% if attribute.required or attribute.length_values %}
const validate{{ attribute.source|title }}Create = [{% if attribute.required %}required(),{% endif %}{% for function, value in attribute.length_values.items() %}{% if value %}{{ function }}({{ value }}),{% endif %}{% endfor %}];
{% endif %}
{% endfor %}

{% endif %}
{% if resource.methods.edit %}
{% for attribute in resource.methods.edit.fields %}
{% if attribute.required or attribute.length_values %}
const validate{{ attribute.source|title }}Edit = [{% if attribute.required %}required(),{% endif %}{% for function, value in attribute.length_values.items() %}{% if value %}{{ function }}({{ value }}),{% endif %}{% endfor %}];
{% endif %}
{% endfor %}

{% endif %}
{% for method, entries in resource.methods.items() %}
{% for attribute in entries.fields %}
{% if attribute.choices %}
const choice{{ method|title }}{{ attribute.source|title }} = [
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
{% for component, entries in resource.methods.items() %}
{% if component in supported_components and (entries.fields|length > 0 or entries.inlines) %}
export const {{ title }}{{ component|title }} = props => (
    <{{ component|title }} {...props} title="{{ title }} {{ component|title }}"{% if component == "list" %}{% if resource.filters %} filters={<{{ title }}Filter />}{% endif %}{% if omit_exporter %} actions={<{{ title }}ListActions />}{% endif %} bulkActionButtons={false}{% endif %}>
        {% if entries.responsive_fields %}
        <Responsive
            small={
                <SimpleList
                    {% for prop, details in entries.responsive_fields.items() %}
                    {{ prop }}Text={record => `{{ details.title }}: ${ record.{{ details.field }} }`}
                    {% endfor %}
                />
            }
            medium={
        {% endif %}
        <{% if component == "list" %}Datagrid{% elif component == "show" %}SimpleShowLayout{% else %}SimpleForm{% if component == "edit" %} toolbar={<{{ title }}EditToolbar />}{% endif %}{% if component == "create" %} redirect="show"{% endif %}{% endif %}>
            {% for attribute in entries.fields %}
            {% if attribute.read_only and component == "create" %}{% else %}
            {% if attribute.related_component %}
            <{{ attribute.component }}
                label="{{ attribute.label }}" source="{{ attribute.source }}"
                reference="{{ attribute.reference }}"{% if component == "list" and not attribute.sortable %}
                sortable={false}{% endif %}{% if "Field" in attribute.component %}
                linkType="show"{% else %}
                perPage={0}{% endif %}{% if "Input" in attribute.component and not attribute.required %}
                allowEmpty{% endif %}>
                <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.related_component }}{% endif %} {% if "Input" in attribute.related_component %}optionText={% else %}source={% endif %}"{{ attribute.option_text }}" />
            </{{ attribute.component }}>
            {% else %}
            <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.component }}{% endif %}
                source="{{ attribute.source }}"{% if component == "list" and not attribute.sortable %}
                sortable={false}{% endif %}{% if attribute.choices %}
                choices={choice{{ component|title }}{{ attribute.source|title }}}{% endif %}{% if component == "create" or component == "edit" %}{% if attribute.required or attribute.length_values %}
                validate={validate{{ attribute.source|title }}{% if component == "create" %}Create{% else %}Edit{% endif %}}{% endif %}{% endif %}{% if attribute.type == "object" and "Input" in attribute.component %}
                format={value => value instanceof Object ? JSON.stringify(value) : value}
                parse={value => { try { return JSON.parse(value); } catch (e) { return value; } }}{% endif %}{% if attribute.component == "ObjectField" %}
                addLabel{% endif %}
            />
            {% endif %}
            {% endif %}
            {% endfor %}
            {% for inline in entries.inlines %}
            <{{ inline.component }} label="{{ inline.label }}" reference="{{ inline.reference }}" target="{{ inline.target }}">
                <Datagrid>
                    {% for attribute in inline.fields %}
                    {% if attribute.related_component %}
                    <{{ attribute.component }} label="{{ attribute.label }}" source="{{ attribute.source }}" reference="{{ attribute.reference }}" sortable={false} {% if "Field" in attribute.component %}linkType="show" {% endif %}>
                        <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.related_component }}{% endif %} source="{{ attribute.option_text }}" />
                    </{{ attribute.component }}>
                    {% else %}
                    <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.component }}{% endif %} source="{{ attribute.source }}" sortable={false}{% if attribute.type == "object" and "Input" in attribute.component %} format={value => value instanceof Object ? JSON.stringify(value) : value} parse={value => { try { return JSON.parse(value); } catch (e) { return value; } }}{% endif %}{% if attribute.component == "ObjectField" %} addLabel{% endif %} />
                    {% endif %}
                    {% endfor %}
                </Datagrid>
            </{{ inline.component }}>
            {% endfor %}
            {% if component == "list" %}
            {% if resource.methods.edit %}
            <EditButton />
            {% endif %}
            {% if resource.methods.show %}
            <ShowButton />
            {% endif %}
            {% if resource.methods.remove %}
            <DeleteButton />
            {% endif %}
            {% endif %}
        </{% if component == "list" %}Datagrid{% elif component == "show" %}SimpleShowLayout{% else %}SimpleForm{% endif %}>{% if entries.responsive_fields %}} />{% endif %}</{{ component|title }}>
);

{% endif %}
{% endfor %}
/** End of Generated Code **/
