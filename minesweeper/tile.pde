class tile {
  private int x;
  private int y;
  private static final int w = 30;
  private static final int h = 30;
  private String type = "0";
  private PImage img;
  private boolean clicked = false;
  private boolean flagged = false;
  tile(int tx, int ty) {
    x = tx;
    y = ty;
  }
  void setType(String t) {
    type = t;
  }
  void drw() {
    if (flagged) {
      img = flag;
    } else if (!clicked) {
      img = covered;
    } else if (type == "Bomb") {
      img = Bomb;
    } else img = nums[int(type)];
    image(img, x*w, y*h, w, h);
  }
  boolean hasPoint(int tx, int ty) {
    return tx > x*w && tx <= x*w+w && ty > y*h && ty <= y*h+h;
  }
  boolean click() {
    if (flagged) return false;
    minefield.checkWin();
    clicked = true;
    return type == "Bomb";
  }
  boolean isBlank() {
    return type=="0";
  }
  String getType() {
    return type;
  }
  PVector getPosition() {
    return new PVector(x, y);
  }
  boolean uncovered() {
    return clicked;
  }
  boolean isFlagged() {
    return flagged;
  }
  void toggleFlag() {
    flagged = !flagged;
  }
}
