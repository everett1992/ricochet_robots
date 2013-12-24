"use strict"
var SYMBOL_TABLE = {
  ' ': {type: null,     color: null,     symbol: null},
  'C': {type: 'wall',   color: null,     symbol: null},
  '-': {type: 'wall',   color: null,     symbol: null},
  '+': {type: 'wall',   color: null,     symbol: null},
  '|': {type: 'wall',   color: null,     symbol: null},
  'a': {type: 'target', color: 'red',    symbol: 'moon'},
  'b': {type: 'target', color: 'yellow', symbol: 'moon'},
  'c': {type: 'target', color: 'blue',   symbol: 'moon'},
  'd': {type: 'target', color: 'green',  symbol: 'moon'},
  'e': {type: 'target', color: 'red',    symbol: 'gear'},
  'f': {type: 'target', color: 'yellow', symbol: 'gear'},
  'g': {type: 'target', color: 'blue',   symbol: 'gear'},
  'h': {type: 'target', color: 'green',  symbol: 'gear'},
  'i': {type: 'target', color: 'red',    symbol: 'saturn'},
  'j': {type: 'target', color: 'yellow', symbol: 'saturn'},
  'k': {type: 'target', color: 'blue',   symbol: 'saturn'},
  'l': {type: 'target', color: 'green',  symbol: 'saturn'},
  'm': {type: 'target', color: 'red',    symbol: 'star'},
  'n': {type: 'target', color: 'yellow', symbol: 'star'},
  'o': {type: 'target', color: 'blue',   symbol: 'star'},
  'p': {type: 'target', color: 'green',  symbol: 'star'},
  'r': {type: 'target', color: 'cosmic', symbol: 'cosmic'}
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

  // Check that the layout is square, and each row has the same number of cells.
  $.each(self.layout, function(n, row) {
    if (row.length != self.layout.length) {
      throw("Board: board is not square");
    }
  });

  self.size = self.layout.length;

  return self;
}

var Game = function(board, node) {
  var self = this;

  var unicode_symbols = {
    star:   '\u2605', // '★'
    gear:   '\u2699', // '⚙'
    saturn: '\u229a', // '⊚'
    moon:   '\u263E', // '☾'
    cosmic: '\uAA5C', // '꩜'
    robot:  '\u2603', // '☃'
  }

  self.board = board;

  // robots x, y positions
  self.robots = {
    red:    {x: null, y: null},
    green:  {x: null, y: null},
    blue:   {x: null, y: null},
    yellow: {x: null, y: null},
  }

  // target space x, y
  self.target = null;

  var draw_board = function() {
    // Draw the board
    var table = $('<div>').attr('class', 'table');
    var board = $('<div>').attr('class', 'board');
    table.append($('<div>').attr('class', 'sideboard'));
    table.append(board);
    $.each(self.board.layout, function(x, row) {
      var table_row = $('<div>').attr('class', 'row')

      // Each cell
      $.each(row, function(y, elem) {

        var cell = $('<div>') .attr('data-x-pos', x) .attr('data-y-pos', y);

        // Each div is a cell,
        var classes = ['cell'];
        // Each cell has the class of it's elem's type
        if (elem.type != null) { classes.push(elem.type) }
        // Odd columned and rowed cells are spaces
        if (x % 2 != 0 && y % 2 != 0) { classes.push('space'); }
        cell.attr('class', classes.join(' '))

        // Add the symbol to the cell
        if (elem.symbol != null) {
          cell.attr('data-symbol', elem.symbol);
          cell.text(unicode_symbols[elem.symbol]);
        }

        // Add the color to the cell
        if (elem.color != null) {
          cell.attr('data-color', elem.color);
        }

        table_row.append(cell);
      });
      table_row.append($('<div>').attr('class', 'clear'));
      board.append(table_row);
    })
    node.append(table);
  }

  var draw_robots = function() {
    $.each(self.robots, function(name, position) {
      var robot = $('<span>')
          .text(unicode_symbols['robot'])
          .attr('class', 'robot ' + name)
          .attr('data-color', name)
          .attr('draggable', true);

      if (position.x != null && position.y != null) {
        node.find('.board [data-x-pos=' + position.x + '][data-y-pos=' + position.y + ']').append(robot);
      } else {
        node.find('.sideboard').append(robot);
      }
    });
  }

  var add_event_listners = function() {
    node.find('.robot').bind('dragstart', function(e) {
      e = e.originalEvent;
      var color = $(this).attr('data-color');

      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.dropEffect    = 'move';
      e.dataTransfer.setData('color', color);
    });

    // Allow drop event.
    node.find('.space').bind('dragover', function(e) {
      e.originalEvent.preventDefault();
    });

    node.find('.space').bind('drop', function(e) {
      e = e.originalEvent;
      var elem = $(this);
      var color = e.dataTransfer.getData('color')
      var position = {x: parseInt(elem.data('x-pos')), y: parseInt(elem.data('y-pos'))};

      self.robots[color] = position;
      self.update();
    });

    node.find('.space').bind('dragenter', function(e) {
      this.classList.add('over');
    });
    node.find('.space').bind('dragleave', function(e) {
      this.classList.remove('over');
    });

    node.find('.target').bind('click', function(e) {
      var elem = $(this);
      var position = {x: parseInt(elem.data('x-pos')), y: parseInt(elem.data('y-pos'))};
      var color = elem.data('color');
      var symbol = elem.data('symbol');
      self.target = {position: position, color: color, symbol: symbol};
      self.update();
    });
  }

  self.update = function() {
    self.draw();
  }

  self.draw = function() {
    node.empty();
    draw_board();
    draw_robots();
    add_event_listners();
  }

  self.update();
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

  var board = new Board(tiles['a1'], tiles['b1'], tiles['c1'], tiles['d1']);
  var game = new Game(board, $('body'));
});
