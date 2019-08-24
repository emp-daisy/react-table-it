import React from 'react';
import Pagination from './pagination';

describe('Pagination Component', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Pagination />);
    expect(wrapper).toMatchSnapshot();
  });
});
