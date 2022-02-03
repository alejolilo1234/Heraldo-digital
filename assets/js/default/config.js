// Change these settings
let pageTitle = 'El Heraldo de la verdad | Edición digital';
let contentTitle = 'El Heraldo de la verdad';
let pageText = 'Página';
let divText = '|';

FlipbookSettings = {
  options: {
    pageWidth: 1115,
    pageHeight: 1443,
    pages: 40
  },
  shareMessage: pageTitle,
  pageFolder: 'content/'+ contentTitle +'/',
  loadRegions: true,
  loadHTML: true
};

document.addEventListener("DOMContentLoaded",() => {
  let viewBook = $("#flipbook").turn("view").join(" y ");
  window.document.title = pageText +' '+ viewBook + ' ' + divText + ' ' + pageTitle;
});