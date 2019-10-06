import React from 'react';
import Pagination from 'react-js-pagination';
import Table from './table';
import { TableFixtures, ColumnsFixtures } from '../../fixtures/data';

const fixtures = TableFixtures(20);
describe.only('Table Component', () => {
  it('should renders correctly', () => {
    const wrapper = shallow(<Table />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should renders empty row', () => {
    const wrapper = mount(<Table />);
    expect(wrapper.find('table td')).toHaveLength(1);
    expect(wrapper.find('table td').text()).toEqual('No data found');
    wrapper.setProps({ emptyPlaceholder: 'No product found!' });
    wrapper.update();
    expect(wrapper.find('table td').text()).toEqual('No product found!');
  });

  it('should get correct ficture size', () => {
    expect(TableFixtures(10).length).toEqual(10);
    expect(TableFixtures().length).toEqual(1);
  });

  it('renders data on table', () => {
    const wrapper = mount(<Table data={fixtures} columns={ColumnsFixtures} />);
    expect(wrapper.find('table thead th')).toHaveLength(2);
    expect(wrapper.find('table tbody tr')).toHaveLength(10);
  });

  it('renders pagination on top and bottom', () => {
    const wrapper = mount(
      <Table paginationPosition="both" data={fixtures} columns={ColumnsFixtures} />,
    );
    expect(wrapper.find('.pagination')).toHaveLength(2);
  });

  it('renders data on custom data column', () => {
    const wrapper = mount(
      <Table
        data={fixtures}
        columns={[
          ...ColumnsFixtures,
          { name: 'Fancy column', cell: <input className="product-checkbox" type="checkbox" /> },
        ]}
      />,
    );
    expect(wrapper.find('table thead th')).toHaveLength(3);
    expect(wrapper.find('table tbody tr .product-checkbox')).toHaveLength(10);
  });

  it('renders data on custom data column with function', () => {
    const wrapper = mount(
      <Table
        data={fixtures}
        columns={[
          ...ColumnsFixtures,
          {
            name: 'Fancy column',
            cell: () => <input className="product-checkbox" type="checkbox" />,
          },
        ]}
      />,
    );
    expect(wrapper.find('table thead th')).toHaveLength(3);
    expect(
      wrapper.containsMatchingElement(<input className="product-checkbox" type="checkbox" />),
    ).toBeTruthy();
    expect(wrapper.find('table tbody tr .product-checkbox')).toHaveLength(10);
  });

  it('watches for update on data', () => {
    const wrapper = mount(<Table data={fixtures} columns={ColumnsFixtures} />);
    wrapper.setProps({ data: fixtures.slice(0, 5) });
    wrapper.update();
    expect(wrapper.find('table thead th')).toHaveLength(2);
    expect(wrapper.find('table tbody tr')).toHaveLength(5);
  });

  it('sorts table should not crash on absent key', () => {
    const fixturesMod = fixtures.map(i => ({ name: i.name }));
    const columnMod = ColumnsFixtures.map(i => ({ ...i, sortable: true }));
    const wrapper = mount(<Table data={fixturesMod} columns={columnMod} />);
    const onSortSpy = jest.spyOn(wrapper.instance(), 'sortPage');
    // Ascending order
    wrapper
      .find('table thead th')
      .at(1)
      .simulate('click', { target: { name: 0 } });
    expect(onSortSpy).toHaveBeenCalled();
    wrapper.update();
    expect(wrapper.state('sortAscending')).toBeTruthy();
  });

  it('sorts table', () => {
    const names = fixtures.map(item => item.name).sort();
    const wrapper = mount(<Table data={fixtures} columns={ColumnsFixtures} />);
    const onSortSpy = jest.spyOn(wrapper.instance(), 'sortPage');
    // Ascending order
    wrapper
      .find('table thead th')
      .at(0)
      .simulate('click', { target: { name: 0 } });
    expect(onSortSpy).toHaveBeenCalled();
    wrapper.update();
    expect(wrapper.state('sortAscending')).toBeTruthy();
    expect(
      wrapper
        .find('table tbody tr')
        .first()
        .find('td')
        .first()
        .text(),
    ).toEqual(names[0]);
    expect(
      wrapper
        .find('table tbody tr')
        .last()
        .find('td')
        .first()
        .text(),
    ).toEqual(names[9]);
  });

  it('sorts tablein descending order', () => {
    const names = fixtures.map(item => item.name).sort();
    const wrapper = mount(<Table data={fixtures} columns={ColumnsFixtures} />);
    const onSortSpy = jest.spyOn(wrapper.instance(), 'sortPage');
    wrapper.setState({ sortAscending: true });
    wrapper.instance().forceUpdate();
    wrapper.update();
    wrapper
      .find('table thead th')
      .at(0)
      .simulate('click', { target: { name: 0 } });
    wrapper.update();
    expect(wrapper.state('sortAscending')).not.toBeTruthy();
    expect(onSortSpy).toHaveBeenCalled();
    expect(
      wrapper
        .find('table tbody tr')
        .first()
        .find('td')
        .first()
        .text(),
    ).toEqual(names[names.length - 1]);
    expect(
      wrapper
        .find('table tbody tr')
        .last()
        .find('td')
        .first()
        .text(),
    ).toEqual(names[names.length - 10]);
  });

  it('sorts table with custom function', () => {
    const wrapper = mount(<Table data={fixtures} columns={ColumnsFixtures} />);
    const onSort = jest.fn();
    wrapper.setProps({ onSort });
    wrapper.update();
    wrapper
      .find('table thead th')
      .at(0)
      .simulate('click', { target: { name: 0 } });
    expect(onSort).toHaveBeenCalled();
  });

  it('should not sorts table', () => {
    const wrapper = mount(<Table data={fixtures} columns={ColumnsFixtures} />);
    const onSortSpy = jest.spyOn(wrapper.instance(), 'sortPage');
    wrapper
      .find('table thead th')
      .at(1)
      .simulate('click', { target: { name: 0 } });
    expect(onSortSpy).not.toHaveBeenCalled();
  });

  it('should display search box', () => {
    const wrapper = mount(<Table data={fixtures} columns={ColumnsFixtures} search />);
    expect(wrapper.find('.input-group.search')).toHaveLength(1);
  });

  it('should not display search box', () => {
    const wrapper = mount(<Table data={fixtures} columns={ColumnsFixtures} search={false} />);
    expect(wrapper.find('.input-group.search')).toHaveLength(0);
  });

  it('should show search result', () => {
    const wrapper = mount(<Table data={fixtures} columns={ColumnsFixtures} search />);
    wrapper.find('.input-group.search input').simulate('change', {
      target: { value: fixtures[0].name },
    });
    wrapper.update();
    expect(wrapper.find('table tbody tr')).toHaveLength(1);
    // show all result on clear
    wrapper.find('.input-group.search input').simulate('change', { target: { value: '' } });
    wrapper.update();
    expect(wrapper.find('table tbody tr')).toHaveLength(10);
  });

  it('should not search column', () => {
    const fixturesMod = fixtures.map(i => ({ name: i.name, availablity: 'still-in-stock' }));
    const columnMod = [
      ...ColumnsFixtures,
      { name: 'Availablity', selector: 'availablity', unsearchable: true },
    ];
    const wrapper = mount(<Table data={fixturesMod} columns={columnMod} search />);
    wrapper.find('.input-group.search input').simulate('change', {
      target: { value: 'still-in-stock' },
    });
    expect(wrapper.find('table td').text()).toEqual('No data found');
  });

  it('should display/change correct page option', () => {
    const wrapper = mount(
      <Table data={fixtures} columns={ColumnsFixtures} pageOptions={[25, 40, 50]} />,
    );
    expect(wrapper.find('.pagination .page-option').props().value).toEqual(25);
    wrapper
      .find('.pagination .page-option')
      .find('option')
      .at(1)
      .simulate('change', 1);
    expect(wrapper.find('.pagination .page-option').props().value).toEqual('40');
    wrapper
      .find('.pagination .page-option')
      .find('option')
      .at(2)
      .simulate('change', 1);
    expect(wrapper.find('.pagination .page-option').props().value).toEqual('50');
  });

  it('should change the table limit', () => {
    const wrapper = mount(
      <Table data={fixtures} columns={ColumnsFixtures} pageOptions={[5, 10, 20]} />,
    );
    expect(wrapper.find('table tbody tr')).toHaveLength(5);
    wrapper
      .find('.pagination .page-option')
      .find('option')
      .at(1)
      .simulate('change', 1);

    expect(wrapper.find('table tbody tr')).toHaveLength(10);
    wrapper
      .find('.pagination .page-option')
      .find('option')
      .at(2)
      .simulate('change', 1);

    expect(wrapper.find('table tbody tr')).toHaveLength(20);
  });

  it('should display/change correct page option', () => {
    const wrapper = mount(
      <Table data={fixtures} columns={ColumnsFixtures} pageOptions={[25, 40, 50]} />,
    );
    expect(wrapper.find('.pagination .page-option').props().value).toEqual(25);
    wrapper
      .find('.pagination .page-option')
      .find('option')
      .at(1)
      .simulate('change', 1);
    expect(wrapper.find('.pagination .page-option').props().value).toEqual('40');
    wrapper
      .find('.pagination .page-option')
      .find('option')
      .at(2)
      .simulate('change', 1);
    expect(wrapper.find('.pagination .page-option').props().value).toEqual('50');
  });

  it('should change the table items on prev click', () => {
    const wrapper = mount(
      <Table data={fixtures} columns={ColumnsFixtures} pageOptions={[15, 20]} />,
    );

    wrapper.find('.pagination .next span').simulate('click');
    expect(wrapper.find('table tbody tr')).toHaveLength(5);

    wrapper.find('.pagination .prev span').simulate('click');
    expect(wrapper.find('table tbody tr')).toHaveLength(15);
  });

  it('should change the table items on next click', () => {
    const wrapper = mount(
      <Table data={fixtures} columns={ColumnsFixtures} pageOptions={[15, 20]} />,
    );

    expect(wrapper.find('table tbody tr')).toHaveLength(15);

    wrapper.find('.pagination .next span').simulate('click');
    expect(wrapper.find('table tbody tr')).toHaveLength(5);
  });

  it('should change page by input field', () => {
    const wrapper = mount(
      <Table data={fixtures} columns={ColumnsFixtures} pageOptions={[15, 20]} />,
    );
    expect(wrapper.find('table tbody tr')).toHaveLength(15);

    wrapper.find('.pagination input.current-page').simulate('change', { target: { value: 2 } });
    wrapper.update();
    expect(wrapper.find('table tbody tr')).toHaveLength(5);
  });

  it('should render custom pagination', () => {
    const wrapper = mount(
      <Table
        data={fixtures}
        columns={ColumnsFixtures}
        pageOptions={[15, 20]}
        customPagination
        paginationComponent={({ itemsLength, currentPage, perPage, pageChange }) => (
          <Pagination
            itemClass="page-item"
            linkClass="page-link"
            innerClass="pagination custom-paging justify-content-end"
            activePage={currentPage}
            itemsCountPerPage={perPage}
            totalItemsCount={itemsLength}
            pageRangeDisplayed={5}
            onChange={page => pageChange(page, perPage)}
          />
        )}
      />,
    );
    expect(wrapper.find('table tbody tr')).toHaveLength(15);

    expect(wrapper.find('.pagination.custom-paging')).toHaveLength(1);
  });

  it('load from server', () => {
    const fixturess = TableFixtures(35);
    const wrapper = mount(
      <Table server dataLength={35} data={fixturess.slice(0, 35)} columns={ColumnsFixtures} />,
    );
    wrapper.update();
    expect(wrapper.state('itemsLength')).toEqual(35);
    expect(wrapper.find('table tbody tr')).toHaveLength(10);
  });
});
