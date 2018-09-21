/**
 * Generated dataProvider.js code. Edit at own risk.
 * When regenerated the changes will be lost.
 **/
import { stringify } from 'query-string';
import { fetchUtils } from 'react-admin';

export const GET_LIST = 'GET_LIST';
export const GET_ONE = 'GET_ONE';
export const GET_MANY = 'GET_MANY';
export const GET_MANY_REFERENCE = 'GET_MANY_REFERENCE';
export const CREATE = 'CREATE';
export const UPDATE = 'UPDATE';
export const DELETE = 'DELETE';

const COMPOSITE_KEY_RESOURSES = {};

// For models with different Primary Key fields rather than 'id'.
const PK_MAPPING = {};

const FILTER_LENGTHS = {
    {% for name, resource in resources.items() %}
    {% if resource.filter_lengths %}
    {{ name }}: {
        {% for filter, lengths in resource.filter_lengths.items() %}
        {{ filter }}: {
            {% if lengths.min_length %}
            min: {{ lengths.min_length }},
            {% endif %}
            {% if lengths.max_length %}
            max: {{ lengths.max_length }}
            {% endif %}
        },
        {% endfor %}
    },
    {% endif %}
    {% endfor %}
};

const GET_MANY_FILTER = {};

/**
 * @param {String} apiUrl The base API url
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} { url, options } The HTTP request parameters
 */
export const convertRESTRequestToHTTP = ({ apiUrl, type, resource, params }) => {
    let url = '';
    const options = {};
    let query = {};

    switch (type) {
        case GET_MANY_REFERENCE: {
            query[params.target] = params.id;
            url = `${apiUrl}/${resource}?${stringify(query)}`;
            break;
        }
        case GET_LIST: {
            if (params.pagination) {
                let { page, perPage } = params.pagination;
                query['limit'] = perPage || 100; // Maximum limit if perPage = 0.
                query['offset'] = page ? (page - 1) * query['limit'] : 0;
            }

            if (params.sort) {
                const { field, order } = params.sort;
                query['order_by'] = `${order === 'DESC' ? '-' : ''}` + field;
            }

            if (params.filter) {
                let filterLengths = FILTER_LENGTHS[resource];
                Object.keys(params.filter).forEach(key => {
                    let filter =
                        params.filter[key] instanceof Object
                            ? JSON.stringify(params.filter[key])
                            : params.filter[key];
                    if (filterLengths && filterLengths[key]) {
                        const minLength = filterLengths[key].min;
                        const maxLength = filterLengths[key].max;
                        if (!minLength || filter.length >= minLength) {
                            filter =
                                maxLength && filter.length > maxLength
                                    ? filter.slice(0, maxLength)
                                    : filter;
                            query[key] = filter;
                        }
                    } else {
                        query[key] = filter;
                    }
                    if (!query[key] || (query[key] && query[key].length === 0)) {
                        delete query[key];
                    }
                });
            }
            url = `${apiUrl}/${resource}?${stringify(query)}`;
            break;
        }
        case GET_ONE:
            url = `${apiUrl}/${resource}/${params.id}`;
            break;
        case GET_MANY: {
            const filterName = GET_MANY_FILTER[resource];
            const query = filterName
                ? { [filterName]: params.ids.join(',') }
                : { ids: params.ids.join(',') };
            url = `${apiUrl}/${resource}?${stringify(query)}`;
            break;
        }
        case UPDATE:
            url = `${apiUrl}/${resource}/${params.id}`;
            options.method = 'PUT';
            options.body = JSON.stringify(params.data);
            break;
        case CREATE:
            url = `${apiUrl}/${resource}`;
            options.method = 'POST';
            options.body = JSON.stringify(params.data);
            break;
        case DELETE:
            url = `${apiUrl}/${resource}/${params.id}`;
            options.method = 'DELETE';
            break;
        default:
            throw new Error(`Unsupported fetch action type ${type}`);
    }
    return { url, options };
};

/**
 * @param {Object} response HTTP response from fetch()
 * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
 * @param {String} resource Name of the resource to fetch, e.g. 'posts'
 * @param {Object} params The REST request params, depending on the type
 * @returns {Object} REST response
 */
const convertHTTPResponseToREST = ({ response, type, resource, params }) => {
    const { headers, json } = response;
    let keys = COMPOSITE_KEY_RESOURSES[resource];
    let pk = PK_MAPPING[resource];
    let data = [];

    switch (type) {
        // Total required by AOR for all list operations
        case GET_LIST:
            if (!headers.has('x-total-count')) {
                throw new Error(
                    'The X-Total-Count header is missing in the HTTP Response. The jsonServer REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
                );
            }
            data = keys
                ? json.map(res => ({
                      ...res,
                      id: `${keys.map(key => res[key]).join('/')}`
                  }))
                : pk
                    ? json.map(res => (res.hasOwnProperty('id') ? res : { ...res, id: res[pk] }))
                    : json;
            return {
                data: data,
                total: parseInt(headers.get('x-total-count'), 10)
            };
        case GET_MANY_REFERENCE:
            if (!headers.has('x-total-count')) {
                throw new Error(
                    'The X-Total-Count header is missing in the HTTP Response. The jsonServer REST client expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
                );
            }
            data = keys
                ? json.map(res => ({
                      ...res,
                      id: `${keys.map(key => res[key]).join('/')}`
                  }))
                : pk
                    ? json.map(res => (res.hasOwnProperty('id') ? res : { ...res, id: res[pk] }))
                    : json;
            return {
                data: data,
                total: parseInt(headers.get('x-total-count'), 10)
            };
        case CREATE:
            return {
                data: {
                    ...params.data,
                    id: keys ? keys.map(key => json[key]).join('/') : pk ? json[pk] : json.id
                }
            };
        default:
            return { data: json ? json : {} };
    }
};

/**
 * Maps React Admin queries to a Swagger Spec
 * @example
 * GET_LIST     => GET http://my.api.url/users?limit=10&offset=30&ordering=-name
 * GET_ONE      => GET http://my.api.url/users/123/ or GET http://my.api.url/users/123/321/ in the case of a composite key
 * GET_MANY     => GET http://my.api.url/users/1/ GET http://my.api.url/users/2/
 * UPDATE       => PUT http://my.api.url/users/123/ or PUT http://my.api.url/users/123/321/ in the case of a composite key
 * CREATE       => POST http://my.api.url/users/
 * DELETE       => DELETE http://my.api.url/users/123/ or DELETE http://my.api.url/users/123/321/ in the case of a composite key
 */
const dataProvider = (apiUrl, httpClient = fetchUtils.fetchJson) => {
    /**
     * @param {string} type Request type, e.g GET_LIST
     * @param {string} resource Resource name, e.g. "users"
     * @param {Object} payload Request parameters. Depends on the request type
     * @returns {Promise} the Promise for a REST response
     */

    return async (type, resource, params) => {
        const { url, options } = convertRESTRequestToHTTP({
            apiUrl,
            type,
            resource,
            params
        });

        return httpClient(url, options).then(response =>
            convertHTTPResponseToREST({
                response,
                type,
                resource,
                params
            })
        );
    };
};

export const httpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const id_token = localStorage.getItem('id_token');
    options.headers.set('Authorization', `Bearer ${id_token}`);
    return fetchUtils.fetchJson(url, options);
};

export default dataProvider('rest_url', httpClient);
/** End of Generated Code **/
