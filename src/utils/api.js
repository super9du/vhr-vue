import axios from 'axios';
import {Message} from 'element-ui';
import router from '../router/index';


//拦截器：对状态码进行响应
axios.interceptors.response.use(resp => {
    if (resp.status && resp.status === 200 && resp.data.status === 500) {
        Message.error({showClose: true, message: resp.data.msg});
        return;
    } else if (resp.data.msg) {
        Message.success({showClose: true, message: resp.data.msg});
    }
    return resp.data;
}, error => {
    if (error.response.status === 401) {
        Message.error({showClose: true, message: '请登录后操作'});
        router.replace('/');
    } else if (error.response.status === 403) {
        Message.error({showClose: true, message: '权限不足，请尝试重新登录'});
        router.replace('/');
    } else if (error.response.status === 404 || error.response.status === 500) {
        Message.error({showClose: true, message: '服务器bug了'});
    } else {
        if (error.response.data.msg) {
            Message.error({showClose: true, message: error.response.data.msg});
        } else {
            Message.error({showClose: true, message: '未知错误'});
        }
    }
});


let base = '';
//对外提供URL请求接口
export const postKvRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params,
        transformRequest: [function (data) {
            let rtn = '';
            for (let i in data) {
                rtn += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
            }
            return rtn;
        }],
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
};
export const postRequest = (url, params) => {
    return axios({
        method: 'post',
        url: `${base}${url}`,
        data: params
    })
};
export const putRequest = (url, params) => {
    return axios({
        method: 'put',
        url: `${base}${url}`,
        data: params
    })
};
export const getRequest = (url, params) => {
    return axios({
        method: 'get',
        url: `${base}${url}`,
        data: params
    })
};
export const deleteRequest = (url, params) => {
    return axios({
        method: 'delete',
        url: `${base}${url}`,
        data: params
    })
};
