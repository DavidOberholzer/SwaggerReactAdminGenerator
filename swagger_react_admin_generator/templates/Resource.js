/**
 * Generated {{ title }}.js code. Edit at own risk.
 * When regenerated the changes will be lost.
**/
import React from 'react';
import {
    {% for _import in resource.imports %}
    {{ _import }},
    {% endfor %}
} from 'react-admin';
{% for _import in resource.custom_imports %}
import {{ _import.name }} from '{{ _import.directory }}';
{% endfor %}

{% for component in resource.methods.keys() %}
{% if component in action_components %}
import {{ title }}{{ component|title }}Actions from '../customActions/{{ title }}{{ component|title }}Actions';
{% endif %}
{% endfor %}

{% if resource.filters %}
import {{ title }}Filter from '../filters/{{ title }}Filter';
{% endif %}

{% if resource.methods.create %}
const validationCreate{{ name }} = values => {
    const errors = {};
    {% for attribute in resource.methods.create.fields %}
    {% if attribute.required %}
    if (!values.{{ attribute.source }}) {
        errors.{{ attribute.source }} = ["{{ attribute.source }} is required"];
    }
    {% endif %}
    {% endfor %}
    return errors;
};

{% endif %}
{% if resource.methods.edit %}
const validationEdit{{ name }} = values => {
    const errors = {};
    {% for attribute in resource.methods.edit.fields %}
    {% if attribute.required %}
    if (!values.{{ attribute.source }}) {
        errors.{{ attribute.source }} = ["{{ attribute.source }} is required"];
    }
    {% endif %}
    {% endfor %}
    return errors;
};

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
    <{{ component|title }} {...props} title="{{ title }} {{ component|title }}"{% if component in action_components %} actions={<{{ title }}{{ component|title }}Actions />}{% endif %}{% if component == "list" and resource.filters %} filters={<{{ title }}Filter />}{% endif %}>
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
        <{% if component == "list" %}Datagrid{% elif component == "show" %}SimpleShowLayout{% else %}SimpleForm validate={validation{{ component|title }}{{ name }}}{% if component == "create" %} redirect="show"{% endif %}{% endif %}>
            {% for attribute in entries.fields %}
            {% if attribute.read_only and component == "create" %}{% else %}
            {% if attribute.related_component %}
            {% if permissions %}
            {% if "Field" in attribute.component %}
            {PermissionsStore.getResourcePermission('{{ attribute.reference }}', 'list') ? (
                <{{ attribute.component }} label="{{ attribute.label }}" source="{{ attribute.source }}" reference="{{ attribute.reference }}"{% if component == "list" and not attribute.sortable %} sortable={false}{% endif %}{% if "Field" in attribute.component %} linkType="show"{% else %} perPage={0}{% endif %} allowEmpty>
                    <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.related_component }}{% endif %} {% if "Input" in attribute.related_component %}optionText={% else %}source={% endif %}"{{ attribute.option_text }}" />
                </{{ attribute.component }}>
            ) : (
                <EmptyField />
            )}
            {% else %}
            {PermissionsStore.getResourcePermission('{{ attribute.reference }}', 'list') && (
                <{{ attribute.component }} label="{{ attribute.label }}" source="{{ attribute.source }}" reference="{{ attribute.reference }}"{% if "Field" in attribute.component %} linkType="show"{% else %} perPage={0}{% endif %} allowEmpty>
                    <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.related_component }}{% endif %} {% if "Input" in attribute.related_component %}optionText={% else %}source={% endif %}"{{ attribute.option_text }}" />
                </{{ attribute.component }}>
            )}
            {% endif %}
            {% else %}
            <{{ attribute.component }} label="{{ attribute.label }}" source="{{ attribute.source }}" reference="{{ attribute.reference }}"{% if component == "list" and not attribute.sortable %} sortable={false}{% endif %}{% if "Field" in attribute.component %} linkType="show"{% else %} perPage={0}{% endif %} allowEmpty>
                <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.related_component }}{% endif %} {% if "Input" in attribute.related_component %}optionText={% else %}source={% endif %}"{{ attribute.option_text }}" />
            </{{ attribute.component }}>
            {% endif %}
            {% else %}
            <{% if attribute.read_only %}DisabledInput{% else %}{{ attribute.component }}{% endif %} source="{{ attribute.source }}"{% if component == "list" and not attribute.sortable %} sortable={false}{% endif %}{% if attribute.choices %} choices={choice{{ component|title }}{{ attribute.source|title }}}{% endif %}{% if attribute.type == "object" and "Input" in attribute.component %} format={value => value instanceof Object ? JSON.stringify(value) : value} parse={value => { try { return JSON.parse(value); } catch (e) { return value; } }}{% endif %}{% if attribute.component == "ObjectField" %} addLabel{% endif %} />
            {% endif %}
            {% endif %}
            {% endfor %}
            {% for inline in entries.inlines %}
            {% if permissions %}
            {PermissionsStore.getResourcePermission('{{ inline.reference }}', 'list') ? (
                <{{ inline.component }} label="{{ inline.label }}" reference="{{ inline.reference }}" target="{{ inline.target }}">
                    <Datagrid bodyOptions={ { showRowHover: true } }>
                        {% for attribute in inline.fields %}
                        {% if attribute.related_component %}
                        {PermissionsStore.getResourcePermission('{{ attribute.reference }}', 'list') ? (
                            <{{ attribute.component }} label="{{ attribute.label }}" source="{{ attribute.source }}" reference="{{ attribute.reference }}" {% if "Field" in attribute.component %}linkType="show" {% endif %}allowEmpty>
                                <{{ attribute.related_component }} source="{{ attribute.option_text }}" />
                            </{{ attribute.component }}>
                        ) : (
                            <EmptyField />
                        )}
                        {% else %}
                        <{{ attribute.component }} source="{{ attribute.source }}"{% if attribute.component == "ObjectField" %} addLabel{% endif %} />
                        {% endif %}
                        {% endfor %}
                    </Datagrid>
                </{{ inline.component }}>
            ) : {% if component == "show" %}(<EmptyField />){% else %}null{% endif %}}
            {% else %}
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
            {% endif %}
            {% endfor %}
        </{% if component == "list" %}Datagrid{% elif component == "show" %}SimpleShowLayout{% else %}SimpleForm{% endif %}>{% if entries.responsive_fields %}} />{% endif %}</{{ component|title }}>
);

{% endif %}
{% endfor %}
/** End of Generated Code **/
