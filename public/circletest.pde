// All Examples Written by Casey Reas and Ben Fry

// unless otherwise stated.

Spot sp1, sp2;

void setup()

{

  size(200, 200);

  background(204);

  smooth();

  noLoop();

  // Run the constructor without parameters

  sp1 = new Spot();

  // Run the constructor with three parameters

  sp2 = new Spot(122, 100, 40);

}



void draw() {

  sp1.display();

  sp2.display();

  //background( 100 );                // Fill canvas grey
  //fill( fillR, fillG, fillB );              // Set fill-color to blue
  //stroke(255);                      // Set stroke-color white


}



class Spot {

  float x, y, radius;

  // First version of the Spot constructor;

  // the fields are assigned default values

  Spot() {

    x = 66;

    y = 100;

    radius = 16;

  }

  // Second version of the Spot constructor;

  // the fields are assigned with parameters

  Spot(float xpos, float ypos, float r) {

    x = xpos;

    y = ypos;

    radius = r;

  }

  void display() {

    ellipse(x, y, radius*2, radius*2);

  }

}