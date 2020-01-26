const router = require('express').Router;
const controller = require('../controllers/CacheController');

//health check
const routes = router().get("/", (req, res) => {
    res.json({
        message: "Application is UP!"
    });
});

//Cache API
const CACHE_API = '/api/caches';
routes.route(CACHE_API)
        .post(controller.saveInfo)
        .put(controller.saveInfo)
        .get(controller.retriveAllKeys)
        .delete(controller.removeAllKeys);

routes.route(`${CACHE_API}/:key`)
        .get(controller.retriveValueByKey)
        .delete(controller.removeSingleKey);

module.exports = routes;