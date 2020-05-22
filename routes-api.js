const Categories = require('./app/api/categories');
const Pois = require('./app/api/poi');

module.exports=[
  { method: 'GET', path: '/api/pois', config: Pois.find },
  { method: 'GET', path: '/api/pois/{id}', config: Pois.findOne },
  { method: 'POST', path: '/api/pois', config: Pois.create },
  { method: 'DELETE', path: '/api/pois/{id}', config: Pois.deleteOne },
  { method: 'DELETE', path: '/api/pois', config: Pois.deleteAll },

  { method: 'GET', path: '/api/categories', config: Categories.find },
  { method: 'GET', path: '/api/categories/{id}', config: Categories.findOne },
  { method: 'POST', path: '/api/categories', config: Categories.create },
  { method: 'DELETE', path: '/api/categories/{id}', config: Categories.deleteOne },
  { method: 'DELETE', path: '/api/categories', config: Categories.deleteAll },
];