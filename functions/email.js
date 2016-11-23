const AWS = require('aws-sdk');
const async = require('async');
const ses = new AWS.SES();

const SOURCE_EMAIL = 'addrandom@emailherebefore.deploy';

module.exports.sendSpeakersEmail = (event, context, callback) => {
    async.each(event.Records, (record, cb) => {
        if (record.eventName != 'INSERT') {
            return;
        }

        // here we might want to check whether this email was already send... will omit this here
        // in sake of complexity
        const rec = record.dynamodb.NewImage;
        // we can also fetch the meetup here... but again let's skip that in sake of complexity.
        const text = 'Hey ' + rec.name.S + ',\n we are writing you that your talk about ' +
            rec.title.S + ' is now registered for meetup ' + rec.meetup_id.S + '!';

        ses.sendEmail({
            Destination: {
                ToAddresses: [ rec.email.S ]
            },
            Message: {
                Body: {
                    Text: {
                        Data: text
                    }
                },
                Subject: {
                    Data: 'Your meetup talk!'
                }
            },
            Source: SOURCE_EMAIL,
        }, (err, data) => {
            if (err) {
                console.log('error sending email:', err);
                return cb(err);
            }
            console.log('successfully sent email');
            return cb();
        });
    }, callback);
};
