const MODULE_NAME = 'player-images';

const localize = (path) => {
  return game.i18n.localize(`${MODULE_NAME}.${path}`);
}

/**
 * The function returns the value for a register setting
 *
 * @param {string} key - the name of the setting
 *
 * @return {*}
 */
const getSetting = (key) => game.settings.get(MODULE_NAME, key);

/**
* The function calls the foundry register setting function with the module name
*
* @param {Object} setting
* @param {string} setting.key - the name of the setting
* @param {Object} setting.options - the properties of the setting
*/
const registerSetting = (setting) => (
  game.settings.register(MODULE_NAME, setting.key, setting.options)
);

/**
* Register all the module's settings
*/
const registerSettings = () => {
  const settings = [
    {
      key: "imageSize",
      options: {
        name: localize('settings.size.name'),
        hint: localize('settings.size.hint'),
        type: Number,
        default: 105,
        range: {
          min: 50,
          step: 5,
          max: 200,
        },
        config: true,
        restricted: true,
      }
    },
  ];

  settings.forEach(registerSetting);
}

Hooks.on('init', () => {
  registerSettings();
});

Hooks.on('renderPlayerList', (playerList, html) => {
  console.log(playerList);
  playerList.options.resizable = true;
  const users = [...game.users.values()]
    .filter((user) => user);
  const size = getSetting('imageSize');
  
  users.forEach((user) => {
    const item = html.find(`[data-user-id="${user.id}"]`);
    const name = item.find('.player-name ');
    const text = user.charname || user.name;
    const gm = (user.role === 4 && user.charname) ? '[GM] ' : '';

    name.text(`${gm}${text}`);
    item.addClass('inline');

    if (!user.character) {
      return;
    }

    const image = user.character.img;
    
    // insert a button at the end of this element
    item.append(
      `<img
        src="${image}"
        title="${user.character.name}"
        class="player-list-image medium"
        style="width: ${size}px"
      />`
    );
  });
});