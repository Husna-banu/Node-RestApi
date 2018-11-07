const assert = require('chai').assert;
const app = require('../server');
var fs = require('fs');
var supertest = require('supertest');
var should = require('should');

//port where program is running
var server = supertest.agent("http://localhost:3001");

describe('Restful api test',function(){
  it('Should return product of two numbers',function(done){
    server
    .get("/product")
    .send({param1:2,param2:4})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.error.should.equal(false);
      res.body.data.should.equal(8);
      done();
    });
  });

  it('Should return non repeating character of the given string',function(done){
    server
    .get("/string")
    .send({str:"husna"})
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.error.should.equal(false);
      res.body.data.should.equal('The first non repeating character in the string husna is h');
      done();
    });
  });

  it('Should return the links of the given domain',function(done){
     this.timeout(10000);
    server
    .get("/webcrawler")
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err,res){
      res.status.should.equal(200);
      res.body.error.should.equal(false);
      setTimeout(function(){
        done();
      },5000)
    //  done();
    });
  });
});
