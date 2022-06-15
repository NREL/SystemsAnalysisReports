import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import FormControl from 'react-bootstrap/FormControl';
import { Translation } from 'react-i18next';
import en_US from '../constants/paginationLocale';
import { OBJECT_SELECTION_PAGINATION_ITEMS } from '../constants/settings';
import { isNumeric } from '../functions/numericFunctions';
import './ObjectSelectionDropdown.css';

export class ObjectSelectionDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: '',
      currentPage: 1
    };
  }

  getObjectName(objectList, id) {
    // Get the string name of the object given an id
    if (isNumeric(id) && objectList && objectList.length > 0) {
      for (var i = 0; i < objectList.length; i++) {
        if (
          Object.keys(objectList[i]).includes('id') &&
          objectList[i].id.toString() === id.toString()
        ) {
          return objectList[i].name;
        }
      }
    } else return null;
  }

  handlePaginationClick(event) {
    const selected = event;

    this.setState({
      currentPage: selected
    });
  }

  render() {
    // Creates a custom menu for the dropdown that provides pagination and filtering
    const CustomMenu = React.forwardRef(
      ({children, style, className, 'aria-labelledby': labeledBy}, ref) => {

        const selected = this.state.currentPage;

        // Get the start/stop indices for the pagination
        // Initialize to full array
        var startIndex = 0;
        var endIndex = React.Children.toArray(children).length;

        // Only apply pagination if no filter exists.  Otherwise filtered results may not show.
        if (!this.state.filter) {
          startIndex = (selected - 1) * OBJECT_SELECTION_PAGINATION_ITEMS;
          endIndex = startIndex + OBJECT_SELECTION_PAGINATION_ITEMS;
        }

        return (
          <div
            ref={ref}
            style={style}
            className={className}
            aria-labelledby={labeledBy}
          >
            <Translation>
              {
                (t) =>
                  <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder={t('common:Type to Filter') + '...'}
                    onChange={e => this.setState({filter: e.target.value})}
                    value={this.state.filter}
                  />
              }

            </Translation>
            <ul className="list-unstyled">
              {
                React.Children.toArray(children).filter(
                  child =>
                    ((!this.state.filter) || (child.props.children.includes(this.state.filter)))
                    &&
                    (((Number(child.props.eventKey) >= startIndex) && (Number(child.props.eventKey) < endIndex)))
                )
              }
            </ul>
            {!this.state.filter ?
              <Pagination
                current={this.state.currentPage}
                total={this.props.objectList.length}
                pageSize={OBJECT_SELECTION_PAGINATION_ITEMS}
                onChange={this.handlePaginationClick.bind(this)}
                showLessItems={true}
                locale={en_US}
                showTitle={false}
              />
              : null}
          </div>
        );
      }
    );

    return (
      <Dropdown onSelect={this.props.handleObjectSelect}>
        <Dropdown.Toggle id="dropdown-custom-components">
          {this.getObjectName(this.props.objectList, this.props.objectSelection)}
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          {this.props.objectList.map((item, i) => (
            <Dropdown.Item
              key={this.props.name + '-' + item.name}
              eventKey={String(item.id)}
            >
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
