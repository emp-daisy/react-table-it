import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from '../src';
import { ColumnsFixtures, TableFixtures } from '../fixtures/data';

storiesOf('Sorting', module).add('Sort column', () => (
  <Table
    columns={ColumnsFixtures.map(data => ({ ...data, sortable: true }))}
    data={TableFixtures(20)}
  />
));
