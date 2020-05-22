const Pois = require('./app/api/poi');

module.exports=[
  { method: 'GET', path: '/api/pois', config: Pois.find }
];