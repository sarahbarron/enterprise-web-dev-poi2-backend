'use strict';

const axios = require('axios');
const baseUrl = 'http://localhost:3000';

class PoiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getCategories() {
    const response = await axios.get(this.baseUrl + '/api/categories');
    return response.data;
  }

  async getCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/categories/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createCategory(newCategory) {
    const response = await axios.post(this.baseUrl + '/api/categories', newCategory);
    return response.data;
  }

  async deleteAllCategories() {
    const response = await axios.delete(this.baseUrl + '/api/categories');
    return response.data;
  }

  async deleteOneCategory(id) {
    const response = await axios.delete(this.baseUrl + '/api/categories/' + id);
    return response.data;
  }

  // async getUsers() {
  //   const response = await axios.get(this.baseUrl + '/api/users');
  //   return response.data;
  // }
  //
  // async getUser(id) {
  //   try {
  //     const response = await axios.get(this.baseUrl + '/api/user/' + id);
  //     return response.data;
  //     return response.data;
  //   } catch (e) {
  //     return null;
  //   }
  // }
  //
  // async createUser(newUser) {
  //   const response = await axios.post(this.baseUrl + '/api/users', newUser);
  //   return response.data;
  // }
}

module.exports = PoiService;