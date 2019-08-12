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
      itemsLength: props.serverPagination ? props.dataLength : props.data.length,
      sortKey: undefined,
    };
  }

  componentDidUpdate = prevProps => {
    if (prevProps.data !== this.props.data) {
      this.setState({
        itemsLength: this.props.serverPagination ? this.props.dataLength : this.props.data.length,
      });
    }
  };

  onPageChange = (offset, limit, search) => {
    let filteredData;
    if (this.props.serverPagination) {
      this.props.onPageChange(offset, limit, (search = ''));
      filteredData = this.props.data;
    } else {
      const data = [...this.props.data].filter(item =>
        Object.values(item)
          .join()
          .toLowerCase()
          .includes(search),
      );
      filteredData = data.slice(offset).slice(0, limit);
    }
    this.setState({ filteredData });
  };

  sortPage = key => {
    let filteredData = this.props.data;
    const sortAscending = !this.state.sortAscending;
    if (this.props.sortBy) {
      this.props.onSort(key, sortAscending);
    } else {
      filteredData = this.state.filteredData.sort((a, b) => {
        if (sortAscending) {
          return a[key].toString().localeCompare(b[key].toString());
        }
        return b[key].toString().localeCompare(a[key].toString());
      });
    }
    this.setState({ filteredData, sortKey: key, sortAscending });
  };

  pagination = () => {
    const {
      data,
      searchPlaceholder,
      search,
      pageOptions,
      onSearch,
      serverPagination,
      dataLength,
    } = this.props;
    const itemsLength = serverPagination ? dataLength : data.length;
    return (
      <PaginationBar
        onPageChange={this.onPageChange}
        itemsLength={itemsLength}
        searchPlaceholder={searchPlaceholder}
        showSearch={!search}
        onSearch={onSearch}
        data={data}
        pageOptions={pageOptions}
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
    const { filteredData, sortKey, sortAscending } = this.state;
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
                      key={index}
                      className={item.class}
                      onClick={
                        item.sortable
                          ? () => {
                              this.sortPage(item.selector);
                            }
                          : undefined
                      }
                    >
                      {item.name}
                      {item.sortable && (
                        <FontAwesomeIcon
                          className="mx-1 align-middle float-right"
                          icon={
                            !sortKey || sortKey !== item.selector
                              ? faSort
                              : sortAscending
                              ? faSortUp
                              : faSortDown
                          }
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
                  <tr key={index} className={rowClass}>
                    {columns &&
                      columns.map((item, tdIndex) =>
                        item.cell ? (
                          <td key={tdIndex} className={item.class}>
                            {typeof item.cell === 'function' ? item.cell(data) : item.cell}
                          </td>
                        ) : (
                          <td key={tdIndex} className={item.class}>
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
  // TABLE
  emptyPlaceholder: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  data: PropTypes.arrayOf(PropTypes.any),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
      class: PropTypes.string,
      selector: PropTypes.string,
      sortable: PropTypes.bool,
      cell: PropTypes.func,
    }),
  ),
  dataLength: PropTypes.number,
  // PAGINATION
  paginationPosition: PropTypes.oneOf(['top', 'bottom', 'both', 'none']),
  pageOptions: PropTypes.arrayOf(PropTypes.number),
  onServer: PropTypes.bool,
  paginationComponent: PropTypes.element,
  onPageChange: PropTypes.func,
  // SORTING
  onSort: PropTypes.func,
  // SEARCH
  searchPlaceholder: PropTypes.string,
  search: PropTypes.bool,
  // STYLING
  containerClass: PropTypes.string,
  tableClass: PropTypes.string,
  rowClass: PropTypes.string,
  // MISC
  header: PropTypes.element,
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
  serverPagination: false,
  paginationPosition: 'top',
  onPageChange: () => {
    /** PARAMS: offset, limit, search  */
  },
  // SORTING
  onSort: () => {
    /** PARAMS: key, ascending  */
  },
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
