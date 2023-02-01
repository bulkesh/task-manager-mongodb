const mongodb = require('mongodb');
const ObjectId = mongodb.ObjectId;
const MongoClient = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';


const creatData = (db) => {
    /* db.collection('users').insertOne({
        name: 'Bulkesh Kumawat',
        age: 38
    }) */
    db.collection('users').insertMany([
        {
            name: "Ram",
            age: 10
        },
        {
            name: 'Shyam',
            age: 7
        }
    ])
        .then((resp) => {
            console.log("Successfully : ", resp)
        })
        .catch((err) => {
            console.log("err : ", err)
        });


}

const readData = (db) => {
    /*db.collection('users').findOne({
            _id: new ObjectId("63d4da52dc804f2bdef76110")
        })
        .then((record) => {
            console.log("record : ", record);
        })*/
    db.collection('users').find({ age: 10 }).toArray()
        .then((record) => {
            console.log("records : ", record);
        });

}
const updateData = (db) => {
    const filter = { _id: new ObjectId("63d4d8f3ec5f31d8720f165d") };
    const updateRecord = {
        $set: {
            age: 34
        }
    }
    db.collection('users').updateOne(filter, updateRecord)
        .then((result) => {
            console.log("result : ", result);
        })
        .catch((err) => {
            console.log("Error -->: ", err);
        })
}

const deleteData = (db) => {
    const query = { _id: new ObjectId("63d50c9dc30f1f2a7fabd3dc") };
    const query1 = { name: "Ram" };
    //db.collection('users').deleteOne(query)
    db.collection('users').deleteMany(query1)
        .then((result) => {
            console.log("result : ", result);
        })
        .catch((err) => {
            console.log("Error -->: ", err);
        })
}
const connectToDatabase = () => {
    MongoClient.connect(connectionUrl, { useNewUrlParser: true })
        .then((client) => {
            const db = client.db(databaseName);
            //CRUD - Operations---
            creatData(db);
            //readData(db);
            //updateData(db);
            //deleteData(db);
        })
        .catch((err) => {
            console.log("Error :", err);
            return;
        })
        .finally();
}
connectToDatabase();


