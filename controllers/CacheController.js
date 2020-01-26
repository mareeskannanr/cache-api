const Cache = require('../models/Cache');
const logger = require('winston');
const utils = require('../common/utils');
const ERROR_RESPONSE = {
    error: true,
    message: "Sorry, something went wrong!"
};

module.exports = {

    //create and modify cache data
    async saveInfo(req, res) {
        if(!req.body.key || !req.body.key.trim()) {
            return res.status(400).json({
                message: "key is required"
            });
        }

        if(!req.body.data || !req.body.data.trim()) {
            return res.status(400).json({
                message: "data is required"
            });
        }

        let result = await utils.saveInfo({...req.body});
        if(result === 'success') {
            return res.status(201).json({
                message: "data saved to the cache successfully!"
            });
        }

        return res.status(500).json(ERROR_RESPONSE);
    },

    //retrive value by key
    async retriveValueByKey(req, res) {
        if(!req.params.key || !req.params.key.trim()) {
            return res.status(400).json({
                message: "key is required"
            });
        }

        let data = await utils.getValueByKey(req.params.key);
        if(data == null) {
            return res.status(500).json(ERROR_RESPONSE);
        }
        
        return res.status(200).json({data});
    },

    // this end point returns all stored keys in the cache
    async retriveAllKeys(req, res) {
        return await Cache.find({}, {key: 1, _id: 0})
                        .then(data => res.status(200).json({keys: data.map(item => item.key)}))
                        .catch(err => {
                            logger.error(err);
                            res.status(500).json(ERROR_RESPONSE);
                        });
    },

    // this end point remove key from the cache using it's id
    async removeSingleKey(req, res) {
        return await Cache.deleteOne({key: req.params.key}).then(
            () => res.status(204).json({
                message: `Key ${req.params.key} removed from cache successfully!`
            })
        ).catch(err => {
            logger.error(err);
            res.status(500).json(ERROR_RESPONSE)
        });
    },

    // this end point remove all the keys from the cache
    async removeAllKeys(req, res) {
        return await Cache.deleteMany({}).then(
            () => res.status(204).json({
                message: `All keys removed from cache successfully!`
            })
        ).catch(err => {
            logger.error(err);
            res.status(500).json(ERROR_RESPONSE)
        });
    }
};