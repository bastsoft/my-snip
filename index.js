import snip from "./src/snip.js";

window.snip = snip;

export default {
  loadByLongPress(payload){
    const timeout = payload.timeout || 5000;
    let timer;
    let timeLongPress = timeout;
  
    const handleTap = function (event) {
      if (payload.onlyFromTags && !payload.onlyFromTags.includes(event.target.nodeName)) {
        return;
      }
  
      timer = setTimeout(() => {
        if (timeLongPress === timeout) {
          timeLongPress = 500;
        }

        //alert("start mysnip");
        snip(payload);

      }, timeLongPress);
    };
    const handleEnd = function () {
      clearTimeout(timer);
    };
    document.body.addEventListener("touchstart", handleTap);
    document.body.addEventListener("mousedown", handleTap);
    document.body.addEventListener("touchend", handleEnd);
    document.body.addEventListener("mouseup", handleEnd);
  } 
}

