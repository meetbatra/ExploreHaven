const User = require('../models/user.js');
const Listing = require('../models/listing.js');
const Booking = require('../models/booking.js');

let calculateNights = (from, to) => {
    const start = new Date(from);
    const end = new Date(to);
  
    const timeDiff = end.getTime() - start.getTime();
    const nights = Math.floor(timeDiff / 86400000);
  
    return nights;
}

module.exports.renderSignupForm = (req,res) => {
    res.render('users/signup.ejs');
};

module.exports.signup = async (req,res) => {
    try{
        let{email, username, password} = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err){
                return next(err);
            }
            req.flash('success', 'Welcome to ExploreHaven');
            res.redirect('/listings');
        });
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

module.exports.renderLoginForm = (req,res) => {
    res.render('users/login.ejs');
};

module.exports.login = async (req,res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.redirectUrl || '/listings';
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res) => {
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash('success', 'Logged out!');
        res.redirect('/listings');
    });
};

module.exports.dashboard = async (req,res) => {
    const user = res.locals.currUser;
    const userListings = await Listing.find({owner: user._id});
    const userBookings = await Booking.find({user: user._id}).populate('listing');
    res.render('users/dashboard.ejs', {userListings, userBookings});
};

module.exports.renderBookingForm = async (req,res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('users/book.ejs', {listing});
}

module.exports.booking = async (req,res) => {
    let {from,to} = req.body.booking;
    const listing = await Listing.findById(req.params.id);
    const nights = calculateNights(from, to);
    const newBooking = new Booking({
        user: res.locals.currUser._id,
        listing: listing._id,
        from,
        to,
        price: listing.price*nights
    });
    await newBooking.save();
    req.flash('success', 'Booked! Enjoy your stay traveller');
    res.redirect(`/listings/${req.params.id}`);
}