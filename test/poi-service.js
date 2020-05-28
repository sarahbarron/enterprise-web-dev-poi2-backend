'use strict';

const axios = require('axios');

class PoiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  //JWT authentication
  async authenticate(user) {
    try {
      const response = await axios.post(this.baseUrl + '/api/users/authenticate', user);
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
      return response.data;
    } catch (e) {
      return null;
    }
  }
  // clear JWT token
  async clearAuth(user) {
    axios.defaults.headers.common['Authorization'] = '';
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

  async getLocations() {
    const response = await axios.get(this.baseUrl + '/api/locations');
    return response.data;
  }

  async getLocation(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/locations/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createLocation(newLocation) {
    const response = await axios.post(this.baseUrl + '/api/locations', newLocation);
    return response.data;
  }

  async deleteAllLocations() {
    const response = await axios.delete(this.baseUrl + '/api/locations');
    return response.data;
  }

  async deleteOneLocation(id) {
    const response = await axios.delete(this.baseUrl + '/api/locations/' + id);
    return response.data;
  }


  async getPois() {
    try
    {
      const response = await axios.get(this.baseUrl + '/api/pois');
      return response.data;
    }catch (e)
    {
      return null;
    }
  }

  async getPoi(id) {
    try {
      const response = await axios.get(this.baseUrl + '/api/pois/' + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createPoi(id, newPoi) {
    try
    {
      const response = await axios.post(this.baseUrl + '/api/categories/' + id + '/pois', newPoi);
      return response.data;
    }catch (e){
      return null;
    }
  }

  async deleteAllPois() {
    try
    {
      const response = await axios.delete(this.baseUrl + '/api/pois');
      return response.data;
    }catch (e)
    {
      return null;
    }
  }

  async deleteOnePoi(id) {
    try
    {
      const response = await axios.delete(this.baseUrl + '/api/pois/' + id);
      return response.data;
    }catch (e)
    {
      return null
    }
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