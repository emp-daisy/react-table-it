import React from 'react';
import Pagination from './pagination';

describe('Pagination Component', () => {
  it('should renders correctly', () => {
    const wrapper = shallow(<Pagination />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should switch to previous page', () => {
    const wrapper = shallow(<Pagination itemsLength={20} />);
    const switchPageSpy = jest.spyOn(wrapper.instance(), 'switchPage');
    wrapper.setState({ currentPage: 2 });
    wrapper.instance().previous();
    expect(switchPageSpy).toHaveBeenCalled();
  });

  it('should not switch to previos page', () => {
    const wrapper = shallow(<Pagination itemsLength={20} />);
    const switchPageSpy = jest.spyOn(wrapper.instance(), 'switchPage');
    wrapper.setState({ currentPage: 1 });
    wrapper.instance().previous();
    expect(switchPageSpy).not.toHaveBeenCalled();
  });

  it('should switch to next page', () => {
    const wrapper = shallow(<Pagination itemsLength={20} />);
    const switchPageSpy = jest.spyOn(wrapper.instance(), 'switchPage');
    wrapper.setState({ currentPage: 1 });
    wrapper.instance().next();
    expect(switchPageSpy).toHaveBeenCalled();
  });

  it('should not switch to next page', () => {
    const wrapper = shallow(<Pagination itemsLength={20} />);
    const switchPageSpy = jest.spyOn(wrapper.instance(), 'switchPage');
    wrapper.setState({ currentPage: 2 });
    wrapper.instance().next();
    expect(switchPageSpy).not.toHaveBeenCalled();
  });

  it('should switch to selected page', () => {
    const wrapper = shallow(<Pagination itemsLength={20} />);
    const switchPageSpy = jest.spyOn(wrapper.instance(), 'switchPage');
    wrapper.instance().onPageChange(2);
    expect(switchPageSpy).toHaveBeenCalled();
  });

  it('should not switch to selected page', () => {
    const wrapper = shallow(<Pagination itemsLength={20} />);
    const switchPageSpy = jest.spyOn(wrapper.instance(), 'switchPage');
    wrapper.instance().onPageChange(3);
    expect(switchPageSpy).not.toHaveBeenCalled();
  });

  it('should switch to change page', () => {
    const wrapper = shallow(<Pagination itemsLength={20} />);
    const switchPageSpy = jest.spyOn(wrapper.instance(), 'switchPage');
    wrapper.instance().onPageChange(2);
    expect(switchPageSpy).toHaveBeenCalled();
  });

  it('should not switch to change page', () => {
    const wrapper = shallow(<Pagination itemsLength={20} />);
    const switchPageSpy = jest.spyOn(wrapper.instance(), 'switchPage');
    wrapper.instance().onPageChange(3);
    expect(switchPageSpy).not.toHaveBeenCalled();
  });
});
