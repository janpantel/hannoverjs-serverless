const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.createMeetup = (event, context, callback) => {
    const data = JSON.parse(event.body) || {};
    var meetup = {
        id: uuid()
    };

    if (!data.name) {
        return callback(null, { statusCode: 400, body: 'Missing meetup name' });
    }
    meetup.name = data.name;

    if (!data.date) {
        return callback(null, { statusCode: 400, body: 'Missing event date' });
    } else if (isNaN(Date.parse(data.date))) {
        return callback(null, { statusCode: 400, body: 'No valid date given' });
    }
    meetup.date = data.date;

    dynamo.put({ TableName: "meetups", Item: meetup }, (err) => {
        if (err) {
            console.log("error persisting meetup: ", err);
            return callback(err);
        }
        return callback(null, { statusCode: 200, body: JSON.stringify(meetup) });
    });
};
