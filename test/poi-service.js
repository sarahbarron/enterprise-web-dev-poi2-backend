'use strict';

const axios = require('axios');

class PoiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + '/api/users');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/users/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + '/api/users', newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + '/api/users');
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + '/api/users/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
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

  async getPois() {
    const response = await axios.get(this.baseUrl + '/api/pois');
    return response.data;
  }

  async getPoi(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/pois/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createPoi(newPoi) {
    const response = await axios.post(this.baseUrl + '/api/pois', newPoi);
    return response.data;
  }

  async deleteAllPois() {
    const response = await axios.delete(this.baseUrl + '/api/pois');
    return response.data;
  }

  async deleteOnePoi(id) {
    const response = await axios.delete(this.baseUrl + '/api/pois/' + id);
    return response.data;
  }

  async getImages() {
    const response = await axios.get(this.baseUrl + '/api/images');
    return response.data;
  }

  async getImage(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/images/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createImage(newImage) {
    const response = await axios.post(this.baseUrl + '/api/images', newImage);
    return response.data;
  }

  async deleteAllImages() {
    const response = await axios.delete(this.baseUrl + '/api/images');
    return response.data;
  }

  async deleteOneImage(id) {
    const response = await axios.delete(this.baseUrl + '/api/images/' + id);
    return response.data;
  }
}

module.exports = PoiService;