(function(window){

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

const init = (handlers) => {
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
    const handler = handlers[swipeDirection];
    if (typeof handler === 'undefined') {
      return;
    }
    handler(position);
  });
};

if (typeof window.swipeDetection !== 'undefined') {
  console.log('Global variable "swipeDetection" found, we will not override it.');
  console.log('Swipe Detection *not* loaded!');
} else {
  window.swipeDetection = {init};
}

})(window);

swipeDetection.init({
  left: e => alert(`Swiped left from ${e.start.x} to ${e.end.x}!`),
  right: e => alert(`Swiped right from ${e.start.x} to ${e.end.x}!`),
  up: e => alert(`Swiped up from ${e.start.y} to ${e.end.y}!`),
  down: e => alert(`Swiped down from ${e.start.y} to ${e.end.y}!`),
});
