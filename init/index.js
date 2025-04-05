require('dotenv').config();
const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const dbUrl = process.env.ATLASDB_URL;

main()
.then(console.log('connected'))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

data = [];

const addGeometry = async () => {
  for(listing of initData.data){
    let response = await geocodingClient.forwardGeocode({
    query: `${listing.location},${listing.country}`,
    limit: 1
    }).send()
    listing.geometry = response.body.features[0].geometry;
    data.push(listing);
  }
}


const initDB = async () => {
  await addGeometry();
  await Listing.deleteMany({});
  data = data.map((obj) => ({...obj, owner: '67f02b504fd96195eb356024'}));
  await Listing.insertMany(data);
  console.log('data added');
}

initDB();