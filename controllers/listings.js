const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req,res) => {
    let listings = null;
    if(!res.locals.currUser){
        listings = await Listing.find({});
    }else{
        listings = await Listing.find({ owner: { $ne: res.locals.currUser._id } });
    }
    res.render('listings/index.ejs', {listings});
};

module.exports.renderNewForm = (req,res) => {
    res.render('listings/new.ejs');
};

module.exports.createListing = async (req,res) => {
    let response = await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1
    }).send()

    let geometry = response.body.features[0].geometry;

    let url = req.file.path;
    let filename = req.file.filename;


    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = { url, filename };
    listing.geometry = geometry;
    await listing.save();
    req.flash('success', 'Listing Created!');
    res.redirect('/listings');
};

module.exports.showListing = async (req,res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');
    
    if(!listing){
        req.flash('error', 'Listing does not exist');
        res.redirect('/listings')
    }
    
    res.render('listings/show.ejs', {listing});
};

module.exports.renderEditForm = async (req,res) => {
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Listing does not exist');
        res.redirect('/listings');
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace('/upload', '/upload/w_250');
    
    res.render('listings/edit.ejs', {listing, originalImageUrl});
};

module.exports.editListing = async (req,res) => {
    const {id} = req.params;
    if(!req.body.listing){
        req.flash('error', 'Listing does not exist');
        res.redirect('/listings');
    }
    
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    
    if(typeof req.file!=='undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res) => {
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    
    req.flash('success', 'Listing Deleted!');
    res.redirect('/listings');
};

module.exports.searchListing = async (req,res) => {
    let {key} = req.body;
    let listings = await Listing.find({
        $or: [
            { title: { $regex: key, $options: 'i'}},
            { location: { $regex: key, $options: 'i'}},
            { country: { $regex: key, $options: 'i'}}
        ]
    });

    if(res.locals.currUser){
        listings = listings.filter(l => !l.owner.equals(res.locals.currUser._id));
    }

    res.render('listings/index.ejs', {listings});
}