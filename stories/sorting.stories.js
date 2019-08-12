import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from '../src'
import employee from '../fixtures/employee';

storiesOf("Sorting", module)
  .add("Sort column", () => (
    <Table
      columns={[
        {name: "First Name", selector: 'firstName', class: 'width-50', sortable: true},
        {name: "Last Name", selector: 'lastName', sortable: true}
      ]}
      data={employee}
    />
  ))
;
