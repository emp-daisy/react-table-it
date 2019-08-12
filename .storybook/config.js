import { configure, addParameters, addDecorator } from '@storybook/react';
import { purple_theme } from "./theme";
import { withA11y } from '@storybook/addon-a11y';
// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}
addDecorator(withA11y)
addParameters({
    options: {
      theme: purple_theme,
    },
});

configure(loadStories, module);
