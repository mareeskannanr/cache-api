const Cache = require('../models/Cache');
const MAX_ITEM_VALUE = process.env.MAX_ITEM_VALUE || 10;
const ERROR_RESPONSE = {
    error: true,
    message: "Sorry, something went wrong!"
};

module.exports = {

    //create and modify cache data
    saveInfo(req, res) {

    },

    //retrive value by key
    retriveValueByKey(req, res) {

    },

    // this end point returns all stored keys in the cache
    async retriveAllKeys(req, res) {
        return await Cache.find({}, {key: 1}).toArray()
                        .then(data => res.status(200).json({keys: data}))
                        .catch(err => {
                            console.log(err);
                            res.status(500).json(ERROR_RESPONSE);
                        });
    },

    // this end point remove key from the cache using it's id
    async removeSingleKey(req, res) {
        return await Cache.deleteOne({key: req.params.key}).then(
            result => res.status(204).json({
                message: `Key ${req.params.key} removed from cache successfully!`
            })
        ).catch(err => {
            console.log(err);
            res.status(500).json(ERROR_RESPONSE)
        });
    },

    // this end point remove all the keys from the cache
    async removeAllKeys(req, res) {
        return await Cache.deleteMany({}).then(
            result => res.status(204).json({
                message: `All keys removed from cache successfully!`
            })
        ).catch(err => {
            console.log(err);
            res.status(500).json(ERROR_RESPONSE)
        });
    }
};