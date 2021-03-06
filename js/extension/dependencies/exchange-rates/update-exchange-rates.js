
/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

resourceLibrary.ready(() => {

  let
      debug = resourceLibrary.options.debug(),
      language = resourceLibrary.language(),
      now = Date.now(),
      twoHours = (60 * 1000) * 120,
      updateRatesObj = resourceLibrary.getItem('updateRatesObj') || setUpdateRatesObj(),
      userCurrency = resourceLibrary.getItem('userCurrency');

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Sets the default currency object values
   *
   * @method setUpdateRatesObj
   * @return {object}
   */
  function setUpdateRatesObj() {

    let obj = {
      currency: null,
      data: null
    };

    // Save it...
    resourceLibrary.setItem('updateRatesObj', obj);

    // Get it again because reasons
    return resourceLibrary.getItem('updateRatesObj');
  }

  /**
   * Updates the exchange rates from Fixer.io
   *
   * @method updateRates
   * @return {object}
   */
  async function updateRates() {

    let url = `https://discogs-enhancer.com/rates?base=${userCurrency}`;

    try {

      let response = await fetch(url),
          data = await response.json();

      updateRatesObj.data = data;

      // Set last saved currency
      // If different from userCurrency it will trigger exchange rates update
      updateRatesObj.currency = userCurrency;
      updateRatesObj.data.lastChecked = now;

      if ( debug ) {

        console.log('*** Fresh rates ***');
        console.log(`Last update: ${updateRatesObj.data.date} language: ${language} Currency: ${userCurrency}`);
        console.log('rates:', updateRatesObj.data.rates);
      }

      // Save object to localStorage
      resourceLibrary.setItem('updateRatesObj', updateRatesObj);
      updateRatesObj = resourceLibrary.getItem('updateRatesObj');

    } catch (err) {
      return console.log('Could not get currency exchange rates.', err);
    }
  }

  // ========================================================
  // Update functionality
  // ========================================================

  switch ( true ) {

    // if there's no rates prop it could
    // mean possible data corruption
    case !updateRatesObj.data:
    case typeof updateRatesObj.data !== 'object':

      // kill it with fire
      localStorage.removeItem('updateRatesObj');
      updateRatesObj = setUpdateRatesObj();
      updateRates();
      break;

    // Data is stale or user has changed currency
    case now > updateRatesObj.data.lastChecked + twoHours:
    case userCurrency !== updateRatesObj.currency:

      // Remove old prices.
      // This will trigger a user alert if something tries to access
      // these rates before they have been returned from fixer.io
      updateRatesObj.data = null;

      if ( debug ) {
        console.log(' ');
        console.log('Getting fresh rates... One moment please.');
      }

      updateRates();
      break;

    default:

      if ( debug ) {

        console.log(' ');
        console.log(`Using cached rates: ${updateRatesObj.data.date} language: ${language} Currency: ${userCurrency}`);
        console.log('rates:', updateRatesObj.data);
      }

      break;
  }

  // Store user's language preference
  resourceLibrary.setItem('language', language);
});
