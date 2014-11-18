/**
 * Created by jeremyt on 15/09/14.
 */

//to be replace by redis storage
var coords = {lat: 60.055447, long: 10.869426};

exports.getCoordinates = function() {

    return function (req, res) {
        res.status(200).json(coords);
    };
};

exports.updateCoordinates = function() {

    return function (req, res) {
        var lat = req.body.lat || '';
        var long = req.body.long || '';
        if (lat == '' || long == '') {
            res.status(400).end();
        }

        coords.lat = lat;
        coords.long = long;
        res.status(200).end();
    };
};