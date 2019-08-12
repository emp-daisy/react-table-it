import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from '../src'
import employee from '../fixtures/employee';

storiesOf("Table", module)
  .add("Basic", () => (
    <Table
      columns={[
        {name: "First Name", selector: 'firstName', class: 'width-50'},
        {name: "Last Name", selector: 'lastName'}
      ]}
      data={employee}
    />
  ))
  .add("Custom", () => (
    <Table
      columns={[
        {name: "First Name", selector: 'firstName', class: 'width-50'},
        {name: "Last Name", selector: 'lastName'}
      ]}
      data={employee}
      containerClass="mt-4"
      tableClass="table table-dark table-bordered table-hover table-sm"
    />
  ))
  .add("Custom header and footer", () => (
    <Table
      columns={[
        {name: "First Name", selector: 'firstName', class: 'width-50', sortable: true},
        {name: "Last Name", selector: 'lastName', sortable: true}
      ]}
      data={employee}
      header={<div><h4 className=" my-2 text-underline"><u>List of employees</u></h4></div>}
      footer={(
        <div className="text-center text-muted">
          <hr />
©
          {' '}
          <a className="text-reset" href="https://emp-daisy.github.io/">My custom footer</a>
        </div>
)}
    />
  ))
  .add("With no data", () => (
    <Table
      columns={[
        {name: "First Name", selector: 'firstName', class: 'width-50'},
        {name: "Last Name", selector: 'lastName'}
      ]}
      data={[]}
      emptyPlaceholder="No user found!!!"
    />
  ))
;
