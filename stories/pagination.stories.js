import React from 'react';
import { storiesOf } from '@storybook/react';
import Pagination from 'react-js-pagination';
import Table from '../src';
import { ColumnsFixtures, TableFixtures } from '../fixtures/data';

storiesOf('Pagination', module)
  .add('Bottom Pagination', () => (
    <Table columns={ColumnsFixtures} data={TableFixtures(20)} paginationPosition="bottom" />
  ))
  .add('Double Pagination', () => (
    <Table columns={ColumnsFixtures} data={TableFixtures(20)} paginationPosition="both" />
  ))
  .add('Custom Pagination', () => (
    <Table
      columns={ColumnsFixtures}
      data={TableFixtures(35)}
      paginationComponent={({ itemsLength, currentPage, perPage, pageChange }) => (
        <Pagination
          itemClass="page-item"
          linkClass="page-link"
          innerClass="pagination justify-content-end"
          activePage={currentPage}
          itemsCountPerPage={perPage}
          totalItemsCount={itemsLength}
          pageRangeDisplayed={5}
          onChange={page => pageChange(page, perPage)}
        />
      )}
    />
  ));
