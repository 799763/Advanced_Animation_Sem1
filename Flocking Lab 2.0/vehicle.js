function Vehicle(location){
  this.location = location;
  this.velocity = new JSVector(Math.random()*3, Math.random()*3);
  this.acceleration = new JSVector(0,0);
  // this.maxSpeed = 4;
  // this.maxForce = 0.1;
  this.desired = new JSVector(0,0);
  this.steer = new JSVector(0,0);
}

Vehicle.prototype.run = function(){
  this.flock(game.vehicles);
  this.update();
  this.render();
  this.checkEdges();
}

Vehicle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.velocity.limit(game.slider2.value);
  this.location.add(this.velocity);
}

Vehicle.prototype.render = function(){
  let ctx = game.ctx;
  ctx.save();
  ctx.translate(this.location.x, this.location.y);
  ctx.rotate(this.velocity.getDirection() + Math.PI/2);
  ctx.beginPath();
  ctx.fillStyle = "rgba(255, 75, 25)";
  ctx.strokeStyle = "rgba(255, 75, 25)";
  ctx.lineWidth = 1;
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

Vehicle.prototype.checkEdges = function(){
  // if(this.location.x < 0){
  //   this.velocity.x = -this.velocity.x;
  // }
  // if(this.location.x > game.canvas.width){
  //   this.velocity.x = -this.velocity.x;
  // }
  // if(this.location.y < 0){
  //   this.velocity.y = -this.velocity.y;
  // }
  // if(this.location.y > game.canvas.height){
  //   this.velocity.y = -this.velocity.y;
  // }


  if(this.location.x < 0){
    this.location.x = game.canvas.width;
  }
  if(this.location.x > game.canvas.width){
    this.location.x = 0;
  }
  if(this.location.y < 0){
    this.location.y = game.canvas.height;
  }
  if(this.location.y > game.canvas.height){
    this.location.y = 0;
  }
}

Vehicle.prototype.flock = function(vehicles){
  let sep = this.separate(vehicles);
  let ali = this.align(vehicles);
  let coh = this.cohesion(vehicles);

  // sep.multiply(1.5);
  // ali.multiply(1.0);
  // coh.multiply(1.0);
  sep.multiply(game.slider3.value);
  ali.multiply(game.slider4.value);
  coh.multiply(game.slider5.value);

  this.acceleration.add(sep);
  this.acceleration.add(ali);
  this.acceleration.add(coh);
}

Vehicle.prototype.separate = function(vehicles){
  let desiredSeparation = 25;
  let sum = new JSVector(0,0);
  let dist = new JSVector(0,0);
  for(let i = 0; i < vehicles.length; i++){
    let diff = JSVector.subGetNew(this.location, vehicles[i].location);
    dist = diff.getMagnitude();
    if((dist > 0) && (dist < desiredSeparation)){
      diff.normalize();
      sum.add(diff);
    }
  }
  return sum;
}

Vehicle.prototype.align = function(vehicles){
  let neighborDistance = 50;
  let sum = new JSVector(0,0);
  let count = 0;
  for(let i = 0; i < vehicles.length; i++){
    let dist = this.location.distance(vehicles[i].location);
    //let dist = JSVector.subGetNew(this.location, vehicles[i].location);
    if((dist > 0) && (dist < neighborDistance)){
      sum.add(vehicles[i].velocity);
      count++;
    }
  }
  if(count > 0){
    sum.divide(count);
    sum.normalize();
    sum.multiply(game.slider2.value);
    let steer = sum.sub(this.velocity);
    steer.normalize();
    steer.multiply(1.0);
    return(steer);
  }else{
    return(new JSVector(0,0));
  }
}//end of align function

Vehicle.prototype.cohesion = function(vehicles){
  let neighborDistance = 50;
  let sum = new JSVector(0,0);
  let count = 0;
  for(let i = 0; i < vehicles.length; i++){
    let dist = this.location.distance(vehicles[i].location);
    if((dist > 0) && (dist < this.neighborDistance)){
      sum.add(vehicles[i].location);
      count++
    }
  }
  //
  if(count > 0){
    sum.divide(count);
    return seek(sum);
  }else{
    return(new JSVector(0,0));
  }
}//end of cohesion functoin

Vehicle.prototype.seek = function(target){
  let desired = JSVector(0,0);
  desired.normalize();
  desired.multiply(game.slider2.value);
  let steer = desired.sub(this.vel);
  steer.limit(game.slider1.value);
  return steer;
}
