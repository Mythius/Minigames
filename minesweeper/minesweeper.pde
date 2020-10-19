board minefield; 
boolean playing = true;
boolean mouseDown = false;
boolean win = false;
PImage Bomb, flag, covered;
PImage[] nums = new PImage[10]; // Array of number Images
void setup() {
  playing = true;
  mouseDown = false;
  // Size = 30 * 15 = 450
  // 30 is the width / height of tiles see tile.w, tile.h
  background(0);
  size(450, 500);
  minefield = new board();
  for (int i=0; i<9; i++) {
    nums[i] = loadImage(i+".png");
  }
  Bomb = loadImage("Bomb.png");
  covered = loadImage("covered.png");
  flag = loadImage("flagged.png");
  textSize(32);
}
void draw() {
  clear();
  minefield.drw();
  handleControls();
  if (!mousePressed) {
    mouseDown = false;
  }
  int flags = 49 - (15 * 15 - minefield.getUnflagged());
  
  if(!playing) text("You "+(win?"win":"lose"),80,485);
  fill(255,255,0);
  text(flags, 10, 485); 
  fill(255, 0, 0);
  
  
}
void handleControls() {
  if (mousePressed && playing) {
    if (mouseButton == LEFT) minefield.clickOn(mouseX, mouseY);
    if (mouseButton == RIGHT) {
      if (!mouseDown) {
        minefield.flag(mouseX, mouseY);
        mouseDown =true;
      }
    }
  }
  if(keyPressed && key == ' ') setup(); 
}
