const SYMBOL_TABLE = {
  ' ': 'space',
  '-': 'wall',
  '+': 'wall',
  '|': 'wall',
  'a': 'red moon',
  'b': 'yellow moon',
  'c': 'blue moon',
  'd': 'green moon',
  'f': 'yellow gear',
  'g': 'blue gear',
  'h': 'green gear',
  'i': 'red saturn',
  'j': 'yellow saturn',
  'k': 'blue saturn',
  'l': 'green saturn',
  'm': 'red star',
  'n': 'yellow star',
  'o': 'blue star',
  'p': 'green star',
  'r': 'cosmic'
};

// represents one of the four board pieces.
// string representation should be NW (center tiles of board in bottom right corner)
// TODO: Validate that
var Tile = function(string) {

  //-- Setup Code
  var self = this;
  // Translate string into 2d array.
  arr = string.split('\n'); // split string into an array of lines
  layout = [];
  $.each(arr, function(n, row_string) {
    row = []
    // Map string input chars to space, wall, or target symbols using the symbol look up table
    for (i = 0; i < row_string.length; i++) {
      c = row_string.charAt(i);
      row.push(SYMBOL_TABLE[c]);
    }

   layout.push(row);
  });

  // Check that input was valid
  $.each(layout, function(n, row) {
    if (row.length != layout.length) {
      throw("Tile: Input string is now square");
    }
  });

  rotate = function(lay) {
    rot_lay = [];
    // Create 2d array rot_lay with same number of columns as lay
    // FIXME: is this ok?
    $.each(lay, function() { rot_lay.push([]) });
    $.each(layout.reverse(), function(n, row) {
      $.each(row, function(j, cell) {
        rot_lay[n].push(cell);
      });
    });

    return rot_lay;
  }

  self.NWlayout = layout
  self.NElayout = rotate(self.NWlayout);
  self.SElayout = rotate(self.NElayout);
  self.SWlayout = rotate(self.SElayout);
  return self;
}

// Made of four Tiles defined clockwise starting at NE tile
var Board = function(NEtile, SEtile, SWtile, NWtile) {
  //-- Setup Code
  var self = this;
  self.NEtile = NEtile;
  self.SEtile = SEtile;
  self.SWtile = SWtile;
  self.NWtile = NWtile;

  return self;
}


$(function (){
  console.log('start')


  tiles = {
  a1: new Tile(
       "+----------------\n" +
       "|   |            \n" +
       "|       +-       \n" +
       "|       |a       \n" +
       "|  -+            \n" +
       "|  h|            \n" +
       "|                \n" +
       "|            n|  \n" +
       "|            -+  \n" +
       "|                \n" +
       "|                \n" +
       "|                \n" +
       "+-               \n" +
       "|     |k         \n" +
       "|     +-      +- \n" +
       "|             |  \n" +
       "|                "),
  a2: new Tile(
       "+----------------\n" +
       "|         |      \n" +
       "|                \n" +
       "|            n|  \n" +
       "|   +-       -+  \n" +
       "|   |h           \n" +
       "|                \n" +
       "|                \n" +
       "|                \n" +
       "|                \n" +
       "|            -+  \n" +
       "|            k|  \n" +
       "+-               \n" +
       "|     |a         \n" +
       "|     +-      +- \n" +
       "|             |  \n" +
       "|                "),
  b1: new Tile(
       "+----------------\n" +
       "|       |        \n" +
       "|                \n" +
       "|          p|    \n" +
       "|          -+    \n" +
       "| |i             \n" +
       "| +-             \n" +
       "|                \n" +
       "+-          +-   \n" +
       "|           |b   \n" +
       "|                \n" +
       "|                \n" +
       "|    -+          \n" +
       "|    g|          \n" +
       "|             +- \n" +
       "|             |  \n" +
       "|                "),
  b2: new Tile(
       "+----------------\n" +
       "|         |      \n" +
       "|   +-           \n" +
       "|   |b           \n" +
       "|                \n" +
       "|                \n" +
       "|                \n" +
       "|           |g   \n" +
       "|           +-   \n" +
       "|                \n" +
       "+-       -+      \n" +
       "|        i|      \n" +
       "|                \n" +
       "|  p|            \n" +
       "|  -+         +- \n" +
       "|             |  \n" +
       "|                "),
  c1: new Tile(
       "+----------------\n" +
       "|       |        \n" +
       "|                \n" +
       "|                \n" +
       "|                \n" +
       "|          o|    \n" +
       "|          -+    \n" +
       "|                \n" +
       "|    -+          \n" +
       "|    d|          \n" +
       "+-               \n" +
       "|             |e \n" +
       "| +-          +- \n" +
       "| |j             \n" +
       "|             +- \n" +
       "|             |  \n" +
       "|                "),
  c2: new Tile(
       "+----------------\n" +
       "|       |        \n" +
       "|                \n" +
       "| |e             \n" +
       "| +-         -+  \n" +
       "|            d|  \n" +
       "|                \n" +
       "|                \n" +
       "|                \n" +
       "|    o|          \n" +
       "|    -+       +- \n" +
       "|             |j \n" +
       "+-               \n" +
       "|                \n" +
       "|             +- \n" +
       "|             |  \n" +
       "|                "),
  d1: new Tile(
       "+----------------\n" +
       "|       |        \n" +
       "|                \n" +
       "|           |c   \n" +
       "|           +-   \n" +
       "|                \n" +
       "|  -+            \n" +
       "|  f|            \n" +
       "|         +-     \n" +
       "|         |l     \n" +
       "|                \n" +
       "|    m|        r|\n" +
       "|    -+        -+\n" +
       "|                \n" +
       "+-            +- \n" +
       "|             |  \n" +
       "                 "),
  d2: new Tile(
       "+----------------\n" +
       "|         |      \n" +
       "|                \n" +
       "|    m|          \n" +
       "|    -+          \n" +
       "|                \n" +
       "|                \n" +
       "| |l             \n" +
       "| +-        +-   \n" +
       "|           |f   \n" +
       "+-               \n" +
       "|                \n" +
       "|          -+    \n" +
       "|          c|    \n" +
       "|             +- \n" +
       "|      r|     |  \n" +
       "       -+        "
     )
  }

  $.each(tiles, function(n, tile) {
    table = $('<div>').attr('class', 'tile')
    $.each(tile.NWlayout, function(n, row) {
      table_row = $('<div>').attr('class', 'row')

      // Each charecter
      $.each(row, function(n, type) {
        classes = 'cell ' + type
        cell = $('<div>').attr('class', classes)

        if (c == 1) {
          cell.attr('class', 'cell wall');
        }
        else if (c == 1) {
          cell.attr('class', 'cell wall');
        }
        table_row.append(cell);
      });
      table_row.append($('<div>').attr('class', 'clear'));
      table.append(table_row);
    })
    $('body').append(table);
  });
})
