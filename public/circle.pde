// Global variables
float radius = 50.0;
int X, Y;
int nX, nY;
int delay = 1;

// Distance calculation
float distance;

int points = 12;  // Number of points in graph

Graph[] ring1;

// Setup the Processing Canvas
void setup(){
  size( 400, 400 );
  strokeWeight( 2 );
  frameRate( 30 );
  smooth();
  //noLoop();
  X = width / 2;
  Y = height / 2;
  nX = X;
  nY = Y;

  ring1 = new Graph(points);
  //println( JSON.stringify(ring1, censor(ring1)));
  //println( ring1.points );
}

// Main draw loop
void draw(){

  radius = radius + sin( frameCount / 4 );

  // Track circle to new destination
  X+=(nX-X);
  Y+=(nY-Y);

  background( 33 );                // Fill canvas grey
  ring1.display();                  // Show ring outline

  fill( fillR, fillG, fillB );      // Set fill-color to blue
  stroke(255);                      // Set stroke-color white
  ellipse( X, Y, radius, radius );  // Draw circle

  // Find nearest point
  nearest = 0;
  distance = width;
  if( ring1.points.length > 0){
    for( var i=0; i<ring1.points.length; i++){
      var pt = ring1.points[i];
      var away = dist(pt.x, pt.y, mouseX, mouseY);
      if( away < distance){
        nearest = i;
        distance = away;
      }
    }

    //println(nearest);
    //println( nearest, distance);
  }
}


// Set circle's next destination
void mouseMoved(){
  nX = mouseX;
  nY = mouseY;
}

// Handle mobile touch
void touchMove(TouchEvent touchEvent) {
  // Which end of this array is the most recent?
  for (int i = 0; i < touchEvent.touches.length; i++) {
    nX = touchEvent.touches[i].offsetX;
    ny = touchEvent.touches[i].offsetY;
  }
}

class Point {
  int x,y;
  Point(int x, int y) { this.x=x; this.y=y; point(x,y); }
}

class Graph {
  float x, y, radius;
  int numPoints = 12;
  Point[] points;

  ArrayList getPoints(){ return points; }

  Graph() {
    x = width/2;
    y = height/2;
    radius = width/3;
    points = new Point[numPoints];
  }

  Graph(int setPoints){
    x = width/2;
    y = height/2;
    radius = width/3;
    numPoints = setPoints;
    points = new Point[numPoints];
  }

  Graph(int numPoints, float xpos, float ypos, float r){
    x = xpos;
    y = ypos;
    radius = r;
    points = new Point[numPoints];
  }

  void display() {
    for(var i = 0; i < numPoints; i++) {
      var pX = x + radius * Math.cos(2 * Math.PI * i / numPoints);
      var pY = y + radius * Math.sin(2 * Math.PI * i / numPoints);
      this.points[i] = new Point(pX,pY);
    }

    //println(points[0].x, points[0].y);\
  }
}
