const test = require('ava');
const fetch = require('fetch').fetchUrl;
const tools = require('./.tools.js');

test.cb('meetups can not be created without name', t => {
    const body = {
        date: "2017-01-01T00:00:00.000Z"
    };
    fetch(tools.apiUrl('/meetup'), { method: 'POST', payload: JSON.stringify(body) }, (err, meta, body) => {
        t.ifError(err, "error executing meetup creation");
        t.is(meta.status, 400);
        t.end();
    });
});

test.cb('meetups can not be created without date', t => {
    const body = {
        name: "hannover js"
    };
    fetch(tools.apiUrl('/meetup'), { method: 'POST', payload: JSON.stringify(body) }, (err, meta, body) => {
        t.ifError(err, "error executing meetup creation");
        t.is(meta.status, 400);
        t.end();
    });
});

test.cb('meetups can be created', t => {
    const body = {
        name: "hannover js",
        date: "2017-01-01T00:00:00.000Z"
    };
    fetch(tools.apiUrl('/meetup'), { method: 'POST', payload: JSON.stringify(body) }, (err, meta, body) => {
        t.ifError(err, "error executing meetup creation");
        t.is(meta.status, 200, body);
        t.end();
    });
});

test.cb('meetups list can be retrieved', t => {
    const meetup = {
        name: "hannover js",
        date: "2017-01-01T00:00:00.000Z"
    };
    fetch(tools.apiUrl('/meetup'), { method: 'POST', payload: JSON.stringify(meetup) }, (err, meta, body) => {
        t.ifError(err, "error executing meetup creation");
        t.is(meta.status, 200, body);

        fetch(tools.apiUrl('/meetup'), (err, meta, body) => {
            t.ifError(err, 'error retrieving meetup list');
            t.is(meta.status, 200);

            const payload = JSON.parse(body) || {};
            t.truthy(payload.items.length, 'not enough items');

            t.end();
        });
    });
});
