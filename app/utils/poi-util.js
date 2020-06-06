'use strict';

const Poi = require('../models/poi');
const ImageStore = require('../utils/image-store');
const User = require('../models/user');
const Location = require('../models/location');
/*
Methods needed for Point of Interest
*/

const PoiUtil = {

    /* Method for deleting a POI, by deleting all images first and
     decrementing the number of pois for the user and finally
      deleting  the POI */
    deletePoi: async function (poi_id)
    {
        try
        {
            // const poi = await Poi.findOne({ _id: poi_id }).populate('user').populate('location').populate('image').lean()
            const poi = await Poi.findById(poi_id).populate('image').populate('user').populate('location').lean();

            // Delete the location object
            const location_id = poi.location._id;
            let response = await Location.deleteOne({ _id: location_id });
            if (response.deletedCount != 1) {
                return Boom.notFound('id not found');
            }

            // Reduce the number of pois the user has
            const user_id = poi.user._id;
            const user = await User.findOne({ _id: user_id });
            let numOfPoi = user.numOfPoi;
            user.numOfPoi = numOfPoi - 1;
            await user.save();

            // delete all images from the poi
            const images = poi.image;
            if (images.length > 0)
            {
                let i;
                for (i = 0; i < images.length; i++)
                {
                    let image_id = images[i]._id;
                    const response = await ImageStore.deleteImage(poi_id, image_id);
                }
            }
            response = await Poi.deleteOne({ _id: poi_id });
            return response;
        } catch (e)
        {
            console.log("Deletion of Point Of Interest Error: " + e);
        }
    },
};

module.exports = PoiUtil;
