import React from 'react';
import Table from './table';
import fixtures, { ColumnsFixtures } from '../../fixtures/data';

fdescribe('Table Component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Table />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders empty row', () => {
    const wrapper = mount(<Table />);
    expect(wrapper.find('table td')).toHaveLength(1);
    expect(wrapper.find('table td').text()).toEqual('No data found');
    wrapper.setProps({ emptyPlaceholder: 'No product found!' });
    wrapper.update();
    expect(wrapper.find('table td').text()).toEqual('No product found!');
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

  it('load from server', () => {
    const wrapper = mount(
      <Table server dataLength={50} data={fixtures.slice(0, 12)} columns={ColumnsFixtures} />,
    );
    wrapper.update();
    expect(wrapper.state('itemsLength')).toEqual(50);
    expect(wrapper.find('table tbody tr')).toHaveLength(10);
  });
});
