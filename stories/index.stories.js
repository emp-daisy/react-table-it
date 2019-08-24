import React from 'react';
import { storiesOf } from '@storybook/react';
import Table from '../src';
import { ColumnsFixtures, TableFixtures } from '../fixtures/data';

storiesOf('Table', module)
  .add('Basic', () => <Table columns={ColumnsFixtures} data={TableFixtures} />)
  .add('Custom', () => (
    <Table
      columns={ColumnsFixtures}
      data={TableFixtures}
      containerClass="mt-4"
      tableClass="table table-dark table-bordered table-hover table-sm"
    />
  ))
  .add('Custom header and footer', () => (
    <Table
      columns={ColumnsFixtures}
      data={TableFixtures}
      header={(
        <div>
          <h4 className=" m-3 text-underline">
            <u>Product List</u>
          </h4>
        </div>
      )}
      footer={(
        <div className="text-center text-muted">
          <hr />
          {`© `}
          <a className="text-reset" href="https://emp-daisy.github.io/">
            My custom footer
          </a>
        </div>
      )}
    />
  ))
  .add('With no data', () => (
    <Table columns={ColumnsFixtures} data={[]} emptyPlaceholder="No data found!!!" />
  ));
