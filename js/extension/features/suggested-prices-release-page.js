/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * ---------------------------------------------------------------------------
 * Overview
 * ---------------------------------------------------------------------------
 *
 * This feature will compare the listed prices of a release with the prices
 * suggested by Discogs.
 *
 * The script is initiated with the code that follows the `Init / DOM setup` comment block.
 *
 */
resourceLibrary.ready(() => {

  let href = window.location.href;

  if ( href.includes('/sell/release/') ) {

    let
        extract,
        items,
        nodeId,
        priceContainer = [],
        priceKey = {},
        prices,
        releaseId,
        symbol,
        userCurrency = resourceLibrary.getItem('userCurrency');

    // ========================================================
    // Functions (Alphabetical)
    // ========================================================

    /**
     * Calculates all the prices and appends them to the DOM
     * @returns {function|undefined}
     */
    window.appendPrices = function appendPrices() {

      // Insert price comparisons into each item on the page...
      document.querySelectorAll('td.item_price').forEach((listing, i) => {

        // Since adding everlasting marketplace scrolling to individual release
        // pages, make sure the empty pagination <td> elements are not
        // included when this each loop runs...
        if ( priceContainer[i] && priceContainer[i].convertedPrice ) {

          let
              actual = priceContainer[i].convertedPrice,
              colorizePrices = resourceLibrary.options.colorize(),
              suggested = priceKey['post:suggestedPrices'][priceContainer[i].mediaCondition],
              difference = suggested - actual,
              //
              amount = '',
              markup,
              percentage = ( (difference / suggested) * 100 ).toFixed(0),
              printPrice = resourceLibrary.localizeSuggestion(symbol, suggested),
              spanOuter = document.createElement('span'),
              threshold = resourceLibrary.options.threshold() || 0;

          document.querySelectorAll('.de-price-preloader').forEach(e => e.remove());

          // Debugging
          logOutput(percentage, difference, suggested);

          // No data from Discogs
          // ---------------------------------------------------------------------------
          if ( !isFinite(percentage) ) {

            spanOuter.className = 'converted_price de-price';
            spanOuter.innerHTML = resourceLibrary.css.noData;

            listing.insertAdjacentHTML('beforeend', spanOuter);
            return resourceLibrary.fade(listing);
          }

          amount = resourceLibrary.getAmountString(percentage, threshold);
          markup = makePriceMarkup(percentage, printPrice, amount);

          if ( !listing.querySelector('.de-price') ) {
            listing.insertAdjacentElement('beforeend', markup);
          }

          resourceLibrary.fade(listing);

          if ( amount !== 'more' && colorizePrices ) {

            listing.querySelector('.price').classList.add('green');
          }
        }
      });
    };

    /**
     * Make sure the user has Seller permissions
     * @param {object} result The returned markup from Discogs
     * @returns {undefined}
     */
    function checkForSellerPermissions(result) {

      // User does not have seller setup
      if ( result.innerHTML.includes(resourceLibrary.unregistered)
           && !priceKey['post:suggestedPrices'] ) {

        document.querySelectorAll('.de-price-preloader').forEach(e => e.remove());

        document.querySelectorAll('td.item_price').forEach(listing => {

          listing.insertAdjacentHTML('beforeend', resourceLibrary.css.pleaseRegister);
        });

        return;
      }
    }

    /**
     * Collects the prices / conditions from the DOM
     * @returns {function}
     */
    function getPrices() {
      // Grab price / condition data from elements
      prices.forEach((price, i) => {
        priceContainer.push({price: price.textContent, mediaCondition: items[i]});
      });

      resourceLibrary.matchSymbols(priceContainer);
      resourceLibrary.sanitizePrices(priceContainer);
      resourceLibrary.convertPrices(priceContainer);

      symbol = resourceLibrary.getSymbols(userCurrency, symbol);
    }

    /**
     * Starts price comparison process
     * @method init
     * @returns {undefined}
     */
    window.releasePricesInit = async function init() {

      let url = `https://www.discogs.com/sell/post/${releaseId}`,
          response = await fetch(url, { credentials: 'include' }),
          data = await response.text(),
          div = document.createElement('div'),
          selectorA = '.shortcut_navigable .item_description .media-condition-tooltip',
          selectorB = '.shortcut_navigable .item_description .item_condition span:nth-child(2)';

      document.querySelectorAll('.de-price').forEach(e => e.remove());

      if ( document.querySelectorAll('.media-condition-tooltip').length ) {

        items = [...document.querySelectorAll(selectorA)].map(e => e.dataset.condition);

      } else {
        // If the tooltip is missing, find the Media Condition via span:nth-child(2)
        items = [...document.querySelectorAll(selectorB)].map(e => e.textContent.trim());
      }

      priceContainer = [];
      prices = document.querySelectorAll('td.item_price span.price');
      div.innerHTML = data;
      nodeId = div.querySelector('#dsdata');
      priceKey = resourceLibrary.prepareObj(nodeId.outerHTML);

      checkForSellerPermissions(div);
      getPrices();
      window.appendPrices();
    };

    /**
     * Logs the values used to create the price comparison
     * @param  {number} perc percentage
     * @param  {number} diff difference
     * @param  {number} sugg suggested
     * @returns {undefined}
     */
    function logOutput(perc, diff, sugg) {

      let pAmt = perc > 0 ? '% less' : '% more',
          pct = Math.abs(perc),
          value = Math.abs(diff).toFixed(3),
          vAmt = diff > 0 ? ' less' : ' more';

      if ( resourceLibrary.options.debug() ) {

        console.log('Suggested: ', sugg);
        console.log('Difference: ', value + ' ' + userCurrency + vAmt);
        console.log('Percentage: ', pct + pAmt);
      }
    }

    /**
     * Generates suggested price markup
     * @param  {number} percentage The percentage of the price difference
     * @param  {string} printPrice The suggested price
     * @param  {string} qt Either 'more', 'less' or ''
     * @returns {object}
     */
    function makePriceMarkup(percentage, printPrice, qt) {

      let
          _class = qt === 'more' ? 'red' : 'green',
          desc = qt.length ? 'around ' : 'within ',
          plusmn = qt.length ? '' : '\u00B1',
          spanOuter = document.createElement('span'),
          spanPct = document.createElement('span'),
          spanSug = document.createElement('span'),
          spanPrice = document.createElement('span');

      spanOuter.textContent = desc;
      spanOuter.className = 'converted_price de-price';

      spanPct.textContent = `${plusmn} ${Math.abs(percentage)}% ${qt}`;
      spanPct.className = _class;

      spanSug.textContent = 'than suggested:';
      spanSug.className = 'd-block';

      spanPrice.textContent = printPrice;

      spanOuter.append(spanPct);
      spanOuter.append(spanSug);
      spanOuter.append(spanPrice);

      return spanOuter;
    }

    // ========================================================
    // UI Functionality
    // ========================================================

    // Fire init() on prev/next page transitions
    let pagination = document.querySelectorAll('ul.pagination_page_links a[class^="pagination_"], ul.pagination_page_links li.hide_mobile a');

    pagination.forEach(elem => {

      elem.addEventListener('click', () => {

        resourceLibrary.xhrSuccess(() => {
          // Only append prices once
          if ( !document.getElementsByClassName('.de-price').length ) {

            window.releasePricesInit();
          }
        });
      });
    });

    // ========================================================
    // Init / DOM setup
    // ========================================================

    // Remove mobile clutter
    document.querySelectorAll('.hide_desktop').forEach(e => e.remove());

    // Insert preloader animation
    document.querySelectorAll('td.item_price').forEach(price => {

      price.insertAdjacentHTML('beforeend', resourceLibrary.css.pricePreloader);
    });

    // Grab the releaseId from the URL
    extract = href.match(/([\d]+)/g);
    releaseId = extract[0];

    window.releasePricesInit();
  }
});
