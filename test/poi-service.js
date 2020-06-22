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
      console.log(e);
      return null;
    }
  }
  // clear JWT token
  async clearAuth(user) {
    try
    {
      axios.defaults.headers.common['Authorization'] = '';
    }catch (e)
    {
      return e;
    }
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
    try
    {
      const response = await axios.get(this.baseUrl + '/api/categories');
      return response.data;
    }catch (e)
    {
      return e;
    }
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
    try
    {
      const response = await axios.post(this.baseUrl + '/api/categories', newCategory);
      return response.data;
    }catch (e)
    {
      return e;
    }
  }

  async deleteAllCategories() {
    try
    {
      const response = await axios.delete(this.baseUrl + '/api/categories');
      return response.data;
    }catch (e)
    {
      return e;
    }
  }

  async deleteOneCategory(id) {
    try
    {
      const response = await axios.delete(this.baseUrl + '/api/categories/' + id);
      return response.data;
    }catch (e)
    {
      return e;
    }
  }

  async getLocations() {
    try
    {
      const response = await axios.get(this.baseUrl + '/api/locations');
      return response.data;
    }catch (e)
    {
      return e;
    }
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
    try
    {
      const response = await axios.post(this.baseUrl + '/api/locations', newLocation);
      return response.data;
    }catch (e)
    {
      return e;
    }
  }

  async deleteAllLocations() {
    try
    {
      const response = await axios.delete(this.baseUrl + '/api/locations');
      return response.data;
    }
    catch (e)
    {
      return e;
    }
  }

  async deleteOneLocation(id) {
    try
    {
      const response = await axios.delete(this.baseUrl + '/api/locations/' + id);
      return response.data;
    }catch (e)
    {
      return e;
    }
  }

  async updateLocation(id, coordinates)
  {
    try
    {
      const response = await axios.post(this.baseUrl + '/api/locations/update/' + id, coordinates);
      return response.data
    }catch (e)
    {
      return null;
    }
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

  async createPoi(catid,newPoi) {
    try
    {
      const response = await axios.post(this.baseUrl + '/api/categories/'+catid+'/pois', newPoi);
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

  async updatePoi(id, poi){
    try{
      const response = await axios.post(this.baseUrl + '/api/pois/update/' + id, poi);
      return response.data;
    } catch(e){
        return null;
    }
  }

  async getPoiByCategory(id){
    try{
      const response = await axios.get(this.baseUrl + '/api/pois/'+id+'/category');
      return response.data;
    }catch (e)
    {
      return null;
    }
  }

  async getPoiByUser(){
    try{
      const response = await axios.get(this.baseUrl + '/api/pois/user');
      return response.data;
    }catch (e)
    {
      return null;
    }
  }

  async addImageToPoi(imgdetails){
    try{
      const response = await axios.post(this.baseUrl + '/api/pois/addimage', imgdetails);
      return response.data;
    }catch (e)
    {
      return null;
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

  async deleteOneImage(poi_id, img_id) {
    const response = await axios.delete(this.baseUrl + '/api/poi/'+poi_id+'/images/' + img_id);
    return response.data;
  }

}

module.exports = PoiService;