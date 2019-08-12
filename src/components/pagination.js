import React from 'react';
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
    this.switchPage(this.state.currentPage);
  };

  componentDidUpdate = props => {
    if (props.itemsLength !== this.props.itemsLength) {
      this.setState({ totalPages: Math.ceil(this.props.itemsLength / this.state.perPage) });
    }
    if (props.data !== this.props.data) {
      this.switchPage(this.state.currentPage);
    }
  };

  switchPage = page => {
    this.setState({ currentPage: page });
    this.props.onPageChange(
      this.state.perPage * (page - 1),
      this.state.perPage,
      this.state.searchText,
    );
  };

  previous = () => {
    if (this.state.currentPage === 1) {
      return;
    }
    this.switchPage(this.state.currentPage - 1);
  };

  next = () => {
    if (this.state.currentPage >= this.state.totalPages) {
      return;
    }
    this.switchPage(this.state.currentPage + 1);
  };

  changeLimit = num => {
    this.setState({
      perPage: num,
      totalPages: Math.ceil(this.props.itemsLength / num),
      currentPage: 1,
    });
    this.props.onPageChange(0, num, this.state.searchText);
  };

  onPageChange = e => {
    const value = e.target.value;
    console.log(value);
    if (isNaN(value) || value > this.state.totalPages || value < 1) {
      return;
    }
    this.switchPage(value);
  };

  handleSearch = ev => {
    const text = ev.target.value.trim().toLowerCase();
    this.setState({ searchText: text, currentPage: 1 });
    this.props.onPageChange(0, this.state.perPage, text);
  };

  render() {
    const { showSearch, pageOptions, searchPlaceholder, data } = this.props;
    const { totalPages, currentPage, perPage } = this.state;
    return (
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
                aria-label={'search box'}
                role={'textbox'}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  aria-label={'search button'}
                  disabled
                  role={'button'}
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
              class="custom-select mr-sm-2 page-option"
              aria-label={'select options'}
              labelledby={'select options'}
              role={'listbox'}
              aria-expanded={'true'}
              onChange={e => this.changeLimit(e.target.value)}
            >
              {pageOptions.map((option, index) => (
                <option
                  key={index}
                  role={'option'}
                  selected={option === perPage}
                  value={option}
                >{`${option}`}</option>
              ))}
            </select>
            <div className="navigation d-flex justify-content-around align-items-center">
              <div className={`control prev${currentPage === 1 ? ' disabled' : ''}`}>
                <span onClick={this.previous}>
                  <FontAwesomeIcon className="mx-1" icon={faChevronLeft} size="1x" />
                  Prev
                </span>
              </div>
              <div className="pages">
                <div class="form-inline">
                  <input
                    onChange={this.onPageChange}
                    type="number"
                    autoComplete="off"
                    className="form-control"
                    value={currentPage}
                    required
                    aria-label={'current page'}
                    role={'spinbutton'}
                    min={1}
                    max={totalPages}
                    id="currentPage"
                  />
                  <label for="currentPage" className="mx-2">{`of ${totalPages}`}</label>
                </div>
              </div>
              <div className={`control next${currentPage >= totalPages ? ' disabled' : ''}`}>
                <span onClick={this.next}>
                  Next
                  <FontAwesomeIcon className="mx-1" icon={faChevronRight} size="1x" />
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Pagination;
