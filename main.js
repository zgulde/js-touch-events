/***
 * we probably need to initialize by listening for "swipes" on the body, then
 * we can register callbacks for swipes up, down, left, and right, as opposed to
 * the current onSwipe fn, which tries to listen for swipes on an individual
 * element (although maybe we could use that too? and listening for swipes on
 * the body could be an instance of the more general case? there could be some
 * potential for cool, "swiping away" of elements, e.g. alerts, or a game of
 * some sort)
 */

function init(handlers) {
  // TODO come up with something reasonable here
  //      some pixel value?
  //      % of screen size?
  const SWIPE_THRESHOLD = 300;

  const getPositionDiff = ({start, end}) => {
    return {
      x: Math.abs(start.x - end.x),
      y: Math.abs(start.y - end.y),
    };
  };

  const isSwipe = ({start, end}) => {
    const diff = getPositionDiff({start, end});
    const isOneFingerTouch = start.e.touches.length == 1
      && end.e.changedTouches.length == 1;
    const meetsSwipeThreshold = (diff.x > SWIPE_THRESHOLD && diff.y < SWIPE_THRESHOLD)
      || (diff.y > SWIPE_THRESHOLD && diff.x < SWIPE_THRESHOLD)

    return isOneFingerTouch && meetsSwipeThreshold;
  };

  const getSwipeDirection = ({start, end}) => {
    const diff = getPositionDiff({start, end});
    const isLeftRightSwipe = diff.x > diff.y;

    return isLeftRightSwipe
      ? (start.x > end.x) ? 'right' : 'left'
      : (start.y < end.y) ? 'up' : 'down';
  };

  // TODO add a time here?
  // should a swipe movement be within a certain time threshold?
  const position = {
    start: {x: 0, y: 0, e: null},
    end: {x: 0, y: 0, e: null},
  };
  
  const body = document.querySelector('body');
  
  body.addEventListener('touchstart', (e) => {
    position.start.e = e;
    position.start.x = e.touches[0].clientX;
    position.start.y = e.touches[0].clientY;
  });

  body.addEventListener('touchend', (e) => {
    position.end.e = e;
    position.end.x = e.changedTouches[0].clientX;
    position.end.y = e.changedTouches[0].clientY;

    if (! isSwipe(position)) {
      return;
    }

    const swipeDirection = getSwipeDirection(position);
    // const handler = handlers[swipeDirection];
    // if (typeof handler === 'undefined') {
    //   return;
    // }
    // handler(position);
    alert(`Swiped ${swipeDirection}!`);
  });
}

init({
  up: () => alert('Swiped up!'),
  down: () => alert('Swiped down!'),
  left: () => alert('Swiped left!'),
  right: () => alert('Swiped right!'),
});

// function getTouchHandler(eventName) {
//   return [eventName, function(e) {
//     console.log('--------------------------------------------------');
//     console.log(`${eventName} !`);
//     console.log(e);

//     const touch = (e.touches.length === 0) ? e.changedTouches[0] : e.touches[0];
//     const { clientX, clientY, pageX, pageY, screenX, screenY } = touch;

//     // relative to device: e.g. x:0, y:0 is always top left
//     console.log('--- client ---');
//     console.log(`X: ${clientX}`);
//     console.log(`Y: ${clientY}`);

//     // relative to the page: e.g. we can have a big Y if the page is scrolled
//     // down
//     console.log('--- page ---');
//     console.log(`X: ${pageX}`);
//     console.log(`Y: ${pageY}`);

//     // relative to the screen: in chrome mobile emulation, the leftmost part of
//     // the device screen has an x offset == the "padding" between the emulated
//     // device and the browser window
//     console.log('--- screen ---');
//     console.log(`X: ${screenX}`);
//     console.log(`Y: ${screenY}`);
//     /**
//      * for detecting swipes on the screen as a whole, we should probably use
//      * client
//      */
//   }];
// }

// const body = document.querySelector('body');

// body.addEventListener(...getTouchHandler('touchstart'));

// body.addEventListener(...getTouchHandler('touchend'));

// body.addEventListener('click', (e) => {
//   console.log('clicked!');
// });
