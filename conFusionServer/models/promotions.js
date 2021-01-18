const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/* mongoose-currency no longer works so I did not import it */

var promoSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    /* mongoose-currency no longer works so I just used the Number Type */
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Promos = mongoose.model('Promo', promoSchema);

module.exports = Promos;