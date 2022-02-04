// Change these settings
let pageTitle = 'El Heraldo de la verdad | Edición número 172';
let contentTitle = 'El Heraldo de la verdad';
let pageText = 'Página';
let pageTextPlural = 'Páginas';
let divText = '|';
let articles = ["Portada", "Redes sociales", "Contenido", "Carta del presidente", "Notas del director", "Familias firmes en la fe", "El justo por la fe vivirá", "Ayuda mi incredulidad", "La fe como estilo de vida", "La fe como don", "He guardado la fe", "Señor, ayuda mi incredulidad", "Una fe que vence al mundo", "Ministrando el don de la fe", "La fe, como medio para ser salvo", "Fe para ver la gloria de Dios", "Fe a pesar de las dificultades", "Si crees verás la gloria de Dios", "Informe UDIM", "Fundación educación cristiana pentecostal", "El mensaje del principio y el mensaje después, contrastado con el mensaje de hoy", "Misiones nacionales", "Misiones extranjeras"];

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
  if (!Turn.isTouchDevice) {
    makeTitleDesktop($("#flipbook").turn("page"));
  } else if (Turn.isTouchDevice) {
    // TODO Títulos para versión móvil
    window.document.title = pageTitle;
  }
});

function makeTitleDesktop(page) {
  switch(page) {
    case 1:
      window.document.title = makeTextTitle(0,"");
    break;
    case 2:
    case 3:
      window.document.title = makeTextTitle(articles[1] + " y " + articles[2].toLowerCase(), "");
    break;
    case 4:
    case 5:
      window.document.title = makeTextTitle(articles[3], pageTextPlural + " 2 y 3");
    break;
    case 6:
    case 7:
      window.document.title = makeTextTitle(articles[4] + " y " + articles[5].toLowerCase(), pageTextPlural + " 4 y 5");
    break;
    case 8:
    case 9:
      window.document.title = makeTextTitle(articles[6], pageTextPlural + " 6 y 7");
    break;
    case 10:
    case 11:
      window.document.title = makeTextTitle(articles[7], pageTextPlural + " 8 y 9");
    break;
    case 12:
    case 13:
      window.document.title = makeTextTitle(articles[8], pageTextPlural + " 10 y 11");
    break;
    case 14:
    case 15:
      window.document.title = makeTextTitle(articles[9], pageTextPlural + " 12 y 13");
    break;
    case 16:
    case 17:
      window.document.title = makeTextTitle(articles[10], pageTextPlural + " 14 y 15");
    break;
    case 18:
    case 19:
      window.document.title = makeTextTitle(articles[11], pageTextPlural + " 16 y 17");
    break;
    case 20:
    case 21:
      window.document.title = makeTextTitle(articles[12], pageTextPlural + " 18 y 19");
    break;
    case 22:
    case 23:
      window.document.title = makeTextTitle(articles[13], pageTextPlural + " 20 y 21");
    break;
    case 24:
    case 25:
      window.document.title = makeTextTitle(articles[14], pageTextPlural + " 22 y 23");
    break;
    case 26:
    case 27:
      window.document.title = makeTextTitle(articles[15], pageTextPlural + " 24 y 25");
    break;
    case 28:
    case 29:
      window.document.title = makeTextTitle(articles[16], pageTextPlural + " 26 y 27");
    break;
    case 30:
    case 31:
      window.document.title = makeTextTitle(articles[17], pageTextPlural + " 28 y 29");
    break;
    case 32:
    case 33:
      window.document.title = makeTextTitle(articles[18], pageTextPlural + " 30 y 31");
    break;
    case 34:
    case 35:
      window.document.title = makeTextTitle(articles[19], pageTextPlural + " 32 y 33");
    break;
    case 36:
    case 37:
      window.document.title = makeTextTitle(articles[20], pageTextPlural + " 34 y 35");
    break;
    case 38:
    case 39:
      window.document.title = makeTextTitle(articles[21] + " y " + articles[22].toLowerCase(), pageTextPlural + " 36 y 37");
    break;
    case 1:
      window.document.title = makeTextTitle(0,"");
    break;
    default:
      window.document.title = makeTextTitle(0,"");
    break;
  }
}

function makeTextTitle(articleName, pages) {
  if (articleName === 0) {
    return pageTitle;
  }
  if (pages === "") {
    return articleName + " " + divText + " " + pageTitle;
  }
  return articleName + " " + divText + " " + pages + " " + divText + " " + pageTitle;
}