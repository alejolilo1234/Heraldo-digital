// Change these settings

let pageTitle = 'El Heraldo de la verdad | Edición digital';
let contentTitle = 'El Heraldo de la verdad';
let divText = '|';
let pageText = 'Página';

FlipbookSettings = {
  options: {
    pageWidth: 1115,
    pageHeight: 1443,
    pages: 65
  },
  shareMessage: pageTitle,
  pageFolder: 'content/'+ contentTitle +'/',
  loadRegions: true,
  loadHTML: true
};

let turnPage = document.getElementById("turnPage");

$("#flipbook").bind("turning", function(event, page, view) {
  window.document.title = pageText +' '+ view.join(" y ") + ' ' + divText + ' ' + pageTitle;
  turnPage.play();
});

document.addEventListener("DOMContentLoaded",() => {
  let viewBook = $("#flipbook").turn("view").join(" y ");
  window.document.title = pageText +' '+ viewBook + ' ' +divText + ' ' + pageTitle;
})