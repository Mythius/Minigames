class board {
  final int w = 15;
  final int h = 15;
  final int bomb_count = Math.min(w*h,50); // amount of bombs: 50
  private tile[][] tiles = new tile[w][h];
  board() {
    for (int y=0; y<h; y++) {
      for (int x=0; x<w; x++) {
        tiles[x][y] = new tile(x, y);
      }
    }
    generateBombs(bomb_count);
    calculateNumbers();
  }
  private void generateBombs(int b) {
    for (int i=0; i<b; i++) {
      boolean generated = false;
      // Prevents multiple bombs being generated on top of each other
      while (!generated) {
        generated = generateBomb();
      }
    }
  }
  private boolean generateBomb() {
    int x = (int)random(w);
    int y = (int)random(h);
    tile t = tiles[x][y];
    String type = t.getType();
    if (type == "Bomb") {
      return false;
    }
    t.setType("Bomb");
    return true;
  }
  private void calculateNumbers() {
    for (int y=0; y<h; y++) {
      for (int x=0; x<w; x++) {
        tile t = tiles[x][y];
        if (t.isBlank()) {
          int count = touchingBombs(x, y);
          String type = count + "";
          t.setType(type);
        }
      }
    }
  }
  private boolean outOfBounds(int x, int y) {
    return x < 0 || x >= w || y < 0 || y >= h;
  }
  private int touchingBombs(int x, int y) {
    // Count how many bombs are being touched at (x,y)
    int result = 0;
    for (int tx = x-1; tx <= x+1; tx++) {
      for (int ty = y-1; ty <= y+1; ty++) {
        if (!outOfBounds(tx, ty) && tiles[tx][ty].getType() == "Bomb") result++;
      }
    }
    return result;
  }
  void drw() {
    for (tile[] ta : tiles) {
      for (tile t : ta) {
        t.drw();
      }
    }
  }
  void clickOn(int x, int y) {
    for (tile[] ta : tiles) {
      for (tile t : ta) {
        if (t.hasPoint(x, y) && !t.uncovered()) {
          PVector pos = t.getPosition();
          clickSurrounding((int)pos.x, (int)pos.y, false);
          return;
        }
      }
    }
  }
  void clickSurrounding(int x, int y, boolean override) {
    tile t = tiles[x][y];
    if (t.getType().equals("0") || override) {
      t.click();
      for (int tx = x-1; tx <= x+1; tx++) {
        for (int ty = y-1; ty <= y+1; ty++) {
          if (!outOfBounds(tx, ty)) {
            tile temp = tiles[tx][ty];
            if (!temp.uncovered() && !temp.isFlagged()) {
              clickSurrounding(tx, ty, false);
            }
          }
        }
      }
    } else if (t.getType() == "Bomb") {
      t.click();
      playing = false;
      text("You Lose",80,485);
      win = false;
      fill(255,255,0);
    } else t.click();
  }
  int countFlags(int x, int y) {
    int result = 0;
    for (int tx = x-1; tx <= x+1; tx++) {
      for (int ty = y-1; ty <= y+1; ty++) {
        if (!outOfBounds(tx, ty) && tiles[tx][ty].isFlagged()) result++;
      }
    }
    return result;
  }
  void flag(int x, int y) {
    for (tile[] ta : tiles) {
      for (tile t : ta) {
        if (t.hasPoint(x, y)) {
          if (!t.uncovered()) {
            t.toggleFlag();
          } else {
            PVector pos = t.getPosition();
            int flag_touch_count = countFlags((int)pos.x, (int)pos.y);
            String ftc = flag_touch_count + "";
            if (ftc.equals(t.getType())) {
              clickSurrounding((int)pos.x, (int)pos.y, true);
            }
          }
        }
      }
    }
  }
  int getUnflagged() {
    int result = 1;
    for (tile[] ta : tiles) {
      for (tile t : ta) {
        if (!t.isFlagged()) result++;
      }
    }
    return result;
  }
  private int getUnclicked() {
    int result = 1;
    for (tile[] ta : tiles) {
      for (tile t : ta) {
        if (t.uncovered()) result++;
      }
    }
    return result;
  }
  void checkWin() {
    if (minefield.getUnclicked() == w * h - bomb_count) {
      win = true;
      playing = false;
    }
  }
}
