const express = require('express');
const fileupload = require('express-fileupload')
require('dotenv').config();
const kafka = require('kafka-node');
const HighLevelProducer = kafka.HighLevelProducer;
const Client = kafka.KafkaClient;

// Kafka Producer Class
class KafkaProducer {
    constructor(topic) {
      this.topic = topic;
      this.producer = null;
    }
  
    connect(callback) {
      const client = new Client();
      this.producer = new HighLevelProducer(client);
      callback();
    }
  
    send(message) {
      if (!this.producer) return;
      this.producer.send([
        {
          topic: this.topic,
          messages: [JSON.stringify(message)],
        }
      ],
        (err) => {
          if (err) {
            console.log('Error sending from kafka producer');
            console.log(err);
          }
        });
    }
  }
  // ----------


const producer = new KafkaProducer('jobWork');
producer.connect(() => console.log('connected to Kafka'));

const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
// const redis = require('redis');
// const client = redis.createClient({ host: process.env.REDIS_HOST || 'localhost' });

// monogo init
const url = process.env.MONGO_HOST || 'mongodb://localhost:27017';
const mongoClient = new MongoClient(url);
// const listingCollection = process.env.LISTING_COLLECTION;
mongoClient.connect((err) => {
    if (err) console.log(err);
    // const db = mongoClient.db(process.env.MONGOCLIENT_DB);
    // move app logic in here
    const app = express();
    app.use(bodyParser.json(), fileupload({
        limits: { fileSize: 50 * 1024 * 1024 },
    }));
    app.post('/imageService/process', (req, res) => {
        console.log(req.body.insertId)
        const obj = {
            image: req.body.imageFile,
            insertId: req.body.insertId
        }
        producer.send(obj)
        res.send('ok');
    });
    app.listen(process.env.IMAGE_SERVICE || 5003, () => console.log(`Image service on 5003`));
    // end app logic
});


