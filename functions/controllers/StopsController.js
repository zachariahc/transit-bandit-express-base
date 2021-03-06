const express = require('express');
const Stops = require('../models/Stops');
const router = express.Router();
const errorMsgs =  require('../private.js');

router.get('/walrus',(req,res)=>{
  return res.status(200).send('woof')
})

router.post('/', (req, res) => {
  console.log(req.body)
  Stops.insertMany(req.body.Stops, (err, stops) => {
    if (err) {
      return res.status(500).send(errorMsgs.postBad);
    } else {
      return res.status(200).send(stops);
    }
  })
});

// RETRIEVES ALL STOPS FROM DB
router.get('/', (req, res) => {
  Stops.find({}, function (err, stops) {
    if (err) {
      return res.status(500).send(errorMsgs.getAllBad);
    } else {
      return res.status(200).send(stops);
    }
  }).sort({_id: 'asc'});
});
// BRINGS FIRST 5 RESULTS AT A TIME FOR TESTING
router.get('/firstfive', (req, res) => {
  Stops.find({})
  .skip((1-1)*200)
  .limit(200)
  .exec(function (err, stops) {
    if (err) {
      return res.status(500).send(errorMsgs.getAllBad);
    } else {
      return res.status(200).send(stops);
    }
  })
});
// BRINGS ONE PAGE OF FIVE  RESULTS FROM THE DB AT A TIME
router.get('/paginate/:page/:numResults',(req,res)=>{
  console.log(req.params)
  if (req.params.page) {
    req.params.page = parseInt(req.params.page)
  }
  if (req.params.numResults) {
    req.params.numResults = parseInt(req.params.numResults)
  }
  let myResponseObj = {};
  Stops.find({}).limit(req.params.numResults).skip((req.params.page*req.params.numResults) - req.params.numResults).sort({_id: 'asc'}).exec((err,stops)=>{
    Stops.count().exec(function (err, count) {
      myResponseObj.stops = stops;
      myResponseObj.count = count;
      return res.status(200).send(myResponseObj);
    })
  })
})
// GETS RANDOM STOP FROM DB
router.get('/random', (req, res) => {
   Stops.aggregate([{
      $sample: {size: 1}},
      {$match: {'stop_id': {$exists: true}}}],
      (err, stop) => {
        if (err) {
        console.log(err);
        res.status(500).send(errorMsgs.getShowAllStopsBad)
        } else {
        res.status(200).send(stop[0]);
      }
    });
});
// SHOWS ALL STOPS WITH A UNIQUE NAME
router.get('/showallstopnames', (req, res) => {
   Stops.find({}).distinct("stop_name", (err, stops) => {
       if (err) {
       console.log(err);
       res.status(500).send(errorMsgs.getShowAllStopsBad)
       } else {
       res.status(200).send(stops);
     }
   });
});
// GETS STOP BY MONGOOSE ID
router.get('/:id', (req, res) => {
  Stops.findById({_id: req.params.id}, (err, stop) => {
    if (err) {
      if (err) return res.status(500).send(errorMsgs.getByIdBad);
    } else {
      res.status(200).send(stop)
    }
  });
});
// GETS STOP BY LATITUDE
router.get('/getbystoplat/:stop_lat', (req, res) => {
  console.log(req.params)
  Stops.find({stop_lat: req.params.stop_lat}, (err, stopByLon) => {
     if (err) {
       return res.status(500).send(errorMsgs.deleteByIdBad);
     } else {
      res.status(200).send(stopByLon);
    }
  });
});
// THIS BRINGS BACK A LIMITED SEARCH RESULT GREATER THAN ONE SET OF COORDINATES
router.get('/getbystopbycords/stops', (req, res) => {
  console.log(req.params)
  Stops.find(
{ $and:[
  {stop_lat : { $gt: req.headers.stop_lat}, stop_lon : { $lt: req.headers.stop_lat}},
//     {stop_lat : { $lt: 41.8400000}, stop_lon : { $lt: -105.99175249999999}}
  ]}).limit(50).exec( (err, stops) => {
     if (err) {
       return res.status(500).send(errorMsgs.deleteByIdBad);
     } else {
      res.status(200).send(stops);
    }
  });
});

router.get('/getbystopbycords/bounds', (req, res) => {
  console.log(req.params)
  Stops.find(
{ $and:[
    {ne_lat : { $gt: req.headers.ne_lat}, ne_lon : { $gt: req.headers.ne_lon}},
    {se_lat : { $lt: req.headers.se_lat}, se_lon : { $lt: req.headers.se_lon}},
    {sw_lat : { $lt: req.headers.sw_lat}, se_lon : { $lt: req.headers.sw_lon}},
    {nw_lat : { $lt: req.headers.nw_lat}, se_lon : { $lt: req.headers.nw_lon}},
  ]}).limit(50).exec( (err, stops) => {
     if (err) {
       return res.status(500).send(errorMsgs.deleteByIdBad);
     } else {
      res.status(200).send(stops);
    }
  });
});
// BRINGS BACK A LIMITED SET OF LAT/LONG PASSING IN CORDS FROM FRONT
router.get('/getbystopbycords', (req, res) => {
  // req.body: {
  //  loc1: {lat: xxx, long: xxx},
  //  loc2: {lat: xxx, long: xxx}
  // }
  const {loc1, loc2} = req.body;
  console.log(req.params)
  Stops.find(
{ $and:[
    {stop_lat : { $gt: loc1.lat}, stop_lon : { $gt: loc1.long}},
    {stop_lat : { $lt: loc2.lat}, stop_lon : { $lt: loc2.long}}
    ]}, (err, stops) => {
     if (err) {
       return res.status(500).send(errorMsgs.deleteByIdBad);
     } else {
      res.status(200).send(stops);
    }
  });
});
// GETS STOP BY SPECIFIC STOP ID
router.get('/getbystopid/:stop_id', (req, res) => {
  console.log(req.params)
  Stops.findOne({stop_id: req.params.stop_id}, (err, stopById) => {
     if (err) {
       return res.status(500).send(errorMsgs.deleteByIdBad);
     } else {
      res.status(200).send(stopById);
    }
  });
});
// GETS STOP BY SPECIFIC STOP NAME
router.get('/getbystopname/:stop_name', (req, res) => {
  console.log(req.params)
  Stops.find({stop_name: req.params.stop_name}, (err, stopByName) => {
     if (err) {
       return res.status(500).send(errorMsgs.deleteByIdBad);
     } else {
      res.status(200).send(stopByName);
    }
  });
});
// GETS ALL STOPS BY DIRECTION EX. EAST, WEST...
router.get('/getstopsbydirection/:stop_desc', (req, res) => {
  
  console.log(req.params)
  Stops.find({stop_desc: req.params.stop_desc}, (err, stopByName) => {
     if (err) {
       return res.status(500).send(errorMsgs.deleteByIdBad);
     } else {
      res.status(200).send(stopByName);
    }
  });
});
// DELETES A STOP BY STOP NAME
router.delete('/deletebystopname/:stop_name', (req, res) => {
  console.log(req.params)
  Stops.remove({stop_name: req.params.stop_name}, (err, stop) => {
     if (err) {
       return res.status(500).send(errorMsgs.deleteByIdBad);
     } else {
      res.status(200).send(stop + errorMsgs.deleteByIdGood);
    }
  });
});
// DELETES STOPS BY STOP DIRECTION EX. ALL EAST, WEST...
router.delete('/deletebytitle/:stop_desc', (req, res) => {
  console.log(req.params)
  Stops.remove({stop_desc: req.params.stop_desc}, (err, stop) => {
     if (err) {
       return res.status(500).send(errorMsgs.deleteByIdBad);
     } else {
      res.status(200).send(stop + errorMsgs.deleteByIdGood);
    }
  });
});
// UPDATES A STOP BY SPECIFIC MONGO ID
router.put('/:id', function (req, res){
  Stops.findByIdAndUpdate(req.params.id, req.body,
 {new: true},
 (err, stop) => {
   if(err) {
     return res.status(500).send(errorMsgs.putByIdBad);
 } else {
   return res.status(200).send(stop);
 }
})
});

// ROUTE USED TO CLEAR ENTIRE DB. FOR EMERGENCY USE ONLY!

// router.delete('/removeAll', (req, res) => {
//   Stops.deleteMany({}, (err, stops) => {
//     if (err) {
//       res.status(500).send(errorMsgs.deleteRemoveAllBad);
//     } else {
//       res.status(200).send(errorMsgs.deleteRemoveAll);
//     };
//   });
// });



module.exports = router;
