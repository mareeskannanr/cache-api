const mongoose = require('mongoose');
const schema = mongoose.Schema;
const cacheSchema = new schema({
    key: {
        type: String,
        required: true,
        trim: true,
        dropDups: true
    },
    data: {
        type: String,
        required: [true, `Data can't be blank`],
        trim: true
    },
    no_of_hit: {
        type: Number
    },
    last_hit_time: {
        type: Date,
        default: Date.now 
    },
    ttl: {
        type: Date,
        default: Date.now 
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

const cacheModel = mongoose.model('cache', cacheSchema);

module.exports = cacheModel;

