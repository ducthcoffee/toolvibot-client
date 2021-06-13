import axios from 'axios';
var qs = require('qs');

export const instance = axios.create({
  baseURL: 'http://api.visitkorea.or.kr/openapi/service/rest/EngService/',
  timeout: 10000,
  paramsSerializer: function (params) {
    return decodeURIComponent(
      qs.stringify(params, { arrayFormat: 'brackets' })
    );
  },
});

export const instanceKor = axios.create({
  baseURL: 'http://api.visitkorea.or.kr/openapi/service/rest/KorService/',
  timeout: 10000,
  paramsSerializer: function (params) {
    return decodeURIComponent(
      qs.stringify(params, { arrayFormat: 'brackets' })
    );
  },
});

export const naverAPI = axios.create({
  baseURL: 'https://openapi.naver.com/v1/search/',
  timeout: 3000,
  headers: {
    'X-Naver-Client-Id': 'ZyS76aFimM8jZMu31Oxp',
    'X-Naver-Client-Secret': 'A7dt6bZRcP',
    'Content-Type': 'text/json;charset=utf-8',
  },
});
