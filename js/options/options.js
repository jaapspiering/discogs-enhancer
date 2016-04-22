/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido (c) 2016
 * @url: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 */

$(document).ready(function() {

  let
      visible = false,
      modal = '<div id="optionsModal" class="options-modal" style="display: none;">' +
                '<div class="options-modal-content">' +
                  '<span class="options-close">x</span>' +
                  '<h3>Well, aren\'t you clever!</h3>' +
                  '<ul class="options">' +
                    '<li>' +
                      '<input id="analytics" name="analytics" type="checkbox" value="analytics" />' +
                      '<label for="analytics">Analytics</label>' +
                    '</li>' +
                    '<li>' +
                      '<input id="colorize" name="colorize" type="checkbox" value="colorize" />' +
                      '<label for="colorize">Colorize Prices</label>' +
                    '</li>' +
                    '<li>' +
                      '<input id="debug" name="debug" type="checkbox" value="debug" />' +
                      '<label for="debug">Debug Messages</label>' +
                    '</li>' +
                    '<li>' +
                      '<input id="unittests" name="unittests" type="checkbox" value="unittests" />' +
                      '<label for="unittests">Unit Tests</label>' +
                    '</li>' +
                    '<li>' +
                      '<label for="threshold" id="thresholdLabel">Threshold:</label>' +
                      '<input id="threshold" name="threshold" type="number" value="" max="10" min="0"/>' +
                    '</li>' +
                  '</ul>' +
                  '<a href="#" class="options-save button button_green" id="saveOptions">Save options &amp; refresh</a>' +
                '</div>' +
              '</div>';


  // Get them options
  function getOptions() {

    let
        analytics = resourceLibrary.options.analytics(),
        colorize = resourceLibrary.options.colorize(),
        debug = resourceLibrary.options.debug(),
        threshold = resourceLibrary.options.threshold(),
        unitTests = resourceLibrary.options.unitTests();


    if (analytics) { $('#analytics').prop('checked', true); }

    if (colorize) { $('#colorize').prop('checked', true); }

    if (debug) { $('#debug').prop('checked', true); }

    if (unitTests) { $('#unittests').prop('checked', true); }

    if (threshold) { $('#threshold').val(threshold); }
  }


  // Save them options
  function saveOptions() {

    let
        analytics = $('#analytics').prop('checked'),
        colorize = $('#colorize').prop('checked'),
        debug = $('#debug').prop('checked'),
        threshold = $('#threshold').val(),
        unitTests = $('#unittests').prop('checked');

    localStorage.setItem('analytics', JSON.stringify(analytics));

    localStorage.setItem('colorize', colorize);

    localStorage.setItem('debug', debug);

    localStorage.setItem('threshold', threshold);

    localStorage.setItem('unitTests', unitTests);

    resourceLibrary.appendNotice('Options have been successfully saved.', 'limeGreen');

    location.reload();
  }

  // event listener
  // TODO move these to external keyboard commands file
  document.onkeyup = function(e) {

    if (e.altKey && e.ctrlKey && e.which === 55) {

      if (!visible) {

        visible = true;

        $('.options-modal').show();

        getOptions();

        // Close it
        $('body').on('click', '.options-close', function() {

          $('.options-modal').hide();

          visible = false;
        });

        // Save it
        $('body').on('click', '.options-save', function() {

          saveOptions();
        });
      }

      return false;
    }

    // if (e.shiftKey && e.ctrlKey && e.which === 67) {
    //
    //   $('.currency-converter').toggleClass('show-converter');
    // }
  };

  $('body').append(modal);

  getOptions();
});
