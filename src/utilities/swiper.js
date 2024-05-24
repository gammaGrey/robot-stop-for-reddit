let posX = null;
let initialPosX = null;
let rAF;
// let direction = 0; // for use with OAuth API only

function positionHandler (e) {
  // mouseDown event used, exclude click events
  // clientX = mouse x coordinate
  if (e.clientX && e.type !== "click") {
    posX = e.clientX;

  } else if (e.targetTouches) {
    // handling only the first touch input
    posX = e.targetTouches[0].clientX;
    e.preventDefault();
  }
};

export default function swipe (elementID, dispatchNextPost, nextPostID = null, vote = null) {
  const card = document.getElementById(elementID);

  function moveCard () {
    // move the card based off the value of posX (mouse x coordinate)
    // initialPosX = initial position of the cursor/touch
    if (initialPosX === null) {
      initialPosX = posX;

    } else {
      let moveX = posX - initialPosX;
      let rotation = moveX / 4;

      card.style.left = moveX + "px";
      card.style.rotate = `${rotation}deg`;
      card.style.opacity = `${100 - (Math.abs(rotation) * 2)}%`;
      card.style.scale = `${1 - (Math.abs(rotation) / 180)}`;
    };

    rAF = requestAnimationFrame(moveCard);
  };

  function stopMove() {
    // reset card styles
    card.style.left = "0";
    card.style.rotate = "0deg";
    card.style.opacity = 1;
    card.style.scale = 1;
    initialPosX = null;
    
    cancelAnimationFrame(rAF);
  };

  function goNext () {
    if (card.style.scale && Number(card.style.scale) < 0.83) {
      // dispatch "post/nextPage" action
      dispatchNextPost();

      // only used with OAuth API
      // direction = posX > initialPosX && vote !== null ? 1
      //   : posX < initialPosX ? -1
      //   : 0;
      // vote(direction);
    };
    
    stopMove();
  };

  card.onmousedown = moveCard;
  card.ontouchstart = (e) => {
    positionHandler(e);
    moveCard();
    e.preventDefault();
  };
  document.onmousemove = positionHandler;
  document.onmouseup = goNext;

  document.ontouchmove = positionHandler;
  document.ontouchend = goNext;
};