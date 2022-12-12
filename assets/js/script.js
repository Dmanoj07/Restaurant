var loadingDiv = document.getElementsByClassName("LoadingAction")[0];
// to disable scroll

function disableScroll() {
  // Get the current page scroll position
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,

    // if any scroll is attempted, set this to the previous value
    window.onscroll = function () {
      window.scrollTo(scrollLeft, scrollTop);
    };
}

window.onload = () => {
  loadingDiv.style.display = "none";
};
var decrementButtons = document.getElementsByClassName("quantChange1");
var incrementButtons = document.getElementsByClassName("quantChange2");
var nums = decrementButtons.length;
var updateLinks = document.getElementsByClassName("hideIt");
for (let i = 0; i < nums; i++) {
  decrementButtons[i].addEventListener("click", (event) => {
    let thisElem = document.getElementsByClassName("qVals")[i];
    let newVal = parseInt(thisElem.innerText) - 1;
    if (newVal < 0) {
      newVal = 0;
    }
    thisElem.innerText = newVal;
    updateLinks[i].style.display = "inline-block";
    let dummyx = updateLinks[i].href;
    let prodId = dummyx.substring(dummyx.indexOf("updateCart/:") + 12, dummyx.lastIndexOf("/:"));
    updateLinks[i].href = "/customer/updateCart/:" + prodId + "/:" + newVal;
  });
  incrementButtons[i].addEventListener("click", (event) => {
    let thisElem = document.getElementsByClassName("qVals")[i];
    let newVal = parseInt(thisElem.innerText) + 1;
    if (newVal > 100) {
      newVal = 100;
    }
    thisElem.innerText = newVal;
    updateLinks[i].style.display = "inline-block";
    let dummyx = updateLinks[i].href;
    let prodId = dummyx.substring(dummyx.indexOf("updateCart/:") + 12, dummyx.lastIndexOf("/:"));
    updateLinks[i].href = "/customer/updateCart/:" + prodId + "/:" + newVal;
  });

  updateLinks[i].addEventListener("click", (event) => {
    loadingDiv.style.top = window.pageYOffset + 'px';
    loadingDiv.style.display = "block";
    disableScroll();
  });
}
if (document.getElementsByClassName("addCartBtn")[0]) {

  document.getElementsByClassName("addCartBtn")[0].addEventListener("click", (event) => {
    loadingDiv.style.top = window.pageYOffset + 'px';
    loadingDiv.style.display = "block";
    disableScroll();
  });
}