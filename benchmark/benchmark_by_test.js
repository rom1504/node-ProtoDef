var testData=require("../test/dataTypes/prepareTests").testData;
var proto=require("../test/dataTypes/prepareTests").proto;
var Benchmark = require('benchmark');

function testValue(type,value,buffer)
{
  it('writes',function(){
    var suite = new Benchmark.Suite;
    suite.add('writes', function() {
        proto.createPacketBuffer(type,value);
      })
      .on('cycle', function(event) {
        console.log(String(event.target));
      })
      .run({ 'async': false });
  });
  it('reads',function(){
    var suite = new Benchmark.Suite;
    suite.add('read', function() {
        proto.parsePacketBuffer(type,buffer)
      })
      .on('cycle', function(event) {
        console.log(String(event.target));
      })
      .run({ 'async': false });
  });
}

function testType(type,values)
{
  values.forEach((value) => {
    if(value.description)
      describe(value.description,() => {
        testValue(type,value.value,value.buffer);
      });
    else
      testValue(type,value.value,value.buffer);
  });
}

testData.forEach(tests => {
  describe(tests.kind,function(){
    this.timeout(1000*60*10);

    tests.data.forEach(test => {
      describe(test.type,() => {
        test.subtypes.forEach((subtype) => {
          if(subtype.description)
            describe(subtype.description,() => {
              testType(subtype.type,subtype.values);
            });
          else
            testType(subtype.type,subtype.values);
        });
      });
    });
  });
});

