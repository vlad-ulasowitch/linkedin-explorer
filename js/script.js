'use strict';

(function() {

  console.log('loaded');

  const JQUERY_URL = 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js';

  const timeout = time => new Promise(resolve => setTimeout(resolve, time));

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = false;
  script.addEventListener('load', () => {
    jQuery.noConflict();

    const basicPlugin = {
      app: undefined,
      setApp: function (app) {
        this.app = app;
      },
      init: function () {
  
      },
      $: function () {
        return this.app.contentWindow.jQuery.apply(this, arguments);
      }
    };
  
    const iTAPlugin = jQuery.extend(jQuery.extend({}, basicPlugin), {
      links: [],
      currentIndex: 0,
      currentPage: '',
      pageNumber: 1,
      openToWork: [],
      init: function () {
        try {
          document.getElementById(loader.panelId).removeChild(document.getElementById('ita-btn'));
        } catch (e) {
  
        }
  
        const btn = document.createElement('button');
        btn.style = 'background-color: white;';
        btn.id = 'ita-btn';
        btn.innerHTML = 'Add iTA People';
        btn.onclick = function () {
          this.findOpenToWorkEngineers();
        }.bind(this);
        document.getElementById(loader.panelId).appendChild(btn);
      },
      nextPage() {
        console.log('Next page...')
        const nextPageButton = this.app.contentWindow.document.querySelector('.artdeco-pagination__button.artdeco-pagination__button--next.artdeco-button.artdeco-button--muted.artdeco-button--icon-right.artdeco-button--1.artdeco-button--tertiary.ember-view')
        if (nextPageButton.disabled) {
          console.log(`No more pages are available`)
          return true
        }
        console.log(`Go to the next page`)
        this.pageNumber++
        this.app.contentWindow.location.href = this.currentPage + `&page=` + this.pageNumber
        return false
      },
      async visitLinks() {
        let userLink = this.links[this.currentIndex];

        console.log(`visiting ${userLink.href}`);

        this.app.contentWindow.location.href = userLink.href

        await timeout(3000)

        let openToWorkCard = this.app.contentWindow.document.querySelector('.poc-opportunities-card__text-content')

        if (openToWorkCard) {
          console.log(`User ${userLink} is open to work`)
          this.openToWork.push(userLink.href)
        }
        this.app.contentWindow.location.href = this.currentPage

        if (this.currentIndex === this.links.length - 1) {
          console.log('Open to work: ', this.openToWork)
          return
        }

        this.currentIndex++
        console.log('Index', this.currentIndex)
        this.visitLinks()
      },
      findOpenToWorkEngineers: function() {
        console.log('Looking for open to work engineers...')

        this.currentPage = this.app.contentWindow.location.href;
        this.links = [...this.app.contentWindow.document.querySelectorAll('.entity-result__title-text > .app-aware-link')].slice(0, 2);
        console.log('User profiles: ', this.links);
        this.currentIndex = 0;
        this.visitLinks();
      }
    });
  
    const loader = {
      iframeId: 'loader-inner-iframe-5079520',
      panelId: null,
      contentWindow: undefined,
      plugins: [],
      init: function () {
        this.panelId = this.iframeId + '345345';
        this.createIframe(true);
        this.windowInit();
        this.initPlugins();
      },
      createIframe: function (removeHTML) {
  
        removeHTML = removeHTML || false;
        try {
          document.body.removeChild(document.getElementById(this.iframeId));
        } catch (e) {
  
        }
        const iframe = document.createElement('iframe');
        iframe.src = document.location.href;
        iframe.id = this.iframeId;
        iframe.width = '100%';
        iframe.height = jQuery(window).height();
  
        if (removeHTML) {
          document.body.innerHTML = '';
        }
        document.body.appendChild(iframe);
        this.contentWindow = iframe.contentWindow;
  
        this.createPanel();
      },
      createPanel: function () {
        try {
          document.body.removeChild(document.getElementById(this.panelId));
        } catch (e) {
  
        }
  
        const div = document.createElement('div');
        div.style = 'position: absolute; top: 5px; left: 20px; font-weight: bold;';
        div.id = this.panelId;
        div.innerHTML = '';
        document.body.appendChild(div);
      },
      windowInit: function () {
        if (this.contentWindow.document.getElementById('a11y-notification') !== null) {
          const script = this.contentWindow.document.createElement('script');
          script.type = 'text/javascript';
          script.async = false;
          script.src = JQUERY_URL;
          this.contentWindow.document.getElementsByTagName('head')[0].appendChild(script);
          jQuery.noConflict();
          return;
        }
        setTimeout(this.windowInit.bind(this), 100);
      },
      initPlugins: function () {
        this.plugins.forEach(function (plugin) {
          plugin.init();
        });
      },
      addPlugin: function (plugin) {
        this.plugins.push(plugin);
        plugin.setApp(this);
        return this;
      }
    };
  
    loader.addPlugin(iTAPlugin);
    loader.init();
  });
  script.src = JQUERY_URL;
  document.getElementsByTagName('head')[0].appendChild(script);
}());