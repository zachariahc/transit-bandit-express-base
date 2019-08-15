// const admin = require('firebase-admin');
const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const mongoose  = require('mongoose');
const StopsController = require('./controllers/StopsController');
const TripsController = require('./controllers/TripsController');
const UsersController = require('./controllers/UsersController');
//CREATIVE LIBERTIES DISCLAIMERS
//in package.json "engines": {"node": "8"} was added so that async/await keywords could be used

//init firestore db
// admin.initializeApp({
//     credential: admin.credential.applicationDefault()
// });

const db = mongoose.connect('mongodb://transit:bandit1@ds117816.mlab.com:17816/transit-bandit', {
    useNewUrlParser: true
})

// mongodb://transit:bandit1@ds117816.mlab.com:17816/
const app = express();
app.use(cors({ origin: true }));
app.use('/stops', StopsController);
app.use('/trips', TripsController);
app.use('/users', UsersController);

//this is the only endpoint express handles the rest from here
const api = functions.https.onRequest((req, res) => {
    if (!req.path) {
        req.url = `/${req.url}` // prepend '/' to keep query params if any
    };
    return app(req, res);
});

// //library endpoints

// app.get("/", async (req, res) => {
//     //paginate w/ or w/o search results
//     //body or qStr to hold search data
//     var results = [];

//     querySnapshots = await db.collection('stops').get().catch(err => res.status(500).send(err));

//     for (let i = 0; i < querySnapshots.docs.length; i++) {
 
//         results.push(querySnapshots.docs[i].data());
//         // DESTRUCRTURE AND GET CERTAIN VALUES
//         // const {stop_desc,stop_name,zone_id } = querySnapshots.docs[i].data()
//         // let tempObj = {
//         //     stop_desc: stop_desc,
//         //     stop_name: stop_name,
//         //     zone_id: zone_id
//         // };
//         // results.push(tempObj);
//     }
//     res.status(200).send(results)

// });

// // app.post("/",(req, res) => {
//     //add array of books
//     //Unlike "push IDs" in the Firebase Realtime Database, Cloud Firestore auto-generated IDs do not provide any automatic ordering. 
//     //If you want to be able to order your documents by creation date, you should store a timestamp as a field in the documents.
//     // try {
//     //     const batch = db.batch();

//     //     req.body.books.forEach((book) => {
//     //         let booksRef = db.collection('library').doc();
//     //         batch.set(booksRef, book);
//     //     });

//     //     batch.commit().then(() => {
//     //         return res.status(200).send('successfully added books');
//     //     });
//     // } catch (error) {
//     //    return res.status(500).send(error);
//     // }
//     //SINGLE ADDS
//     // var docRef = await db.collection('library').add({
//     //     title: req.body.title,
//     //     author: req.body.author,
//     //     rating: req.body.rating,
//     //     synopsis: req.body.synopsis,
//     //     numPages: req.body.numPages,
//     //     pubDate: req.body.pubDate,
//     //     cover: req.body.cover
//     // }).catch((err)=>{return res.status(500).send(err);})
//     // return res.status(200).send(docRef.id);
// // });

// app.post("/",(req, res) => {
//     //add array of books
//     //Unlike "push IDs" in the Firebase Realtime Database, Cloud Firestore auto-generated IDs do not provide any automatic ordering. 
//     //If you want to be able to order your documents by creation date, you should store a timestamp as a field in the documents.
//     try {
//         const batch = db.batch();
//         req.body.books.forEach((book) => {
//             let booksRef = db.collection('stops').doc();
//             book.id = booksRef.path.replace(/library\//,""); //strips collection name off the path to grab the auto-generated id
//             batch.set(booksRef, book);
//         });
//         batch.commit().then(() => {
//             return res.status(200).send('successfully added books');
//         });
//     } catch (error) {
//        return res.status(500).send(error);
//     }
// });

// app.put("/update/:id", (req, res) => {
//     //update book by id
//     //body holds book-like object
//     db.collection('stops').doc(req.params).set(req.body)
//     .then((ref)=>{
//         return res.status(200).send(`has been updated.`) //TODO FIX RESPONSE VALUE
//     })
//     .catch((err)=>{return res.status(500).send(err)})
// });

// app.get("/random/:numResults", (req, res) => {
//     //get a random book by a provided numResults. 1 result if no numResults are provided.
//     //TODO firestore does not have a predefined random method. TODO
//     return res.send(
//         `get random! numResults: ${req.params.numResults}`
//     );
// });

// // app.get("/searchBy/",async (req, res) => {
// //     //search on title/author using qString
// //     //query limitation: Logical OR queries. In this case, you should create a separate query for each OR condition and merge the query results in your app.
// //     db.collection('library').where('title','==',req.query.title)
// //     db.collection('library').where('author','==',req.query.author)
// //     res.send(
// //         `get searchBy title/auth title: ${req.query.title}`
// //     );
// // });

// app.delete("/deleteBy/", (req, res) => {
//     //delete by title/author using qString
//     db.collection('stops').where('title','==',req.query.title).delete()
//     db.collection('stops').where('author', '==', req.query.author).delete()
//     return res.send(
//         `delete by title/auth title: ${req.query.title}`
//     );
// });

// app.get("/getById/:id", (req, res) => {
//     console.log(req.params)
//     //delete by id
//     db.collection('stops').doc(req.params.id).get()
//     .then((ref)=>{
//         return res.status(200).send(stops);
//     })
//     .catch((err)=>{
//         return res.status(500).send(err)
//     })
// });

// app.get("*", (req, res) => {
//     //add array of books
//     return res.send(
//         `Hi I'm an express route`
//     );
// });


module.exports = {
    api
};
