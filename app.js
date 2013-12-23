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

var Tile = function(string) {

  //-- Setup Code
  self = this;
  self.string = string;

  // Translate string into 2d array.
  arr = self.string.split('\n'); // split string into an array of lines
  self.layout = [];
  $.each(arr, function(row_string) {
    row_string = arr[row_string]; // get row
    row = []
    // Map string input chars to space, wall, or target symbols using the symbol look up table
    for (i = 0; i < row_string.length; i++) {
      c = row_string.charAt(i);
      row.push(SYMBOL_TABLE[c]);
    }
    self.layout.push(row);
  })

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

  $.each(tiles, function(tile) {
    table = $('<div>').attr('class', 'tile')
    tile = tiles[tile];
    $.each(tile.layout, function(row) {
      row = tile.layout[row]
      table_row = $('<div>').attr('class', 'row')

      // Each charecter
      $.each(row, function(idx) {
        type = row[idx]
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
