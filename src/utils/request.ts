import axios, { Canceler, AxiosInstance, AxiosResponse } from 'axios';
import { FETCH_CODEURL, INIT_STATE } from '~reducers/common'
import { message } from 'antd';
const appKey = "xxx";
import { store } from '~store';
import { push } from 'connected-react-router';

const cancelToken = axios.CancelToken;

const baseURL = BASE_URL;

//过滤特定的接口地址，以下路径不进入重复取消队列
const API_whiteList: [string?] = [

]


//特定的code状态码(code!=1)执行的操作
const specifyCodeHandles: any = {
    //登录过期的情况下，退出登录
    10006: function () {
        store.dispatch({ type: INIT_STATE });
        store.dispatch(push('/login'));
    }
}


export default class AxiosRequest {

    axiosInstance: AxiosInstance
    post: any

    axiosConfig = {
        baseURL,
        withCredentials: true
    }


    constructor() {
        this.axiosInstance = axios.create(this.axiosConfig);
        this.post = this.axiosInstance.post;
        this.bindInterceptor();
    }


    pendingList: { u: string, f: Canceler }[] = [];


    commonRequest = (req: any) => {//定义请求报文
        this.removePending(req);
        req.cancelToken = new cancelToken((c) => {
            if (API_whiteList.indexOf(req.url) == -1) {
                this.pendingList.push({ u: req.url + '&' + req.method, f: c });
            }
        });

        const state = store.getState();
        const { loginInfo } = state.common || {};
        const { tokenType, accessToken } = loginInfo || {};

        req.headers.Authorization = `${tokenType} ${accessToken}`;

        if (!req.data) req.data = {};
        req.data.appkey = appKey;
        req.data.timestamp = new Date().getTime();
        return req;
    }

    commonResponse = (res: AxiosResponse<ResponseData>) => {//响应报文
        return new Promise((resolve, reject) => {
            this.removePending(res);

            if (res.status != 200) {
                message.destroy();
                message.error('网络异常');
                reject('网络异常');
            }

            const { code } = res.data;

            if (code === 1) {
                resolve(res.data);
            } else {
                message.destroy();
                message.error(res.data.message);

                const handler = specifyCodeHandles[code];
                handler && handler(resolve, reject)

                reject(res.data);
            }
        })
    }

    removePending = (config: any) => {//取消重复的请求
        for (let p = 0; p < this.pendingList.length; p++) {
            if (this.pendingList[p].u === config.url + '&' + config.method) {
                this.pendingList[p].f();
                this.pendingList.splice(p, 1);
            }
        }
    }

    bindInterceptor = () => {//绑定拦截器

        this.axiosInstance.interceptors.request.use((req: any) => {
            return this.commonRequest(req);
        }, (err: any) => {
            return Promise.reject(err)
        });


        this.axiosInstance.interceptors.response.use((res: AxiosResponse): Promise<any> => {
            return this.commonResponse(res);
        }, (err: any) => {

            if (axios.isCancel(err)) {
                console.info('重复请求已经取消')
            } else {
                throw new Error(err)
            }
        });
    }

}