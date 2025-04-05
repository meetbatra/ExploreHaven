const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    listing: {
        type: Schema.Types.ObjectId,
        ref: 'Listing',
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    price: Number
});

module.exports = mongoose.model('Booking', bookingSchema);