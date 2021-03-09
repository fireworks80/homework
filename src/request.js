import axios from 'axios';

const DOMAIN = 'https://www.anapioficeandfire.com';

const request = (method, url, data) => {
  return axios({
    method,
    url: DOMAIN + url,
    data,
  })
    .then((res) => res.data)
    .catch((res) => {
      console.error(res);
    });
};

export const list = {
  fetch(pageNum) {
    return request('GET', `/api/characters?page=${pageNum}&pageSize=10`);
  },
};
