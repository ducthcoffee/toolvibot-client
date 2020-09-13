import axios from 'axios';
var qs = require('qs');

export const instance = axios.create({
  baseURL: 'http://api.visitkorea.or.kr/openapi/service/rest/EngService/',
  timeout: 1000,
  paramsSerializer: function (params) {
    return decodeURIComponent(
      qs.stringify(params, { arrayFormat: 'brackets' })
    );
  },
});
