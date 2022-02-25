/**
 * Turn.js Catalog App
 * Based on turn.js 5th release available on turnjs.com
 *
 * All rights reserved
 */
 (function(window, $, Backbone) {
    'use strict';
    /* Singlethon abstract class */
    
    var SingleView = Backbone.View.extend({},
    // Static properties
    {
      getInstance: function(context, options) {
        context = context || this;
        if (!context.instance) {
          context.instance = new this(options);
          context.instance.render();
        }
        return context.instance;
      },
    
      remove: function(context) {
        context = context || this;
        if (context.instance) {
          context.instance.remove();
          delete context.instance;
        }
      }
    });
    
    /* * Flipbook View * */
    
    var FlipbookView = SingleView.extend({
      el: '#flipbook',
      events: {
        'missing': '_missingEvent',
        'pinch': '_pinchEvent',
        'zoomed': '_zoomedEvent',
        'turned': '_turnedEvent',
        'vmouseover .ui-arrow-control': '_hoverArrowEvent',
        'vmouseout .ui-arrow-control': '_nohoverArrowEvent',
        'vmousedown .ui-arrow-control': '_pressArrowEvent',
        'vmouseup .ui-arrow-control': '_releaseArrowEvent',
        'vmouseover .ui-region': '_mouseoverRegion',
        'vmouseout .ui-region': '_mouseoutRegion',
        'tap .ui-region': '_tapRegion'
      },
    
      initialize: function() {
        // this.events[(Turn.isTouchDevice) ? 'doubletap' : 'tap'] = '_toggleZoomEvent';
        $(window).keydown($.proxy(this, '_keydownEvent'));
        $('body').on('tap', '.ui-arrow-next-page', $.proxy(this, '_tapNextArrowEvent'));
        $('body').on('tap', '.ui-arrow-previous-page', $.proxy(this, '_tapPreviousArrowEvent'));
    
        // Tooltip for regions
        this.$el.tooltips({
          selector: '.ui-region',
          className: 'ui-tooltip ui-region-tooltip'
        });
      },
    
      render: function() {
        var settings = window.FlipbookSettings;
        var options = $.extend({
          responsive: true,
          animatedAutoCenter: true,
          // smartFlip: true,
          autoScaleContent: true,
          swipe: true
        }, settings.options);
    
        this.$el.turn(options);
      },
    
      _missingEvent: function(event, pages) {
        for (var i = 0; i < pages.length; i++) {
          this.$el.turn('addPage', this._getPageElement(pages[i]), pages[i]);
        }
      },
    
      _pinchEvent: function(event) {
        this.$el.turn('zoom', 1, event);
      },
    
      _zoomedEvent: function(event, zoom) {
        if (zoom==1) {
          $('.ui-arrow-control').show();
        } else {
          $('.ui-arrow-control').hide();
        }
      },
    
      _turnedEvent: function(event, page) {
        let turnPage = document.getElementById("turnPage");

        $("#flipbook").bind("turning", function(event, page, view) {
            if (!Turn.isTouchDevice) {
              makeTitleDesktop(page);
            } else if (Turn.isTouchDevice) {
              // TODO Títulos para versión móvil
              window.document.title = pageTitle;
            }
            turnPage.play();
        });

        AppRouter.getInstance().navigate('page/' + page, {trigger: false});
        if (window.FlipbookSettings.loadRegions) {
          if (!Turn.isTouchDevice) {
            if (page == 38) {
              this._loadRegions(page - 2);
              this._loadRegions(page - 1);
              this._loadRegions(page);
              this._loadRegions(page + 1);
              this._loadRegions(page + 2);
              // console.log("Página 38");
            } else if(page == 39) {
              this._loadRegions(page - 1);
              this._loadRegions(page);
              // console.log("Página 39");
            } else if(page == 40) {
              this._loadRegions(page - 2);
              this._loadRegions(page - 1);
              this._loadRegions(page);
              // console.log("Página 40");
            } else if(page == 1) {
              this._loadRegions(1);
              // console.log("Página 1");
            } else if(page == 2) {
              this._loadRegions(page - 1);
              this._loadRegions(page);
              this._loadRegions(page + 1);
              // console.log("Página 2");
            } else if(page == 3) {
              this._loadRegions(page - 2);
              this._loadRegions(page - 1);
              this._loadRegions(page);
              this._loadRegions(page + 1);
              this._loadRegions(page + 2);
              // console.log("Página 3");
            } else if(page % 2 === 0) {
              // console.log("Par");
              this._loadRegions(page - 2);
              this._loadRegions(page - 1);
              this._loadRegions(page);
              this._loadRegions(page + 1);
              this._loadRegions(page + 2);
              this._loadRegions(page + 3);
            } else if(page % 2 != 0 && page != 1) {
              // console.log("Impar");
              this._loadRegions(page - 3);
              this._loadRegions(page - 2);
              this._loadRegions(page - 1);
              this._loadRegions(page);
              this._loadRegions(page + 1);
              this._loadRegions(page + 2);
            }
          } else if(Turn.isTouchDevice) {
            // alert("Dispositivo móvil");
            if(page == 1) {
              this._loadRegions(page);
              this._loadRegions(page + 1);
            } else if(page == 40) {
              this._loadRegions(page - 1);
              this._loadRegions(page);
            } else if(page % 2 === 0 || page % 2 !== 0) {
              this._loadRegions(page - 1);
              this._loadRegions(page);
              this._loadRegions(page + 1);
            }
          }
        }
      },
    
      _hoverArrowEvent: function(event) {
        $(event.currentTarget).addClass('ui-arrow-control-hover');
      },
      
      _nohoverArrowEvent: function(event) {
        $(event.currentTarget).removeClass('ui-arrow-control-hover');
      },
      
      _pressArrowEvent: function(event) {
        $(event.currentTarget).addClass('ui-arrow-control-tap');
      },
    
      _releaseArrowEvent: function(event) {
        $(event.currentTarget).removeClass('ui-arrow-control-tap');
      },
      
      _tapNextArrowEvent: function(event) {
        this.$el.turn('next');
      },
    
      _tapPreviousArrowEvent: function(event) {
        this.$el.turn('previous');
      },
    
      _keydownEvent: function(event) {
        var nextArrow = 39, prevArrow = 37;
        if (event.keyCode==prevArrow) {
          this.$el.turn('previous');
        } else if (event.keyCode==nextArrow) {
          this.$el.turn('next');
        }
      },
    
      _getPageElement: function(pageNumber) {
        var $el = $('<div />'),
          settings = window.FlipbookSettings;
        var imgSrc;
        if(pageNumber == 1 || pageNumber == 26 || pageNumber == 27 || pageNumber == 38){
          imgSrc = settings.pageFolder+'/'+pageNumber+'/'+pageNumber+'.gif';
        } else {
          imgSrc = settings.pageFolder+'/'+pageNumber+'/'+pageNumber+'.jpg';
        }
        var $img = $('<img />', {width: '100%', height: '100%', css: {display: 'none'}});
    
        // Do we need a spinner?
        var timerAddLoader = setTimeout(function() {
          var $loader = $('<div />', {'class': 'ui-spinner'});
          $el.append($loader);
          timerAddLoader = null;
        }, 150);
        
        $img.on('load', function(event) {
          $img.show();
          if (timerAddLoader===null) {
            $el.find('.ui-spinner').hide();
          } else {
            clearInterval(timerAddLoader);
          }
        });
    
        $img.attr('src', imgSrc);
        $el.append($img);
    
        return $el;
      },
    
      _loadRegions: function(pageNumber) {
        var pageData = $('#flipbook').turn('pageData', pageNumber);
        if (!pageData.regions) {
          pageData.regions = new Regions([], {pageNumber: pageNumber});
          pageData.regions.fetch();
        }
      },

      _loadHTML: function(pageNumber) {
        var pageData = $('#flipbook').turn('pageData', pageNumber);
        if (!pageData.regions) {
          pageData.regions = new HTMLRegion([], {pageNumber: pageNumber});
          pageData.regions.fetch();
        }
      },
      
      _mouseoverRegion: function(event) {
        $(event.currentTarget).addClass('ui-region-hover');
      },
    
      _mouseoutRegion: function(event) {
        $(event.currentTarget).removeClass('ui-region-hover');
      },
    
      _tapRegion: function(event) {
        event.stopPropagation();
    
        var $el = $(event.currentTarget);
        var view = $el.data('view');
    
        view.processAction();
      }
    });
    
    var RegionModel = Backbone.Model.extend({
      idAttribute: 'id',
      className: 'none'
    });

    var RegionView = Backbone.View.extend({
      tagName: 'div',
      className: 'ui-region',
      initialize: function(options) {
        this.render();
      },
      render: function() {
        var attr = this.model.attributes;

        
    
        if (attr.buttonModal) {
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass('ui-region-' + attr.buttonModal.className);
          
          this.$el.css({
            "box-shadow": "0 0 0 0 rgba(0, 0, 0, 0)",
            "animation": "pulse 2s 3",
            "-webkit-animation": "pulse 2s 3",
            "width": "20%",
            "height": "5%",
            "position": "absolute",
            "z-index": "1",
            "cursor": "pointer",
            "display": "flex",
            "border-radius": "8px"
          });

          this.$el.css(attr.buttonModal.css);

          this.$el.html(buttonModalSVG(attr.buttonModal.modalButtonText, attr.buttonModal.textX,  attr.buttonModal.textY, attr.buttonModal.fontSize, attr.buttonModal.backgroundColor, attr.buttonModal.borderColor, attr.buttonModal.textColor));
    
          this.$el.data({view: this});
          $pageElement.append(this.$el);

          let contentForButton = document.createElement("div");
          contentForButton.setAttribute("class","modal");
          contentForButton.setAttribute("id",attr.buttonModal.containerIdToOpen);

          if(attr.buttonModal.state == 'true'){
            contentForButton.innerHTML = "<div class='container-close-button'><a href='#close-modal' class='modal-close-button' rel='modal:close'></a></div><div style='height:20px;'></div>" + textForArticle + attr.buttonModal.content;
          } else {
            contentForButton.innerHTML = "<div class='container-close-button'><a href='#close-modal' class='modal-close-button' rel='modal:close'></a></div>" + attr.buttonModal.content;
          }

          $pageElement.append(contentForButton);
        }
        else if (attr.buttonModalHTML) {
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass('ui-region-' + attr.buttonModalHTML.className);
          
          this.$el.css({
            "box-shadow": "0 0 0 0 rgba(0, 0, 0, 0)",
            "animation": "pulse 2s 3",
            "-webkit-animation": "pulse 2s 3",
            "position": "absolute",
            "z-index": "1",
            "cursor": "pointer",
            "overflow": "visible"
          });

          this.$el.css(attr.buttonModalHTML.css);

          this.$el.html("<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 " + attr.buttonModalHTML.widthSVG + " " + attr.buttonModalHTML.heightSVG + "' xml:space='preserve' style='overflow: visible;'><foreignObject width='100%' x='0' y='0' style='overflow:visible;'><div style='font-size:" + attr.buttonModalHTML.fontSize + ";width: 93%;'>" + attr.buttonModalHTML.text + "</div></foreignObject></svg>");
    
          this.$el.data({view: this});
          $pageElement.append(this.$el);
        }
        else if(attr.articleTitle) {
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass(attr.articleTitle.className);
          
          this.$el.css({
            "position": "absolute",
            "z-index": "1",
            "top": "0",
            "width": "100%",
            "height": "100%",
            "background-repeat": "no-repeat",
            "background-size": "contain",
            "background-image": `url("./content/El Heraldo de la verdad/${this.model.pageNumber}/title.png")`,
            "-webkit-animation": `${attr.articleTitle.animation} 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both`,
            "animation": `${attr.articleTitle.animation} 1.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both`,
            "animation-delay": ".55s"
          });
          
          this.$el.data({view: this});
          $pageElement.append(this.$el);
        }
        else if (attr.tableContent) {
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass('ui-region-' + attr.tableContent.className);

          this.$el.css(attr.tableContent.css);

          this.$el.css({
            "position": "absolute",
            "z-index": "1",
            "top": "0",
            "width": "100%",
            "height": "100%",
            "background-repeat": "no-repeat",
            "background-size": "contain",
            "animation": "0"
          });
          
          if(attr.tableContent.innerHTML){
            for(let i = 0;i < attr.tableContent.innerHTML.length; i++){
              let pageInnerHTML = document.createElement(attr.tableContent.innerHTML[i].tag);
              let cssTag = "";
              for(let j = 0; j < Object.keys(attr.tableContent.innerHTML[i].css).length; j++){
                cssTag += Object.keys(attr.tableContent.innerHTML[i].css)[j] + ":" + Object.values(attr.tableContent.innerHTML[i].css)[j] + ";";
              }
              pageInnerHTML.setAttribute("style",cssTag);
              pageInnerHTML.setAttribute("class",attr.tableContent.innerHTML[i].className);
              pageInnerHTML.setAttribute("id",attr.tableContent.innerHTML[i].idTag);
              pageInnerHTML.innerHTML = attr.tableContent.innerHTML[i].text;
              this.$el.append(pageInnerHTML);
            }
          }
          this.$el.data({view: this});
          $pageElement.append(this.$el);
        }
        else if(attr.HTMLContent){
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass('ui-region-' + attr.HTMLContent.className);
          
          this.$el.css({
            "position": "absolute",
            "z-index": "1"
          });

          this.$el.css(attr.HTMLContent.css);

          this.$el.html(attr.HTMLContent.text);
          
          this.$el.data({view: this});
          $pageElement.append(this.$el);
        }
        else if(attr.contentArticle){
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass('ui-region-' + attr.contentArticle.className);

          textForArticle = attr.contentArticle.excerpt;
          pageForArticle = this.model.pageNumber;

          this.$el.css({
            "position": "absolute",
            "z-index": "1"
          });

          this.$el.css(attr.contentArticle.css);

          this.$el.html("<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 " + attr.contentArticle.ViewX + " " + attr.contentArticle.ViewY + "' style='overflow: visible;' xml:space=''><foreignObject x='0' y='0' width='" + attr.contentArticle.foreignX + "' height='" + attr.contentArticle.foreignY + "' style='overflow:visible;'><div xmlns='http://www.w3.org/1999/xhtml'>" + attr.contentArticle.excerpt + "</div></foreignObject></svg>");
          
          this.$el.data({view: this});
          $pageElement.append(this.$el);
        }
        else if(attr.pagesNumber){
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass('ui-region-' + attr.pagesNumber);

          let pageNumberText = this.model.pageNumber - 2;

          if(pageNumberText <= 9) pageNumberText = "0" + pageNumberText;

          this.$el.css({
            "bottom": "1.5%",
            "width": "22%",
            "position": "absolute",
            "z-index": "10",
            "cursor": "pointer"
          });
          

          if(pageNumberText % 2 == 0){
            this.$el.css({"left":"-5%"});
            this.$el.html(pageNumberLeftSVG(pageNumberText) + "<svg version='1.2' baseProfile='tiny' id='pageNumberLeft' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 1051.5 416' xml:space='preserve' style='position:absolute;top:-130%;left:55%;width:100%;opacity:0;transition:opacity 0.25s, top 0.25s;'><foreignObject x='0' y='0' width='100%' height='100%' style='overflow:visible;'><div xmlns='http://www.w3.org/1999/xhtml' style='width: 93%;font-size:7.4em;'><div class='tooltip'>Ir al indice</div><div class='triangle'></div></div></foreignObject></svg>");
            this.$el.addClass("left");
          } else {
            this.$el.html(pageNumberRightSVG(pageNumberText) + "<svg version='1.2' baseProfile='tiny' id='pageNumberRight' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 1051.5 416' xml:space='preserve' style='position:absolute;top:-130%;right:25%;width:100%;opacity:0;transition:opacity 0.25s, top 0.25s;'><foreignObject x='0' y='0' width='100%' height='100%' style='overflow:visible;'><div xmlns='http://www.w3.org/1999/xhtml' style='width: 93%;font-size:7.4em;'><div class='tooltip'>Ir al indice</div><div class='triangle'></div></div></foreignObject></svg>");
            this.$el.css({"right":"-5%"});
          }
          
          this.$el.data({view: this});
          $pageElement.append(this.$el);

        } 
        else if(attr.articleAuthor) {
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass('ui-region-' + attr.articleAuthor.className);

          this.$el.css({
            "width": "67%",
            "position": "absolute",
            "z-index": "1",
          });

          this.$el.css(attr.articleAuthor.css);

          if(attr.articleAuthor.direction == "right") {
            this.$el.html(authorRightSVG(attr.articleAuthor.text,attr.articleAuthor.backgroundColor,attr.articleAuthor.XPosition));
          } else if(attr.articleAuthor.direction == "left") {
            this.$el.html(authorLeftSVG(attr.articleAuthor.text,attr.articleAuthor.backgroundColor,attr.articleAuthor.XPosition));
          }

          this.$el.data({view: this});
          $pageElement.append(this.$el);
        }
        else if(attr.buttonsForAudioPrint) {
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass('ui-region-' + attr.buttonsForAudioPrint.className);

          this.$el.css({
            "width": "15%",
            "position": "absolute",
            "z-index": "1",
          });
          
          this.$el.css(attr.buttonsForAudioPrint.css);

          this.$el.html(audioPrintSVG(attr.buttonsForAudioPrint.audio.bgColor, attr.buttonsForAudioPrint.audio.border, attr.buttonsForAudioPrint.linkToVideo,attr.buttonsForAudioPrint.print.bgColor,attr.buttonsForAudioPrint.print.border,attr.buttonsForAudioPrint.print.link,
          attr.buttonsForAudioPrint.displayAudio, attr.buttonsForAudioPrint.id) + "<div id='" + attr.buttonsForAudioPrint.id + "' class='modal'><div class='container-close-button'><a href='#close-modal' class='modal-close-button' rel='modal:close'></a></div><div style='height:20px;'></div><iframe width='100%' height='300px' src='" + attr.buttonsForAudioPrint.YouTubeLink + "' title='YouTube video player' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe></div><script>let select" + attr.buttonsForAudioPrint.id + " = document.getElementById('" + attr.buttonsForAudioPrint.id + "-modal'); select" + attr.buttonsForAudioPrint.id + ".addEventListener('click', () => { $('" + attr.buttonsForAudioPrint.id2 + "').modal(); });</script>");

          // select = document.getElementById(attr.buttonsForAudioPrint.id + "-modal");
          // console.log(select);

          this.$el.data({view: this});
          $pageElement.append(this.$el);
        }
        else if(attr.stylesForPage) {
          var $pageElement = $('#flipbook').turn('pageElement', this.model.pageNumber);
          this.$el.addClass('ui-region-' + "styles");

          let elementForEL = "";

          for(let i = 0; i < attr.stylesForPage.length; i++) {
            elementForEL += attr.stylesForPage[i];
          }

          this.$el.css({"display":"absolute"});
          this.$el.html("<style>" + elementForEL + "</style>");

          this.$el.data({view: this});
          $pageElement.append(this.$el);
        }
      },
    
      processAction: function() {
        var attr = this.model.attributes,
          data = attr.data;

        if(attr.buttonModal){
          $("#" + attr.buttonModal.containerIdToOpen).modal();
        } else if(attr.buttonModalHTML){
          $("#" + attr.buttonModalHTML.containerIdToOpen).modal();

          var detail = document.querySelector("." + attr.buttonModalHTML.detail);

          let elements = document.querySelectorAll('#toggle'); 
          elements.forEach(element => {
            element.removeAttribute('open'); 
          });

          detail.setAttribute("open","");

          // setTimeout(function(){window.location.hash = '#' + attr.buttonModalHTML.link;},600);
          window.location.hash = '#' + attr.buttonModalHTML.link;
        } else if(attr.pagesNumber){
          $('#flipbook').turn('page', 3);
        } /*else if (attr.buttonsForAudioPrint) {
          // select = document.getElementById(attr.buttonsForAudioPrint.id + "-modal");
          var select = document.getElementById(attr.buttonsForAudioPrint.id + "-modal");

          console.log(select);
          
          select.addEventListener('click', () => {
            $("#" + attr.buttonsForAudioPrint.id).modal(); 
          });
        } */
    
        $('#flipbook').tooltips('hide');
      }
    });
    
    var Regions = Backbone.Collection.extend({
      model: RegionModel,
      initialize: function(models, options) {
        this.pageNumber = options.pageNumber;
        this.on('add', this._add, this);
      },
      url: function() {
        return FlipbookSettings.pageFolder + this.pageNumber + '/regions.json';
      },
    
      _add: function(regionModel) {
        // Add the view
        regionModel.pageNumber = this.pageNumber;
        new RegionView({model: regionModel});
      }
    });
    
    /* * Page Slider View * */
    
    var PageSliderView = SingleView.extend({
      el: '#page-slider',
    
      events: {
        'changeValue': '_changeValueEvent',
        'slide': '_slideEvent',
        'vmousedown': '_pressEvent',
        'vmouseover': '_hoverEvent'
      },
    
      initialize: function() {
        var $el = this.$el;
    
        $('#flipbook').on('turned', function(event, page) {
          if (!$el.slider('isUserInteracting')) {
            $el.slider('value', page);
          }
        });
      },
    
      render: function() {
        this.$el.slider({
          min: 1,
          max: $('#flipbook').turn('pages'),
          value: $('#flipbook').turn('page')
        });
      },
    
      _changeValueEvent: function(event, newPage) {
        var currentVal = this.$el.slider('value');
        if ($.inArray(currentVal, $('#flipbook').turn('view', newPage))!=-1 ) {
          event.preventDefault();
          return;
        }
        if ($('#flipbook').turn('page', newPage)===false) {
          event.preventDefault();
        }
      },
    
      _slideEvent: function(event, newPage) {
        $('#miniatures').miniatures('page', newPage);
      },
    
      _pressEvent: function(event) {
        $('#miniatures').miniatures('listenToFlipbook', false);
        MiniaturesView.getInstance().show();
    
        $(document).one('vmouseup', $.proxy(this, '_releasedEvent'));
    
      },
    
      _releasedEvent: function(event) {
        $('#miniatures').miniatures('listenToFlipbook', true);
        if (!$('#miniatures').hasClass('ui-miniatures-slider-open')) {
          MiniaturesView.getInstance().hide();
        }
      },
    
      _hoverEvent: function(event) {
        event.stopPropagation();
      }
    });
    
    
    /* * Table of Contents * */
    
    var TableContentsView = SingleView.extend({
      tagName: 'div',
      events: {
        'itemRequested': '_itemRequested',
        'itemSelected': '_itemSelected',
        'vmouseover': '_vmouseover',
        'vmouseout': '_vmouseout',
        'vmousemove': '_vmousemove'
      },
    
      _nextItemPage: 1,
      _itemPage: {},
    
      initialize: function() {
        $('#ui-icon-table-contents').on('vmouseover', $.proxy(this, 'show'));
        $('#ui-icon-table-contents').on('vmouseout', $.proxy(this, 'hide'));
      },
    
      render: function() {
        this.$el.menu({
          itemCount: this.itemCount()
        });
    
        this._menuDisplay = $('#flipbook').turn('display');
        this.$el.appendTo($('body'));
      },
    
      itemCount: function() {
        var settings = window.FlipbookSettings;
        if (settings.table) {
          return settings.table.length;
    
        } else {
          if ($('#flipbook').turn('display')=='single') {
            return $('#flipbook').turn('pages');
          } else {
            return Math.round($('#flipbook').turn('pages')/2) + 1;
          }
        }
      },
    
      clear: function() {
        this.$el.menu('clear');
        this._itemPage = {};
        this._nextItemPage = 1;
        this.$el.menu('options', {itemCount: this.itemCount()});
      },
    
      _itemRequested: function(event, itemNum) {
        var text, settings = window.FlipbookSettings;
        if (settings.table) {
          text = settings.table[itemNum].text;
          this._itemPage[settings.table[itemNum].page] = itemNum;
        } else {
          var pages = $('#flipbook').turn('view', this._nextItemPage, true);
          text = (pages.length==1) ? 'Página '+pages[0] : 'Páginas '+pages.join('-');
          this._itemPage[pages[0]] = itemNum;
          this._nextItemPage = pages[pages.length-1] + 1;
        }
        this.$el.menu('addTextItem', text);
      },
      
      _itemSelected: function(event, itemNum) {
        var settings = window.FlipbookSettings;
    
        if (settings.table) {
          $('#flipbook').turn('page', settings.table[itemNum].page);
        } else {
          if ($('#flipbook').turn('display')=='single') {
            $('#flipbook').turn('page', itemNum+1);
          } else {
            $('#flipbook').turn('page', itemNum === 0 ? 1 : itemNum*2 );
          }
        }
      },
    
      show: function() {
        var flipbookDisplay = $('#flipbook').turn('display');
        if (flipbookDisplay!=this._menuDisplay) {
          this.clear();
          this._menuDisplay = flipbookDisplay;
        }
    
        var currentPage = $('#flipbook').turn('page');
        // Select the item that corresponds to the current page
        if ( this._itemPage[currentPage]!==undefined ) {
          this.$el.menu('selectItem', this._itemPage[currentPage], true);
        } else {
          var currentView = $('#flipbook').turn('view', null, true);
          if ( this._itemPage[currentView[0]]!==undefined ) {
            this.$el.menu('selectItem', this._itemPage[currentView[0]], true);
          } else if ( this._itemPage[currentView[1]]!==undefined ) {
            this.$el.menu('selectItem', this._itemPage[currentView[1]], true);
          } else {
             this.$el.menu('clearSelection');
          }
        }
        this.hide(false);
        this.$el.menu('showRelativeTo', $('#ui-icon-table-contents'));
      },
    
      hide: function(confirmation) {
        var that = this;
    
        if ( confirmation ) {
          if (!this._hideTimer) {
            this._hideTimer = setTimeout(function() {
              that.$el.menu('hide');
              this._hideTimer = null;
            }, 200);
          }
        } else {
          if (this._hideTimer) {
            clearInterval(this._hideTimer);
            this._hideTimer = null;
          }
        }
      },
    
      _vmouseover: function() {
        ControlsView.getInstance().hideOptions(false);
        this.hide(false);
      },
    
      _vmouseout: function() {
        this.hide(true);
      },
    
      _vmousemove: function(event) {
        ControlsView.getInstance().stopFade();
        event.donotFade = true;
      }
    });
    
    /* * Miniatures View * */
    
    var MiniaturesView = SingleView.extend({
      el: '#miniatures',
    
      events: {
        refreshPicture: '_refreshPictureEvent'
      },
    
      initialize: function() {
        var that = this;
        $(window).on('orientationchange', function(event) {
          that.hide();
        });
        this.$el.hide();
      },
    
      render: function() {
        this.$el.miniatures({
          flipbook: $('#flipbook'),
          disabled: true
        });
      },
    
      _refreshPictureEvent: function(event, pageNumber, $pageElement) {
        var settings = window.FlipbookSettings,
          imgSrc = settings.pageFolder+'/'+pageNumber+'/'+pageNumber+'thumb.jpg',
          $img = $pageElement.find('img');
    
        if (!$img[0]) {
          $pageElement.html('<img width="100%" height="100%" src="'+imgSrc+'"/>');
        } else {
         $img.attr('src', imgSrc);
        }
      },
      
      show: function() {
        var that = this;
        this.$el.show();
        this._visible = true;
    
        $('#viewer').one('vmousedown', $.proxy(MiniaturesView.getInstance(), 'hide'));
        if (this.$el.hasClass('ui-miniatures-slider-open')) {
          $('#ui-icon-miniature').addClass('ui-ui-icon-on');
        }
        setTimeout(function() {
          if ( that._visible ) {
            $('body').addClass('show-miniatures');
            that.$el.miniatures('disable', false).miniatures('refresh');
          }
        }, 5);
      },
    
      hide: function() {
        var that = this;
    
        this._visible = false;
    
        $('body').removeClass('show-miniatures');
        $('#ui-icon-miniature').removeClass('ui-ui-icon-on');
        $('#viewer').off('vmousedown', MiniaturesView.getInstance().hide);
        
        this.$el.removeClass('ui-miniatures-slider-open');
        setTimeout(function() {
          if ( !that._visible ) {
            that.$el.hide().miniatures('disable', true);
          }
        }, 300);
      },
    
      isOpened: function() {
        return this.$el.hasClass('ui-miniatures-slider-open');
      }
    });
    
    /* * * * */
    var ControlsView = SingleView.extend({
      el: '#controls',
      _fadeTimer: null,
      _hasFadeListener: true,
      events: {
        'vmouseover #ui-icon-expand-options': '_vmouseoverIconExpand',
        'vmouseover #ui-icon-toggle': '_vmouseoverIconExpand',
        'vmouseover #options': '_vmouseoverOptions',
        'vmouseout #options': '_vmouseoutOptions',
        'tap #ui-icon-expand-options': '_tapIconExpand'
      },
    
      initialize: function() {
        var eventNameToFade = (Turn.isTouchDevice) ? 'vmousedown' : 'vmousemove';
        $(document).on(eventNameToFade, $.proxy(this, '_fade'));
    
        this.events[eventNameToFade+' .all'] = '_preventFade';
        $('#miniatures').on(eventNameToFade, $.proxy(this, '_preventFade'));
        $('#zoom-slider-view').on(eventNameToFade, $.proxy(this, '_preventFade'));
      },
    
      _fade: function(event) {
        if (!event.donotFade) {
          var that = this;
    
          if (event.pageY > $('#viewer').height()+20) {
            if (this.$el.hasClass('hidden-controls')) {
              this.$el.removeClass('hidden-controls');
            }
          }
    
          if (this._fadeTimer) {
            clearInterval(this._fadeTimer);
          }
    
          this._fadeTimer = setTimeout(function() {
            if (!MiniaturesView.getInstance().isOpened()) {
              that.$el.removeClass('extend-ui-options');
              that.$el.addClass('hidden-controls');
              ZoomSliderView.getInstance().hide();
            }
          }, 1000);
       }
      },
    
      stopFade: function() {
        if (this._fadeTimer) {
          clearInterval(this._fadeTimer);
          this._fadeTimer = null;
        }
      },
    
      _preventFade: function(event) {
        this.stopFade();
        event.donotFade = true;
      },
    
      _vmouseoverIconExpand: function(event) {
        if (!Turn.isTouchDevice) {
          this.showOptions();
        }
      },
    
      _vmouseoverOptions: function() {
        this.hideOptions(false);
      },
      _vmouseoutOptions: function() {
        this.hideOptions(true);
      },
      
      _tapIconExpand: function() {
        this.showOptions();
      },
    
      showOptions: function() {
        this.$el.removeClass('hidden-controls');
        this.$el.addClass('extend-ui-options');
        this.hideOptions(false);
      },
    
      hideOptions: function( confirmation ) {
        var that = this;
        if ( confirmation ) {
          if (! this._hideOptionTimer ) {
            this._hideOptionTimer = setTimeout(function() {
              that._hideOptionTimer = null;
              that.$el.removeClass('extend-ui-options');
            }, 100);
          }
        } else {
          if (this._hideOptionTimer) {
            clearInterval(this._hideOptionTimer);
            this._hideOptionTimer = null;
          }
        }
      }
    });
    
    /* * Options View * */
    
    var OptionsView = SingleView.extend({
      el: '#options',
    
      events: {
        'willShowHint': '_willShowHint',
        'vmouseover #ui-icon-zoom': '_vmouseoverIconZoom',
        'vmouseout #ui-icon-zoom': '_vmouseoutIconZoom',
        'vmousedown': '_vmousedown',
        'tap .ui-icon': '_tapIcon'
      },
    
      initialize: function() {
        var $el = this.$el;
      },
    
      render: function() {
        this.$el.tooltips({
          positions: 'top,left'
        });
      },
    
      _willShowHint: function(event, $target) {
        this.$el.tooltips('options', {positions: 'top,left'});
      },
    
      _vmouseoverIconZoom: function(event) {
        var $sliderView = $('#zoom-slider-view'),
          $zoomIcon = $(event.currentTarget),
          thisOffset = Turn.offsetWhile($zoomIcon[0], function(el) { return el.className!='catalog-app'; });
    
        $sliderView.css({
            left: thisOffset.left,
            top: 'auto',
            bottom: 5,
            right: 'auto'
          });
    
        $('#zoom-slider').slider('style', 'vertical');
        ZoomSliderView.getInstance().show();
      },
    
      _vmouseoutIconZoom: function(event) {
        ZoomSliderView.getInstance().hide(true);
      },
    
      _vmousedown: function(event) {
        event.stopPropagation();
      },
    
      _tapIcon: function(event) {
        var $icon = $(event.currentTarget);
        switch ($icon.attr('id')) {
          case 'ui-icon-table-contents':
          break;
          case 'ui-icon-miniature':
            var miniatures = MiniaturesView.getInstance(),
              willHide =  miniatures.isOpened();
    
            if (willHide) {
              miniatures.hide();
            } else {
              $('#miniatures').addClass('ui-miniatures-slider-open');
              miniatures.show();
            }
          break;
          case 'ui-icon-zoom':
            // Will show the zoom slider
          break;
          case 'ui-icon-share':
            ShareBox.getInstance().show();
          break;
          case 'ui-icon-full-screen':
            Turn.toggleFullScreen();
          break;
    
          case 'ui-icon-toggle':
            $('#controls').toggleClass('extend-ui-options');
          break;
        }
      }
    });
    
    
    /* * Zoom Slider View * */
    
    var ZoomSliderView = SingleView.extend({
      el: '#zoom-slider-view',
    
      events: {
        'changeValue #zoom-slider': '_changeValueEvent',
        'slide #zoom-slider': '_slideEvent',
        'vmousedown #zoom-slider': '_vmousedown',
        'vmouseover': '_vmouseover',
        'vmouseout': '_vmouseout'
      },
    
      render: function() {
        this.$el.find('#zoom-slider').slider({
          style: 'vertical',
          min: 0,
          max: 10
        });
      },
      
      _changeValueEvent: function(event, val) {
        var zoom = val/10 * ($('#flipbook').turn('maxZoom')-1) + 1;
        $('#flipbook').turn('zoom', zoom, {animate: false});
      },
    
      _slideEvent: function(event, val) {
        var zoom = val/10 * ($('#flipbook').turn('maxZoom')-1) +1;
        $('#flipbook').turn('zoom', zoom, {animate: false});
      },
    
      _vmousedown: function(event) {
        event.stopPropagation();
      },
    
      _vmouseover: function(event) {
        this.show();
        ControlsView.getInstance().hideOptions(false);
      },
    
      _vmouseout: function(event) {
        var that = this;
        this.hide(true);
      },
    
      show: function() {
        var $sliderEl = this.$el.find('#zoom-slider');
    
        $sliderEl.slider('disable', false);
    
        $('#zoom-slider-view').addClass('show-zoom-slider');
        $('#ui-icon-zoom').addClass('ui-icon-contrast');
    
        // Recalculate the slider's value
        $sliderEl.slider('value',
          Math.round(($('#flipbook').turn('zoom')-1) / ($('#flipbook').turn('maxZoom')-1) * 10), true);
        
        $('body').one('vmousedown', $.proxy(this, 'hide'));
    
        this.hide(false);
      },
    
      hide: function(confirmation) {
        var that = this;
        if ( confirmation ) {
          if (!this._hideTimer) {
            this._hideTimer = setTimeout(function() {
              var $sliderEl = that.$el.find('#zoom-slider');
    
              $sliderEl.slider('disable', true);
              $('#zoom-slider-view').removeClass('show-zoom-slider');
              $('#ui-icon-zoom').removeClass('ui-icon-contrast');
              setTimeout(function() {
                if (!$('#zoom-slider-view').hasClass('show-zoom-slider')) {
                  $('#zoom-slider-view').css({top: '', left: ''});
                }
              }, 300);
              $('body').off('vmousedown', that.hide);
              that._hideTimer = null;
            }, 100);
          }
        } else {
          if (this._hideTimer) {
            clearInterval(this._hideTimer);
            this._hideTimer = null;
          }
        }
      }
    });
    
    
    /* * Share Box View * */
    
    var ShareBox = SingleView.extend({
      className: 'ui-share-box',
      tagName: 'div',
      events: {
        'tap': '_tapEvent',
        'tap .ui-icon': '_tapIconEvent'
      },
    
      initialize: function() {
        var html = '';
    
        html +='<i class="close-mark"></i>';
        html +='<div class="ui-share-options">';
          html +='<a title="Facebook" class="ui-icon show-hint"><i class="fab fa-facebook"></i></a>';
          html +='<a title="WhatsApp" class="ui-icon show-hint"><i class="fab fa-whatsapp"></i></a>';
          html +='<a title="Twitter" class="ui-icon show-hint"><i class="fab fa-twitter"></i></a>';
          html +='<a title="Linkedin" class="ui-icon show-hint"><i class="fab fa-linkedin-in"></i></a>';
          html +='<a title="Email" class="ui-icon show-hint"><i class="fa fa-envelope"></i></a>';
        html +='</div>';
    
        this.$el.html(html);
        this.$el.appendTo($('body'));
      },
    
      render: function() {
        this.$el.tooltips({positions: 'top'});
      },
    
      _tapEvent: function(event) {
        this.hide();
      },
    
      _tapIconEvent: function(event) {
        var $target = $(event.currentTarget),
        currentUrl = encodeURIComponent(window.location.href),
        title = $target.attr('title') || $target.attr('v-title'),
        text = encodeURIComponent(window.FlipbookSettings.shareMessage),
        winOptions = 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600';
    
        switch (title) {
          case 'Facebook':
            window.open('https://www.facebook.com/sharer/sharer.php?u='+currentUrl+'&t='+text, '', winOptions);
          break;
          case 'Twitter':
            window.open('https://twitter.com/share?text='+text+' '+currentUrl, '', winOptions);
          break;
          case 'Google+':
            window.open('https://plus.google.com/share?url='+currentUrl, '', winOptions);
          break;
          case 'Linkedin':
            window.open('http://www.linkedin.com/shareArticle?mini=true&url='+currentUrl+'&title='+text, '',  winOptions);
          break;
          case 'Email':
          window.location.href='mailto:?body='+text+' '+currentUrl;
          break;
          case 'WhatsApp':
            window.open('https://api.whatsapp.com/send?text='+'*'+window.document.title+'* '+currentUrl, '',  winOptions);
          break;
        }
    
        event.stopPropagation();
      },
    
      show: function() {
        var that = this;
        setTimeout(function() {
          that.$el.addClass('show-ui-share-box');
        }, 1);
      },
    
      hide: function() {
        this.$el.removeClass('show-ui-share-box');
      }
    });
    
    var AppRouter = Backbone.Router.extend({
      routes: {
        'page/:page': '_page',
      },
      _page: function(page) {
        if ( FlipbookView.instance ) {
          $('#flipbook').turn('page', page);
        } else {
          window.FlipbookSettings.options.page = parseInt(page, 10);
        }
      }
    }, {
      getInstance: function(context) {
        context = context || this;
        if (!context.instance) {
          context.instance = new this();
        }
        return context.instance;
      }
    });
    
    
    /* *  * */
    function bootstrap() {
      // Initialize routes
      AppRouter.getInstance();
      Backbone.history.start();
    
      // Initialize views
      FlipbookView.getInstance();
      PageSliderView.getInstance();
      MiniaturesView.getInstance();
      OptionsView.getInstance();
      ZoomSliderView.getInstance();
      ControlsView.getInstance();
      TableContentsView.getInstance();
    
    
      $(window).on('orientationchange', function(event) {
        $(window).scrollTop(0);
        $(window).scrollLeft(0);
      });
    
      $(document).on('vmousemove', function(event) {
        event.preventDefault();
      });
    
      $(window).load(function() {
        $(window).scrollTop(0);
      });
    }
    
    $(document).ready(bootstrap);
    
    })(window, jQuery, Backbone);
  
function pageNumberRightSVG(text){
  return "<svg version='1.2' baseProfile='tiny' id='pageNumberRight' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1051.5 216' xml:space='preserve'><path fill='var(--color-red)' d='M1040.5,78H202.32C189.64,38.55,152.66,10,109,10c-54.12,0-98,43.88-98,98s43.88,98,98,98	c43.66,0,80.64-28.55,93.32-68h838.18V78z'/><text x='50' y='165' style='font-family:var(--bebas-neue);font-size:10em;fill:white'>" + text + "</text></svg>";
}

function pageNumberLeftSVG(text){
  return "<svg version='1.2' baseProfile='tiny' id='pageNumberLeft' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 1051.5 216' xml:space='preserve'><path fill='var(--color-red)' d='M11,78h838.18c12.67-39.45,49.66-68,93.32-68c54.12,0,98,43.88,98,98s-43.88,98-98,98 c-43.66,0-80.64-28.55-93.32-68H11V78z'/><text x='880' y='165' style='font-family:var(--bebas-neue);font-size:10em;fill:white'>" + text + "</text></svg>";
}

function buttonModalSVG(text,x,y,size,bg,border,textColor){
  return "<svg width='100%' version='1.2' baseProfile='tiny' id='buttonModal' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 459 150' xml:space='preserve'><path fill='" + bg + "' d='M424.01,150H34.99C15.67,150,0,134.33,0,115.01V34.99C0,15.67,15.67,0,34.99,0h389.01	C443.33,0,459,15.67,459,34.99v80.01C459,134.33,443.33,150,424.01,150z'/><path fill='" + border + "' d='M424.01,10C437.79,10,449,21.21,449,34.99v80.01c0,13.78-11.21,24.99-24.99,24.99H34.99	C21.21,140,10,128.79,10,115.01V34.99C10,21.21,21.21,10,34.99,10H424.01 M424.01,0H34.99C15.67,0,0,15.67,0,34.99v80.01 C0,134.33,15.67,150,34.99,150h389.01c19.33,0,34.99-15.67,34.99-34.99V34.99C459,15.67,443.33,0,424.01,0L424.01,0z'/><text x='" + x + "' y='" + y + "' style='font-family:var(--bebas-neue);font-size:" + size + ";fill:" + textColor + "'>" + text + "</text></svg>";
}

function authorRightSVG(text,bg,x){
  return "<svg version='1.1' id='author' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 2470.5 216' style='enable-background:new 0 0 2470.5 216;' xml:space='preserve'><path fill='" + bg + "' d='M2457.7,202.9H105.9C53.5,202.9,11,160.4,11,108v0c0-52.4,42.5-94.9,94.9-94.9h2351.9V202.9z'/><text x='" + x + "' y='140' style='font-size:4.3em;fill:white;font-family: sans-serif;'>" + text + "</text></svg>";
}

function authorLeftSVG(text,bg,x){
  return "<svg version='1.1' id='author' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 2470.5 216' style='enable-background:new 0 0 2470.5 216;' xml:space='preserve'><path fill='" + bg + "' d='M11,202.9V13.1h2351.9c52.4,0,94.9,42.5,94.9,94.9l0,0c0,52.4-42.5,94.9-94.9,94.9H11L11,202.9z'/><text x='" + x + "' y='140' style='font-size:4.3em;fill:white;font-family: sans-serif;'>" + text + "</text></svg>";
}

function audioPrintSVG(bgColorAudio,borderColorAudio,linkAudio,bgColorPrint,borderColorPrint,linkPrint,display, linkToModal){
  return "<svg version='1.1' id='audioPrint' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' viewBox='0 0 327.6 150' style='overflow: visible;' xml:space='preserve'><foreignObject x='0' y='0' width='100%' height='100%' style='overflow:visible;'><div xmlns='http://www.w3.org/1999/xhtml' style='width:100%;display:inline-flex;place-content:center;margin-top:.5%;font-size: 5.3em;grid-gap:9%;'><span style='display: " + display + "; color: white; font-size: .4em; text-align: center; background-color: var(--color-blue); border-radius: 140px; padding: 30px 120px 30px 30px; margin-left: -250px; margin-right: -152px; width: 350px; '>Vídeo relacionado</span><a class='audio' id='" + linkToModal + "-modal' style='display: " + display + "; background-color:" + bgColorAudio + ";color:white;box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); animation: pulse-2 2s 3;'><i style='font-size: .9em;' class='fas fa-video'></i></a><a class='print' style='background-color:" + bgColorPrint + ";color:white;box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); animation: pulse-2 2s 3;' href='" + linkPrint + "' download><i class='fas fa-print'></i></a></div></foreignObject></svg>";
}

// Esta parte es para los audios
// <audio id='audioCartaDelPresidente' src='../../../assets/audio/carta-del-presidente.mp4'></audio><script>let buttonAudio = document.getElementById('audioPage4');let audioPage4 = document.getElementById('audioCartaDelPresidente');buttonAudio.addEventListener('click',() => {audioPage4.play();});</script>

let textForArticle = "";
let pageForArticle = 0;