const htmlgizmo = {
    queue: [],
    do: function(action) {
        if(document.readyState === 'complete') {
            action();
        }
        else {
            this.queue.push(action);
        }
    },

    // Make element resizable, add gizmos
    resizable: function(query, resizers=['top-left','top-right','bottom-left','bottom-right']) {
        this.do(function() {
            document.querySelectorAll(query).forEach(element => {
                //create gizmos
                var resizersEl = document.createElement('div');
                resizersEl.setAttribute('class', 'gizmos');
                resizers.forEach(resizer => {
                    var resizerEl = document.createElement('div');
                    resizerEl.setAttribute('class', 'resizer ' + resizer);
                    resizersEl.appendChild(resizerEl);
                });
                element.style.position = 'absolute';
                element.appendChild(resizersEl);
                //add functionality to gizmos
                const minSize = 50;
                let original_width = 0;
                let original_height = 0;
                let original_x = 0;
                let original_y = 0;
                let original_mouse_x = 0;
                let original_mouse_y = 0;
                for (let i = 0;i < resizersEl.childNodes.length; i++) {
                    const currentResizer = resizersEl.childNodes[i];
                    currentResizer.addEventListener('mousedown', function(e) {
                        e.preventDefault()
                        original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
                        original_height = parseFloat(getComputedStyle(element, null).getPropertyValue('height').replace('px', ''));
                        original_x = element.getBoundingClientRect().left;
                        original_y = element.getBoundingClientRect().top;
                        original_mouse_x = e.pageX;
                        original_mouse_y = e.pageY;
                        window.addEventListener('mousemove', resize)
                        window.addEventListener('mouseup', stopResize)
                    });
                    
                    function resize(e) {
                        if (currentResizer.classList.contains('bottom-right')) {
                            const width = original_width + (e.pageX - original_mouse_x);
                            const height = original_height + (e.pageY - original_mouse_y)
                            if (width > minSize) {
                                element.style.width = width + 'px'
                            }
                            if (height > minSize) {
                                element.style.height = height + 'px'
                            }
                        }
                        else if (currentResizer.classList.contains('bottom-left')) {
                            const height = original_height + (e.pageY - original_mouse_y)
                            const width = original_width - (e.pageX - original_mouse_x)
                            if (height > minSize) {
                                element.style.height = height + 'px'
                            }
                            if (width > minSize) {
                                element.style.width = width + 'px'
                                element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                            }
                        }
                        else if (currentResizer.classList.contains('top-right')) {
                            const width = original_width + (e.pageX - original_mouse_x)
                            const height = original_height - (e.pageY - original_mouse_y)
                            if (width > minSize) {
                                element.style.width = width + 'px'
                            }
                            if (height > minSize) {
                                element.style.height = height + 'px'
                                element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                            }
                        }
                        else if (currentResizer.classList.contains('top-left')) {
                            const width = original_width - (e.pageX - original_mouse_x)
                            const height = original_height - (e.pageY - original_mouse_y)
                            if (width > minSize) {
                                element.style.width = width + 'px'
                                element.style.left = original_x + (e.pageX - original_mouse_x) + 'px'
                            }
                            if (height > minSize) {
                                element.style.height = height + 'px'
                                element.style.top = original_y + (e.pageY - original_mouse_y) + 'px'
                            }
                        }
                    }
                    function stopResize(e) {
                        window.removeEventListener('mousemove', resize)
                    }
                }
                
                //make element selected
                element.setAttribute('selected','');
            });
        });
    },
    // Make element moveable
    moveable: function(query) {
        console.error('moveables arent implemented yet')
    },
    // Make element rotatable, add gizmos
    rotatable: function(query) {
        console.error('rotatables arent implemented yet')
    },

    // Select element, show gizmos
    select: function(query, mode) {
        switch(mode) {
            case 'resize':
                htmlgizmo.resizable(query);
                break;
            case 'move':
                htmlgizmo.moveable(query);
                break;
            case 'rotate':
                htmlgizmo.rotatable(query);
                break;
            default:
                console.error(`Unknown mode (${mode})`)
                return;
        }
    },
    // Unselect elements, hide all gizmos
    unselect: function(query) {
        this.do(function() {
            document.querySelectorAll(query + ' ' + '.gizmos').forEach(element => {
                element.parentNode.style.position = 'inherit';
                element.parentNode.removeAttribute('selected');
                element.remove();
            });
        });
    }

};

document.addEventListener('DOMContentLoaded', function() {
    //init gizmos styling
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(`
        [selected] {
            border: 3px solid #4286f4;
        }
        .gizmos {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            position: absolute;
        }
        .gizmos .resizer {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            border: 3px solid #4286f4;
            background: white;
            position: absolute;
        }
        .gizmos .resizer.top-left {
            left: -5px;
            top: -5px;
            cursor: nwse-resize;
        }
        .gizmos .resizer.top-right {
            right: -5px;
            top: -5px;
            cursor: nesw-resize;
        }
        .gizmos .resizer.bottom-left {
            left: -5px;
            bottom: -5px;
            cursor: nesw-resize;
        }
        .gizmos .resizer.bottom-right {
            right: -5px;
            bottom: -5px;
            cursor: nwse-resize;
        }
    `));
    document.getElementsByTagName("head")[0].appendChild(style);

    //init gizmos
    htmlgizmo.queue.forEach(action => { action(); });
});
