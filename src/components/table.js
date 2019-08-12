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
      filteredData: [],
      itemsLength: 0,
      sortKey: undefined,
    };
  }

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
    });
  };

  onPageChange = (offset, limit, search = '') => {
    const { data, server, onPageChange } = this.props;
    let filteredData;
    if (server) {
      onPageChange(offset, limit, search);
      filteredData = data;
    } else {
      filteredData = [...data]
        .filter(item =>
          Object.values(item)
            .join()
            .toLowerCase()
            .includes(search),
        )
        .slice(offset)
        .slice(0, limit);
    }
    this.setState({ filteredData });
  };

  sortPage = key => {
    const { sortAscending: sortOption, filteredData: filtered } = this.state;
    const { onSort, data } = this.props;
    const sortAscending = !sortOption;
    let filteredData = data;
    if (onSort) {
      onSort(key, sortAscending);
    } else {
      filteredData = filtered.sort((a, b) =>
        sortAscending
          ? a[key].toString().localeCompare(b[key].toString())
          : b[key].toString().localeCompare(a[key].toString()),
      );
    }
    this.setState({ filteredData, sortKey: key, sortAscending });
  };

  sortIcon=  (selector)=>{
    const {sortKey, sortAscending } = this.state;
    if (!sortKey || sortKey !== selector) {
      return faSort;
    } if (sortAscending) {
      return faSortUp;
    }
      return faSortDown;
  }

  pagination = () => {
    const {
      data,
      searchPlaceholder,
      search,
      pageOptions,
      paginationComponent,
    } = this.props;
    const { itemsLength } = this.state;
    return (
      <PaginationBar
        onPageChange={this.onPageChange}
        itemsLength={itemsLength}
        searchPlaceholder={searchPlaceholder}
        showSearch={!search}
        data={data}
        pageOptions={pageOptions}
        paginationComponent={paginationComponent}
      />
    );
  };

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
      <div className={`table-wrapper ${containerClass}`}>
        {header}
        {(paginationPosition === 'top' || paginationPosition === 'both') && this.pagination()}
        <div className="mx-3">
          <table className={`table ${tableClass}`}>
            <thead>
              <tr>
                {columns &&
                  columns.map((item, index) => (
                    <th
                      key={`header-${index}`}
                      className={item.class}
                      onClick={item.sortable ? () => this.sortPage(item.selector) : undefined}
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
                      columns.map((item, tdIndex) =>
                        item.cell ? (
                          <td key={`cell-data-${tdIndex}`} className={item.class}>
                            {typeof item.cell === 'function' ? item.cell(data) : item.cell}
                          </td>
                        ) : (
                          <td key={`cell-data-${tdIndex}`} className={item.class}>
                            {data[item.selector]}
                          </td>
                        ),
                      )}
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
        </div>
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
      class: PropTypes.string,
      selector: PropTypes.string,
      sortable: PropTypes.bool,
      cell: PropTypes.func,
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
  /** Set if pagination is handled by asynchronously */
  server: PropTypes.bool,
  paginationComponent: PropTypes.element,
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
  /** CSS class for table row. */
  rowClass: PropTypes.string,
  /** Custom header component. */
  header: PropTypes.element,
  /** Custom footer component. */
  footer: PropTypes.element,
};

Table.defaultProps = {
  // TABLE
  emptyPlaceholder: 'No Data found',
  dataLength: 0,
  columns: [],
  data: [],
  // PAGINATION
  pageOptions: [10, 30, 50],
  server: false,
  paginationComponent: null,
  paginationPosition: 'top',
  onPageChange: undefined,
  // SORTING
  onSort: undefined,
  // SEARCH
  searchPlaceholder: 'Search',
  search: false,
  // STYLING
  containerClass: '',
  tableClass: '',
  rowClass: '',
  // MISC
  header: null,
  footer: null,
};

export default Table;
