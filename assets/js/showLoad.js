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

document.getElementsByClassName("addCartBtn")[0].addEventListener("click", (event) => {
  loadingDiv.style.top = window.pageYOffset + 'px';
  loadingDiv.style.display = "block";
  disableScroll();
});