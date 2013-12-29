# Ricochet Robots

Uses bredth first search to find the least number of moves a ricochet robots
puzzle can be solved in.

Bredth first search will examine all one move solutions before any two move
solutions, and all two move solutions before any three move solutions.
The number of possible moves to examine increases exponentially as the
number of moves increases.

BFS will find with certianty the shortest solution, but it will take too
long.
I need to find an algorithm that finds probable solutions and rates them
on confidince.


# symbols

There are 377,993,952,000 unique board positions
96 boards, 252 spaces, 4 robots. (96 * 252 * 251 * 250 * 249)
93,742,500,096,000 with the silver robot. (above * 248)

- [x] Draw target symbols
- [ ] Select board segments and sides
- [x] Place Robots
- [x] Select target
- [x] Calculate moves
- [ ] Calculate the most moves it could take to solve any situation
- [ ] Draw the moves that can be used to complete the puzzle.

- [ ] Replace rotation code with lin alg
- [ ] Try likely n + 1 move solutions before trying all n move solutions
- [ ] Replace $.each with _.each
- [ ] Clean up code using lodash
