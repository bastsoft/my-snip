import snip from "./src/snip.js";

window.snip = snip;

export default {
  loadByLongPress(payload){
    let timer;
    let timeLongPress = 5000;
  
    const handleTap = function (event) {
      if (!["BODY", "DIV"].includes(event.target.nodeName)) {
        return;
      }
  
      timer = setTimeout(() => {
        if (timeLongPress === 5000) {
          timeLongPress = 500;
        }

        alert("start mysnip");
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

