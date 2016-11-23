const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports.createSpeaker = (event, context, callback) => {
    const data = JSON.parse(event.body) || {};
    const meetupId = event.pathParameters.id;
    const name = data.name;
    const title = data.title;
    const email = data.email;

    if (!meetupId) {
        return callback(null, { statusCode: 400, body: 'Missing meetup id' });
    } else if (!name) {
        return callback(null, { statusCode: 400, body: 'Missing name' });
    } else if (!title) {
        return callback(null, { statusCode: 400, body: 'Missing title' });
    } else if (!email) {
        return callback(null, { statusCode: 400, body: 'Missing email' });
    }

    const speaker = {
        id: uuid(),
        meetup_id: meetupId,
        name: name,
        title: title,
        email: email
    };

    // If this was a real app you might want to check if the meetup id is existing in the meetups
    // table and if the email isn't registered yet. In sake of demo we will skip this for now.

    dynamo.put({ TableName: 'speakers', Item: speaker }, (err) => {
        if (err) {
            console.log('error writing speaker: ', err);
            return callback(err);
        }
        return callback(null, { statusCode: 200, body: JSON.stringify(speaker) });
    });
};

module.exports.getSpeakersByMeetup = (event, context, callback) => {
    const meetupId = event.pathParameters.id;

    if (!meetupId) {
        return callback(null, { statusCode: 400, body: 'Missing meetup id' });
    }

    dynamo.scan({
        TableName: 'speakers',
        FilterExpression: "#mi = :mi",
        ExpressionAttributeNames: {
            "#mi": "meetup_id",
        },
        ExpressionAttributeValues: {
             ":mi": meetupId
        }
    }, (err, data) => {
        if (err) {
            console.log('error getting speakers for meetup: ', err);
            return callback(err);
        }
        if (data.Items.length === 0) {
            return callback(null, { statusCode: 404, body: 'Not found!' });
        }
        return callback(null, { statusCode: 200, body: JSON.stringify({ items: data.Items }) });
    });
};
