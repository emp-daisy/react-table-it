import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from '../src';
import { ColumnsFixtures, TableFixtures } from '../fixtures/data';

storiesOf('Pagination', module)
  .add('Bottom Pagination', () => (
    <Table columns={ColumnsFixtures} data={TableFixtures} paginationPosition="bottom" />
  ))
  .add('Double Pagination', () => (
    <Table columns={ColumnsFixtures} data={TableFixtures} paginationPosition="both" />
  ));
