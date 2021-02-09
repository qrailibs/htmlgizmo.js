![htmlgizmo.js](https://via.placeholder.com/800x500/232424/0afc77?text=htmlgizmo.js)

htmlgizmo.js is new lightweight JavaScript library to make elements on your page resizable, movable and rotatable.

# Installation
1. Copy code of src/htmlgizmo.min.js
2. Create file htmlgizmo.min.js in your project dist folder
3. Write `<script src="dist/htmlgizmo.min.js"></script>` in your .html page

# How to use
To simply select element on your page and make it resizable:
```html
<div id="resizable"></div>

<script src="dist/htmlgizmo.min.js"></script>
<script>
    htmlgizmo.select('#resizable','resize');
</script>
```
