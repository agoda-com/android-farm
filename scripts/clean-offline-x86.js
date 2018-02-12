#!/usr/bin/node

var r = require('rethinkdb')

r.connect({
  host: 'localhost',
  port: 28015,
  db: 'stf',
  authKey: 'rethinkdb'
}, function(err, conn) {
  if (err) throw err;

  r.table('devices')
    .filter(
      {
        abi: 'x86',
        present: false
      }
    )
    .delete()
    .run(conn, function(err, something) {
      if (err) throw err;

      conn.close();
      console.log('cleaned devices: ' + something['deleted']);
    });

});
