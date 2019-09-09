/* eslint-disable react/no-array-index-key */
import React from 'react';
import PropTypes from 'prop-types';
import { faSearch, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Pagination extends React.Component {
  constructor(props) {
    super(props);
    const perPage = props.pageOptions[0];
    const totalPages = Math.ceil(props.itemsLength / perPage);
    this.state = {
      perPage,
      currentPage: 1,
      totalPages,
      searchText: '',
    };
  }

  componentDidMount = () => {
    const { currentPage } = this.state;
    this.switchPage(currentPage);
  };

  componentDidUpdate = props => {
    const { currentPage } = this.state;
    const { itemsLength, data } = this.props;
    const { itemsLength: prevItemsLength, data: prevData } = props;
    if (prevItemsLength !== itemsLength) {
      this.setTotalPages();
    }
    if (prevData !== data) {
      this.switchPage(currentPage);
    }
  };

  setTotalPages = () => {
    const { perPage } = this.state;
    const { itemsLength } = this.props;
    this.setState({ totalPages: Math.ceil(itemsLength / perPage) });
  };

  switchPage = page => {
    const { perPage, searchText } = this.state;
    const { onPageChange } = this.props;
    this.setState({ currentPage: page });
    onPageChange(perPage * (page - 1), perPage, searchText);
  };

  previous = () => {
    const { currentPage } = this.state;
    if (currentPage !== 1) {
      this.switchPage(currentPage - 1);
    }
  };

  next = () => {
    const { currentPage, totalPages } = this.state;
    if (currentPage < totalPages) {
      this.switchPage(currentPage + 1);
    }
  };

  changeLimit = num => {
    const { searchText } = this.state;
    const { onPageChange, itemsLength } = this.props;
    this.setState({
      perPage: num,
      totalPages: Math.ceil(itemsLength / num),
      currentPage: 1,
    });
    onPageChange(0, num, searchText);
  };

  onPageChange = value => {
    const { totalPages } = this.state;
    if (Number.isNaN(value) || value > totalPages || value < 1) {
      return;
    }
    this.switchPage(value);
  };

  handleSearch = ev => {
    const { onPageChange } = this.props;
    const { perPage } = this.state;
    const text = ev.target.value.trim().toLowerCase();
    this.setState({ searchText: text, currentPage: 1 });
    onPageChange(0, perPage, text);
  };

  render() {
    const {
      showSearch,
      pageOptions,
      searchPlaceholder,
      data,
      paginationComponent,
      customPagination,
      itemsLength,
    } = this.props;
    const { totalPages, currentPage, perPage } = this.state;
    return (
      <React.Fragment>
        {!customPagination ? (
          <div className="pagination row m-0 mb-2">
            <div className="col-5">
              {showSearch && (
                <div className="input-group search">
                  <input
                    onChange={this.handleSearch}
                    type="text"
                    autoComplete="off"
                    className="form-control"
                    placeholder={searchPlaceholder}
                    disabled={!data || data.length === 0}
                    required
                    aria-label="search box"
                  />
                  <div className="input-group-append">
                    <button
                      className="btn btn-outline-secondary"
                      aria-label="search button"
                      disabled
                      type="button"
                    >
                      <FontAwesomeIcon icon={faSearch} size="1x" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {totalPages > 0 && (
              <div className="col-7 d-flex justify-content-end">
                <select
                  className="custom-select mr-sm-2 page-option"
                  aria-label="select options"
                  labelledby="select options"
                  value={perPage}
                  // role="listbox"
                  aria-expanded="true"
                  onChange={e => this.changeLimit(e.target.value)}
                >
                  {pageOptions.map((option, index) => (
                    <option
                      key={index}
                      // role="option"
                      value={option}
                    >
                      {`${option}`}
                    </option>
                  ))}
                </select>
                <div className="navigation d-flex justify-content-around align-items-center">
                  <div className={`control prev${currentPage === 1 ? ' disabled' : ''}`}>
                    <span onClick={this.previous} role="presentation">
                      <FontAwesomeIcon className="mx-1" icon={faChevronLeft} size="1x" />
                      Prev
                    </span>
                  </div>
                  <div className="pages">
                    <div className="form-inline">
                      <label htmlFor="currentPage" className="mx-2">
                        <input
                          onChange={e => this.onPageChange(e.target.value)}
                          type="number"
                          autoComplete="off"
                          className="form-control current-page mr-2"
                          value={currentPage}
                          required
                          aria-label="current page"
                          role="spinbutton"
                          min={1}
                          max={totalPages}
                          id="currentPage"
                        />
                        {`of ${totalPages}`}
                      </label>
                    </div>
                  </div>
                  <div className={`control next${currentPage >= totalPages ? ' disabled' : ''}`}>
                    <span role="presentation" onClick={this.next}>
                      Next
                      <FontAwesomeIcon className="mx-1" icon={faChevronRight} size="1x" />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <React.Fragment>
            {paginationComponent({
              itemsLength,
              currentPage,
              perPage,
              next: this.next,
              previous: this.previous,
              pageChange: this.onPageChange,
              limitChange: this.changeLimit,
              searchPage: this.handleSearch,
            })}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

Pagination.propTypes = {
  /** Length of the data in the view. */
  itemsLength: PropTypes.number,
  /** View data. */
  data: PropTypes.arrayOf(PropTypes.any),
  /** Page change function.
   * params => (offset, limit, search)
   *       ***    offset => offset for new page
   *       ***    limit => current limit of table
   *       ***    search => optional search term
   */
  onPageChange: PropTypes.func,
  /** Page limit options. */
  pageOptions: PropTypes.arrayOf(PropTypes.any),
  /** Placeholder for search box. */
  searchPlaceholder: PropTypes.string,
  /** Set visibility of search box  */
  showSearch: PropTypes.bool,
  /** Render custom pagination  */
  customPagination: PropTypes.bool,
  /** Custom pagination component. */
  paginationComponent: PropTypes.func,
};

Pagination.defaultProps = {
  itemsLength: 0,
  data: [],
  onPageChange: () => {},
  pageOptions: [10, 25, 50],
  searchPlaceholder: 'Search...',
  showSearch: true,
  customPagination: false,
  paginationComponent: null,
};

export default Pagination;
