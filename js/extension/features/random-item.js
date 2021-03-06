/**
 *
 * Discogs Enhancer
 *
 * @author: Matthew Salcido
 * @website: http://www.msalcido.com
 * @github: https://github.com/salcido
 *
 * This will append a small icon to the nav bar that
 * when clicked will show a random item from the user's
 * collection. The functionality is identical to the
 * Random Item feature in the collection page but
 * makes it accessable from the nav bar.
 */

resourceLibrary.ready(() => {

  let button,
      tooltip,
      user = document.querySelector('#site_account_menu .user_image').alt,
      iconSize = '14px',
      icon = `<li style="position: relative;">
                <a class="nav_group_control de-random-item" style="font-size: ${iconSize}; margin-top: 2px;>
                  <span style="cursor: pointer;">
                    <span style="color: white;">\u267A</span>
                  </span>
                </a>
                <div class="tooltip fade bottom in de-random-tooltip" style="top: 56px; left: -30px; display:none;">
                  <div class="tooltip-arrow"></div>
                  <div class="tooltip-inner">Random Item</div>
                </div>
              </li>`;

  // ========================================================
  // Functions
  // ========================================================

  /**
   * Requests a random item from the user's collection
   * @returns {assignment}
   */
  async function getRandomItem() {

    let
        action = 'Action.RandomItem=Random%2BItem',
        headers = { 'content-type': 'application/x-www-form-urlencoded' },
        url = `https://www.discogs.com/user/${user}/collection`,
        initObj = {
          body: action,
          credentials: 'include',
          headers: headers,
          method: 'POST'
        },
        response = await fetch(url, initObj),
        location = response.url;

    window.location.href = location;
  }

  // ========================================================
  // DOM Setup
  // ========================================================

  // Append the markup
  if ( user ) {
    document.getElementById('activity_menu').insertAdjacentHTML('beforeend', icon);
  }

  button = document.querySelector('.de-random-item');
  tooltip = document.querySelector('.de-random-tooltip');

  // Add click functionality to badge markup
  button.addEventListener('click', () => {

    button.classList.add('rotate');
    getRandomItem();
  });

  // Show/Hide the tooltip
  button.addEventListener('mouseover', () => { tooltip.style.display = 'block'; });
  button.addEventListener('mouseleave', () => { tooltip.style.display = 'none'; });
});
