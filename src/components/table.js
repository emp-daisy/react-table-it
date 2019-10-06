/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import PaginationBar from './pagination';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sortAscending: false,
      stateData: [],
      filteredData: [],
      itemsLength: 0,
      sortKey: undefined,
    };
  }

  componentDidMount = () => {
    this.setItemLength();
  };

  componentDidUpdate = prevProps => {
    const { data } = this.props;
    const { data: prevData } = prevProps;
    if (prevData !== data) {
      this.setItemLength();
    }
  };

  setItemLength = () => {
    const { server, dataLength, data } = this.props;
    this.setState({
      itemsLength: server ? dataLength : data.length,
      stateData: data,
    });
  };

  onPageChange = (offset, limit, search) => {
    const { server, onPageChange, columns } = this.props;
    const { stateData: data } = this.state;
    let filteredData;
    let searchData;
    if (server) {
      onPageChange(offset, limit, search);
      searchData = data;
      filteredData = data.slice(0, limit);
    } else {
      const searchable = columns.reduce(
        (result, item) => [...result, ...(!item.unsearchable ? [item.selector] : [])],
        [],
      );
      searchData =
        search.trim().length === 0
          ? data
          : [...data].filter(
              item =>
                searchable
                  .reduce((result, key) => [...result, item[key]], [])
                  .map(mitem => {
                    let itemValue = mitem;
                    if (typeof mitem === 'object') {
                      itemValue = Object.values(mitem);
                    }
                    return [itemValue || ''].toString().toLowerCase();
                  })
                  .filter(fitem => fitem.includes(search)).length,
            );
      filteredData = searchData.slice(offset).slice(0, limit);
    }
    this.setState({ filteredData, itemsLength: searchData.length });
  };

  sortPage = key => {
    const { sortAscending: sortOption } = this.state;
    const { onSort, data } = this.props;
    const sortAscending = !sortOption;
    let stateData = data;
    if (onSort) {
      onSort(key, sortAscending);
    } else {
      stateData = [...data].sort((a, b) => {
        const first = a[key] || '';
        const second = b[key] || '';
        return sortAscending
          ? first.toString().localeCompare(second.toString())
          : second.toString().localeCompare(first.toString());
      });
    }
    this.setState({ stateData, sortKey: key, sortAscending });
  };

  sortIcon = selector => {
    const { sortKey, sortAscending } = this.state;
    if (!sortKey || sortKey !== selector) {
      return faSort;
    }
    if (sortAscending) {
      return faSortUp;
    }
    return faSortDown;
  };

  pagination = () => {
    const {
      searchPlaceholder,
      search,
      pageOptions,
      paginationComponent,
      customPagination,
    } = this.props;
    const { itemsLength, stateData } = this.state;
    return (
      <PaginationBar
        onPageChange={this.onPageChange}
        itemsLength={itemsLength}
        searchPlaceholder={searchPlaceholder}
        showSearch={search}
        data={stateData}
        pageOptions={pageOptions}
        paginationComponent={paginationComponent}
        customPagination={customPagination}
      />
    );
  };

  tableCell = (item, data) => (typeof item.cell === 'function' ? item.cell(data) : item.cell);

  render() {
    const {
      columns,
      emptyPlaceholder,
      paginationPosition,
      header,
      footer,
      containerClass,
      tableClass,
      rowClass,
    } = this.props;
    const { filteredData } = this.state;
    return (
      <div className={`mx-3 table-wrapper ${containerClass}`}>
        {header}
        {(paginationPosition === 'top' || paginationPosition === 'both') && this.pagination()}
        <table className={`table ${tableClass}`}>
          <thead>
            <tr>
              {columns &&
                columns.map((item, index) => (
                  <th
                    key={`header-${index}`}
                    className={item.headerClass || item.className}
                    {...(item.sortable && { onClick: () => this.sortPage(item.selector) })}
                  >
                    {item.name}
                    {item.sortable && (
                      <FontAwesomeIcon
                        className="mx-1 align-middle float-right"
                        icon={this.sortIcon(item.selector)}
                        size="1x"
                      />
                    )}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {filteredData &&
              filteredData.map((data, index) => (
                <tr key={`data-${index}`} className={rowClass}>
                  {columns &&
                    columns.map((item, tdIndex) => (
                      <td key={tdIndex} className={item.className} {...item.attributes}>
                        {item.cell ? this.tableCell(item, data) : data[item.selector]}
                      </td>
                    ))}
                </tr>
              ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  {emptyPlaceholder}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {(paginationPosition === 'bottom' || paginationPosition === 'both') && this.pagination()}
        {footer}
      </div>
    );
  }
}

Table.propTypes = {
  /** Placeholder when table is empty. */
  emptyPlaceholder: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  /** Data to load on table */
  data: PropTypes.arrayOf(PropTypes.any),
  /** Table column settings. */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
      className: PropTypes.string,
      attributes: PropTypes.objectOf(PropTypes.any),
      selector: PropTypes.string,
      sortable: PropTypes.bool,
      unsearchable: PropTypes.bool,
      cell: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    }),
  ),
  /** Specify length of all data when loading from server.
   * Note: server props must true
   */
  dataLength: PropTypes.number,
  /** Position of pagination component. */
  paginationPosition: PropTypes.oneOf(['top', 'bottom', 'both', 'none']),
  /** Page limit options. */
  pageOptions: PropTypes.arrayOf(PropTypes.number),
  /** Custom pagination component.
   * paginationComponent must be set
   * PROPS: ***    itemsLength => size of data
   *        ***    currentPage => current page
   *        ***    perPage => page limit
   *        ***    next => next page function
   *        ***    previous => previous page function
   *        ***    pageChange => change page function
   *        ***    limitChange => change page limit function
   *        ***    searchPage => search page
   */
  paginationComponent: PropTypes.func,
  /**
   * Render custom pagination
   */
  customPagination: PropTypes.bool,
  /** Set if pagination is handled by asynchronously */
  server: PropTypes.bool,
  /** Custom page change function.
   * Note: server props must true
   * params => (offset, limit, search)
   *       ***    offset => offset for new page
   *       ***    limit => current limit of table
   *       ***    search => optional search term
   */
  onPageChange: PropTypes.func,
  // SORTING
  /** Custom sort function.
   * params => (selector, direction)
   *       ***    selector => the column selector specified
   *       ***    direction => ascendingOrder === true
   */
  onSort: PropTypes.func,
  /** Search box placehiolder */
  searchPlaceholder: PropTypes.string,
  /** Set visibility of search box */
  search: PropTypes.bool,
  /** CSS class for package component. */
  containerClass: PropTypes.string,
  /** CSS class for table. */
  tableClass: PropTypes.string,
  /** CSS class for table header. */
  headerClass: PropTypes.string,
  /** CSS class for table row. */
  rowClass: PropTypes.string,
  /** Custom header component. */
  header: PropTypes.element,
  /** Custom footer component. */
  footer: PropTypes.element,
};

Table.defaultProps = {
  // TABLE
  emptyPlaceholder: 'No data found',
  dataLength: 0,
  columns: [],
  data: [],
  // PAGINATION
  pageOptions: [10, 30, 50],
  server: false,
  customPagination: false,
  paginationComponent: undefined,
  paginationPosition: 'top',
  onPageChange: () => {},
  // SORTING
  onSort: undefined,
  // SEARCH
  searchPlaceholder: 'Search',
  search: true,
  // STYLING
  containerClass: '',
  tableClass: '',
  headerClass: '',
  rowClass: '',
  // MISC
  header: null,
  footer: null,
};

export default Table;
