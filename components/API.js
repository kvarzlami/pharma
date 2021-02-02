import React from 'react';
import axios from 'axios';

class API {
  api = axios.create({
    baseURL: 'https://account-bot.com/app',
  });

  getMedsByIDs(meds) {
    return this.api.post(`/API.php`, {
      method: 'get_meds',
      meds: meds,
    });
  }

  search(keyword, page) {
    return this.api.post(`/API.php`, {
      method: 'search_product',
      keyword: keyword,
      page: page,
    });
  }

  getAlternatives(products) {
    return this.api.post(`/API.php`, {
      method: 'get_alternatives',
      products: products,
    });
  }

  createUser(userData) {
    return this.api.post(`/API.php`, {
      method: 'create_user',
      userData: userData,
    });
  }

  authorize(userData) {
    return this.api.post(`/API.php`, {method: 'auth', userData: userData});
  }

  getPharmacies(meds, location, all) {
    return this.api.post(`/API.php`, {
      method: 'get_pharmacies',
      meds: meds,
      all: all,
      location: location,
    });
  }

  getRecipes(phone) {
    return this.api.post(`/API.php`, {
      method: 'get_prescriptions',
      Phone: phone,
    });
  }

  sendSMS(phone) {
    return this.api.post(`/API.php`, {method: 'send_sms', phone: phone});
  }

  checkSMS(phone, code) {
    return this.api.post(`/API.php`, {
      method: 'check_sms',
      phone: phone,
      code: code,
    });
  }

  deleteRecipe(phone, id) {
    return this.api.post(`/API.php`, {
      method: 'delete_prescription',
      phone: phone,
      id: id,
    });
  }

  addRecipe(phone, name, meds) {
    return this.api.post(`/API.php`, {
      method: 'add_prescription',
      Phone: phone,
      Name: name,
      Meds: meds,
    });
  }
}

export default new API();
