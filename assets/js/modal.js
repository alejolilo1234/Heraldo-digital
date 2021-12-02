document.addEventListener("DOMContentLoaded",() => {
  let observer = new IntersectionObserver( 
  ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
  {threshold: [1]}
  );

  observer.observe(document.querySelector('.modal-close-button'));
});