"use strict"
var SYMBOL_TABLE = {
  ' ': 'space',
  'C': 'wall', // center tile (just a wall for now)
  '-': 'wall',
  '+': 'wall',
  '|': 'wall',
  'a': 'red moon',
  'b': 'yellow moon',
  'c': 'blue moon',
  'd': 'green moon',
  'e': 'red gear',
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

// Clones a 2d array
var clone = function(arr2d) {
  var copy_arr = [];

  $.each(arr2d, function(n, row) {  // For each row
    copy_arr[n] = [];
    $.each(row, function(j, cell) { // For each cell
      copy_arr[n][j] = cell;
    });
  });
  return copy_arr;
}

// represents one of the four board pieces.
// string representation should be NW (center tiles of board in bottom right corner)
// TODO: Validate that
var Tile = function(string) {

  //-- Setup Code
  var self = this;
  // Translate string into 2d array.
  var arr = string.split('\n'); // split string into an array of lines
  var layout = [];
  $.each(arr, function(n, row_string) {
    var row = []
    // Map string input chars to space, wall, or target symbols using the symbol look up table
    for (var i = 0; i < row_string.length; i++) {
      var c = row_string.charAt(i);
      row.push(SYMBOL_TABLE[c]);
    }

   layout.push(row);
  });

  // Check that each row is the same length, and there are the
  // same number of rows as columns.
  $.each(layout, function(n, row) {
    if (row.length != layout.length) {
      throw("Tile: Input string is now square");
    }
  });
  self.size = layout.length;

  // returns the passed array rotated 90 degrees clockwise
  var rotate = function(orig) {
    // create an empty 2d array of the same size as the orig
    var rotated = []; $.each(orig, function() { rotated.push([]); });

    $.each(orig, function(n, row) {
      $.each(row, function(j, cell) {
        rotated[j].unshift(cell);
      });
    });

    return rotated;
  }

  self.NW = clone(layout);
  self.NE = rotate(self.NW);
  self.SE = rotate(self.NE);
  self.SW = rotate(self.SE);
  return self;
}

// Made of four Tiles defined clockwise starting at NE tile
var Board = function(tile1, tile2, tile3, tile4) {
  var add_horizontal = function(left_layout, right_layout) {
    var layout = clone(left_layout); // TODO: make sure layout is a copy, not a reference

    // For each row
    for (var i = 0; i < left_layout.length; i++) {
      var left_cell = left_layout[i][left_layout.length-1]; // last cell of left layout
      var right_cell = right_layout[i][0];                  // first cell of right layout

      // If left or right column has a wall along the edge the center column
      // of the combined layout should have a wall.
      if (left_cell == 'wall' || right_cell == 'wall') {
        layout[i][layout.length - 1] = 'wall';
      }

      // Merge left and right layout, droping the first column of the right layout
      layout[i] = layout[i].concat(right_layout[i].slice(1))
    }
    return layout;
  }

  var add_vericle = function(top_layout, bottom_layout) {
    var layout = clone(top_layout); // TODO: make sure layout is a copy, not a reference

    // For each column
    for (var i = 0; i < top_layout.length; i++) {
      var bottom_cell = top_layout[top_layout.length - 1][i]; // i-th cell from bottom row of top layout
      var top_cell = bottom_layout[0][i];                     // i-th cell from top row of bottom layout

      // If bottom or top row has a wall along the edge the center row
      // of the combined layout should have a wall.
      if (bottom_cell == 'wall' || top_cell == 'wall') {
        layout[layout.length - 1][i] = 'wall';
      }

    }

    // Merge top and bottom layout, droping the top row of the bottom layout
    layout = layout.concat(bottom_layout.slice(1));

    return layout;
  }

  //-- Setup Code
  var self = this;

  // Check that each tile is the same size.
  if (tile1.size != tile2.size || tile1.size != tile3.size || tile1.size != tile4.size) {
    throw "Board: All tiles must be the same size";
  }

  // Add tile 2 to the right of tile 1, merging the center columns
  var top_layout = add_horizontal(tile1.NW, tile2.NE);


  // Add tile 4 to the right of tile 2, merging the center columns
  var bottom_layout = add_horizontal(tile3.SW, tile4.SE);

  // Add the combined tiles 3,4 below tiles 1,2, merging the center rows
  self.layout = add_vericle(top_layout, bottom_layout);

  console.log('top: ', top_layout[0].length, ' x ', top_layout.length);
  console.log('bottom: ', bottom_layout[0].length, ' x ', bottom_layout.length);
  console.log('all: ', self.layout[0].length, ' x ', self.layout.length);

  // Check that the layout is square, and each row has the same number of cells.
  //$.each(self.layout, function(n, row) {
  //  if (row.length != self.layout.length) {
  //    throw("Board: board is not square");
  //  }
  //});

  self.size = self.layout.length;

  return self;
}


$(function (){
  console.log('start')


  var tiles = {
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
       "|     +-      +-+\n" +
       "|             |C|\n" +
       "|             +-+"),
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
       "|     +-      +-+\n" +
       "|             |C|\n" +
       "|             +-+"),
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
       "|             +-+\n" +
       "|             |C|\n" +
       "|             +-+"),
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
       "|  -+         +-+\n" +
       "|             |C|\n" +
       "|             +-+"),
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
       "|             +-+\n" +
       "|             |C|\n" +
       "|             +-+"),
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
       "|             +-+\n" +
       "|             |C|\n" +
       "|             +-+"),
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
       "+-            +-+\n" +
       "|             |C|\n" +
       "              +-+"),
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
       "|             +-+\n" +
       "|      r|     |C|\n" +
       "       -+     +-+"
     )
  }

  var draw = function(layout) {
    // Draw the table
    var table = $('<div>').attr('class', 'tile')
    $.each(layout, function(n, row) {
      var table_row = $('<div>').attr('class', 'row')

      // Each cell
      $.each(row, function(n, type) {
        var classes = 'cell ' + type;
        var cell = $('<div>').attr('class', classes);
        console.log(type);
        if (type == undefined)
          cell.text('undefined');

        //var symbol = type.match(/(star|saturn|moon|gear|cosmic)/);
        //if (symbol != null && symbol != undefined) {
        //  symbol = symbol[symbol.length]; // get matched symbol
        //  cell.text(symbol);
        //}

        table_row.append(cell);
      });
      table_row.append($('<div>').attr('class', 'clear'));
      table.append(table_row);
    })
    $('body').append(table);
  }

  var tile = tiles['a1'];
  var t_array = [tile.NW, tile.NE, tile.SE, tile.SW];

  $.each(t_array, function(n, layout) {
    //draw(layout);
  });

  var board = new Board(tiles['a1'], tiles['b1'], tiles['c1'], tiles['d1']);
  draw(board.layout);
})
