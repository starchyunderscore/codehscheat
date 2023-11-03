All files must be named `id.txt` where `id` is the name of the assignment passed through the below function (ex `9.1.6 Checkerboard, v1` => `392e312e3620436865636b6572626f6172642c207631.txt`)

```javascript
function toHex(s) {
  var s = unescape(encodeURIComponent(s))
  var h = ''
  for (var i = 0; i < s.length; i++) {
      h += s.charCodeAt(i).toString(16)
  }
  return h
}
```
For text answers, the file should just be the text answer.

ex:
```
def print_board(board):
    for i in range(len(board)):
        print(" ".join([str(x) for x in board[i]]))
finallist=[[0]*8]*8
for i in range(3):
        finallist[i] = [1] * 8
for i in range(5,8):
    finallist[i] = [1] * 8
print_board(finallist)
```

For Quiz answers, the file should contain a string of numbers corresponding to the answers, where each number is the answer to a question, zero indexed. This file should have a trailing newline.

ex:
```
02113

```

Would correspond to

![Screenshot_20231102_222421](https://github.com/starchyunderscore/codehscheat/assets/102399926/e7345a2c-243b-4e6c-95fa-70a13287ac10)

Thats

```
Answer 1
Answer 3
Answer 2
Answer 2
Answer 4
```
