function Queue() {
  this.slot = [];
  this.produce = null;
  this.worker = 1;
  this.workerInuse = 0;
  this.debugFlag = false;
}

Queue.prototype.setProduce = function setProduce(func) {
  this.produce = func;
};

Queue.prototype.setNumberWorker = function setNumberWorker(num) {
  this.worker = num;
};

Queue.prototype.add = function add(object) {
  var self = this;
  self.slot.push(object);

  this.produceAJob();
};
Queue.prototype.setDebug = function setDebug(debugFlag) {
  this.debugFlag = debugFlag || false;
};

Queue.prototype.printLog = function printLog(text) {
  if (self.debugFlag) {
    console.log(text);
  }
};

Queue.prototype.produceAJob = function produceAJob() {
  var self = this;
  var aJob = self.callFirst();

  if (!self.produce) {
    self.printLog('no produce function!');
    return;
  }

  if (aJob === null) {
    self.printLog('no new work come (have ' + self.slot.length + ' wait in queue)');
    return;
  }

  if (self.workerInuse >= self.worker) {
    self.printLog('full work load, (have ' + self.slot.length + ' wait in queue)');
    return;
  }

  self.shiftFirst();
  self.printLog('processing a work, have ' + self.slot.length + ' wait in queue');
  self.workerInuse++;

  self.produce(aJob, function cbProduce(err, result) {
    self.workerInuse--;

    self.produceAJob();
  });
};

Queue.prototype.shiftFirst = function shiftFirst() {
  this.slot.shift();
};

Queue.prototype.callFirst = function callFirst() {
  var self = this;
  if (self.slot.length <= 0) {
    return null;
  }

  return self.slot[0];
};

module.exports = new Queue();
