var build = require('..');
var test = require('tape');
var through = require('through2');
var vm = require('vm');

test('entry', function (t) {
  t.plan(2);
  var tr = through.obj();
  var b = build();
  var rows = {};
  tr.pipe(b).pipe(through.obj(function (row, enc, cb) {
    rows[row.name] = row;
    cb();
  }, function () {
    var src = rows.common.source.toString('utf8');
    src += rows.x.source.toString('utf8');
    src += rows.y.source.toString('utf8');
    vm.runInNewContext(src, { t: t });
  }));
  tr.write({name: 'x', main: __dirname + '/entry/x.js' });
  tr.write({name: 'y', main: __dirname + '/entry/y.js' });
  tr.end();
});

