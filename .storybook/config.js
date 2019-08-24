import { configure, addParameters, addDecorator } from '@storybook/react';
import { purple_theme } from './theme';
import { withInfo } from '@storybook/addon-info';
import { withKnobs } from '@storybook/addon-knobs/react';
import { withSmartKnobs } from 'storybook-addon-smart-knobs';
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport';

// automatically import all files ending in *.stories.js
const req = require.context('../stories', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(
  withInfo({
    styles: {
      button: {
        base: {
          fontFamily: 'sans-serif',
          fontSize: '14px',
          fontWeight: '500',
          display: 'block',
          position: 'fixed',
          border: 'none',
          background: '#14558f',
          color: '#fff',
          padding: '5px 15px',
          cursor: 'pointer',
        },
        topRight: {
          bottom: 0,
          right: 0,
          top: 'unset',
          borderRadius: '5px 0 0 0',
        },
      },
    },
  }),
);

addDecorator(withKnobs);
addDecorator(withSmartKnobs);

addParameters({ options: { theme: purple_theme, panelPosition: 'right' } });

addParameters({ viewport: { viewports: INITIAL_VIEWPORTS } });

configure(loadStories, module);
