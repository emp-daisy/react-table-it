import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from '../src'
import employee from '../fixtures/employee';

storiesOf("Pagination", module)
  .add("Bottom Pagination", () => (
    <Table
      columns={[
        {name: "First Name", selector: 'firstName', class: 'width-50'},
        {name: "Last Name", selector: 'lastName'}
      ]}
      data={employee}
      paginationPosition= 'bottom'
    />
  ))
  .add("Double Pagination", () => (
    <Table
      columns={[
        {name: "First Name", selector: 'firstName', class: 'width-50'},
        {name: "Last Name", selector: 'lastName'}
      ]}
      data={employee}
      paginationPosition= 'both'
    />
  ))
;
