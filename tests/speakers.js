const test = require('ava');
const fetch = require('fetch').fetchUrl;
const tools = require('./.tools.js');

const email = 'randomaddress@randomemailaddress.com';

var meetupId = null;

test.before.cb('create a meetup to register to', t => {
    const body = {
        name: "hannover js",
        date: "2017-01-01T00:00:00.000Z"
    };
    fetch(tools.apiUrl('/meetup'), { method: 'POST', payload: JSON.stringify(body) }, (err, meta, body) => {
        t.ifError(err, "error executing meetup creation");
        t.is(meta.status, 200, body);
        const payload = JSON.parse(body) || {};
        t.truthy(payload.id, 'meetup id is not given');
        meetupId = payload.id;
        t.end();
    });
});

test.cb('speaker creation fails without name', t => {
    const speaker = {
        title: 'Serverless rocks!',
        email: email
    };
    fetch(
        tools.apiUrl('/meetup/' + meetupId + '/speaker'),
        { method: 'POST', payload: JSON.stringify(speaker) },
        (err, meta, body) => {
            t.ifError(err, "error executing speaker creation");
            t.is(meta.status, 400, body);

            t.end();
        }
    );
});

test.cb('speaker creation fails without title', t => {
    const speaker = {
        name: 'JOP',
        email: email
    };
    fetch(
        tools.apiUrl('/meetup/' + meetupId + '/speaker'),
        { method: 'POST', payload: JSON.stringify(speaker) },
        (err, meta, body) => {
            t.ifError(err, "error executing speaker creation");
            t.is(meta.status, 400, body);

            t.end();
        }
    );
});

test.cb('speaker creation fails without email', t => {
    const speaker = {
        name: 'JOP',
        title: 'Serverless rocks!'
    };
    fetch(
        tools.apiUrl('/meetup/' + meetupId + '/speaker'),
        { method: 'POST', payload: JSON.stringify(speaker) },
        (err, meta, body) => {
            t.ifError(err, "error executing speaker creation");
            t.is(meta.status, 400, body);

            t.end();
        }
    );
});

test.cb('speakers can be created', t => {
    const speaker = {
        name: 'JOP',
        title: 'Serverless rocks!',
        email: email
    };
    fetch(
        tools.apiUrl('/meetup/' + meetupId + '/speaker'),
        { method: 'POST', payload: JSON.stringify(speaker) },
        (err, meta, body) => {
            t.ifError(err, "error executing speaker creation");
            t.is(meta.status, 200);
            const payload = JSON.parse(body) || {};
            t.is(payload.name, speaker.name);
            t.is(payload.title, speaker.title);
            t.is(payload.email, speaker.email);

            t.end();
        }
    );
});

test.cb('speakers by meetup returns 404', t => {
    fetch(tools.apiUrl('/meetup/wrong_meetup_id/speaker'), (err, meta, body) => {
        t.ifError(err, 'error during speaker retrieval');
        t.is(meta.status, 404, body);
        t.end();
    });
});

test.cb('speakers can be retrieved by meetup', t => {
    const speaker = {
        name: 'JOP',
        title: 'Serverless rocks!',
        email: email
    };
    fetch(
        tools.apiUrl('/meetup/' + meetupId + '/speaker'),
        { method: 'POST', payload: JSON.stringify(speaker) },
        (err, meta, body) => {
            t.ifError(err, "error executing speaker creation");
            t.is(meta.status, 200);
            const payload = JSON.parse(body) || {};

            fetch(tools.apiUrl('/meetup/' + meetupId + '/speaker'), (err, meta, body) => {
                t.ifError(err, "error during speaker retrieval");
                t.is(meta.status, 200);
                const speakers = JSON.parse(body) || {};
                t.truthy(speakers.items.length, 'missing speakers');

                t.end();
            });
        }
    );
});
