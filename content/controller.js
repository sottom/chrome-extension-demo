///////////////////////////////////////////////////////////////
                // -- Global Content Variables --//
///////////////////////////////////////////////////////////////
changeImg()

const global = {};

// set chrome helper details in one convenient location
global.helper = {
    'title' : 'Chrome Helper',
    'id' : '#ext-drag',

    // TODO - add action button details here

};


///////////////////////////////////////////////////////////////
                    // -- Main Flow --//
///////////////////////////////////////////////////////////////

// listen for messages from background scripts
chrome.runtime.onMessage.addListener(
    function(request, sender, respondToBackground) {
        // initialize the chrome helper
        if(request.msg == "initializeChromeHelper"){
            respondToBackground(createHideOrShowHelper())
        }
    }
);


///////////////////////////////////////////////////////////////
                // -- Supporting Functions --//
///////////////////////////////////////////////////////////////

/**
 * creates, hides, or shows the helper toolbox on the page
 * @returns message to send back to the background
 */
function createHideOrShowHelper() {
    // get the draggable chrome helper
    let dragbox = $(global.helper.id),
        dragboxDisplay = dragbox.css('display');

    // fade in helper for the first time
    if(dragboxDisplay == null){                        // this catches null and undefined
        let $elem = findElement(addHelperToPage());    // add helper to page, then find it with jQuery
        $elem.draggable({ handle: '#ext-drag-title'}); // make the element draggable
        $elem.fadeIn();

        // TODO - add listeners for when users click on chrome helper buttons

        return {'msg' : 'initialize'};
    }
    // fade in helper if it was previously hidden
    else if(dragboxDisplay == 'none'){
        dragbox.fadeIn();
        return {'msg' : 'show'};
    }
    // fade out helper if it is showing
    else {
        dragbox.fadeOut();
        return {'msg' : 'hide'};
    }
}

/**
 * Takes a css selector and tries to find it on the page.
 * If the selector can't be found, it waits 500 ms and then runs again.
 * @param selector a string in the form of a valid css selector (e.g. #mainContent)
 * @returns the found element in a jquery object.
 */
function findElement(selector){
    return $(selector).length == 0
        ? setTimeout(() => findElement(selector), 500)
        : $(selector);
}


/**
 * changes all images on the page to cats typing
 * @returns void
 */
function changeImg() {
    // check for images
    if(document.querySelectorAll('img').length == 0){
        // if there are no images, wait half a second and search again
        setTimeout(() => changeImg(), 500);
    }
    else {
        // replace all images on page
        document.querySelectorAll('img').forEach(img => {
            img.src = 'https://media.giphy.com/media/o0vwzuFwCGAFO/giphy.gif';
        });
    }
}


/**
 * creates and adds the draggable div box to the browser
 * @returns a css selector for the created item
 */
function addHelperToPage(){
    let div                   = document.createElement('div');
    div.style.border          = 'solid black 2px';
    div.style.position        = 'absolute';
    div.style.top             = '0px';
    div.style.left            = '0px';
    div.style.zIndex          = '999999';
    div.style.color           = '#ccc';
    div.style.backgroundColor = '#036';
    div.style.display         = 'none';
    div.id                    = global.helper.id.slice(1); // the slice gets ride of the '#' on the front of the string
    div.innerHTML             = getHelperHtml();
    document.body.appendChild(div);

    return `#${div.id}`;
}

/**
 * html template to add to the browser
 * @returns string
 */
function getHelperHtml(){
    return `
        <div id="ext-drag-title">
            <span>${global.helper.title}</span>
        </div>
        <div id="ext-drag-options">
            <span id="" class="ext-drag-option">Action1</span>
            <span id="" class="ext-drag-option">Action2</span>
            <span id="" class="ext-drag-option-end ext-drag-option">Action3</span>
        </div>
    `;
}
