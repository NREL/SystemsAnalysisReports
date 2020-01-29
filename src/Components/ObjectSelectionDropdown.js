import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import FormControl from 'react-bootstrap/FormControl';
import Pagination from 'react-bootstrap/Pagination';
import { OBJECT_SELECTION_PAGINATION_ITEMS } from '../constants/settings';

export class ObjectSelectionDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: '',
            paginationActiveItem: 1,
        };
    } 

    getObjectName(id) {
        // Get the string name of the object given an id
        for (var i = 0; i < this.props.objectList.length; i++) {
            if (this.props.objectList[i].id.toString() === id.toString()) {
                return this.props.objectList[i].name
            }
        }
    }

    handlePaginationClick(event) {
        this.setState({paginationActiveItem: Number(event.target.text)});
    }

    render() {
        // Creates a custom toggle for the dropdown menu
        const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
            <a
            href="/"
            ref={ref}
            onClick={e => {
                e.preventDefault();
                onClick(e);
            }}
            >
            {children}
            &#x25bc;
            </a>
        ));
        
        // Creates a custom menu for the dropdown that provides pagination and filtering
        const CustomMenu = React.forwardRef(
            ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {

            // Get the latest array of filtered children to determine pagination length
            var newChild = React.Children.toArray(children).filter(
                child =>
                    ((!this.state.filter) || (child.props.children.startsWith(this.state.filter))),
                )

            // Determine number of pagination screens needed
            const numPagScreens = Math.max(Math.ceil(newChild.length/OBJECT_SELECTION_PAGINATION_ITEMS),1);

            // Loop to create arrayof pagination items to render
            var paginationItems = [];
            for (var i = 1; i <= numPagScreens; i++) {
                paginationItems.push(
                    <Pagination.Item key={i} active={i === this.state.paginationActiveItem}>
                    {i}
                    </Pagination.Item>,
                );
            }

            // Get the start/stop indices for the pagination
            // Initialize to full array
            var startIndex = 0;
            var endIndex = React.Children.toArray(children).length;

            // Only apply pagination if no filter exists.  Otherwise filtered results may not show.
            if (!this.state.filter) {
                startIndex = (this.state.paginationActiveItem-1)*OBJECT_SELECTION_PAGINATION_ITEMS;
                endIndex = startIndex+OBJECT_SELECTION_PAGINATION_ITEMS;
            }

            return (
                <div
                ref={ref}
                style={style}
                className={className}
                aria-labelledby={labeledBy}
                >
                <FormControl
                    autoFocus
                    className="mx-3 my-2 w-auto"
                    placeholder="Type to filter..."
                    onChange={e => this.setState({filter: e.target.value})}
                    value={this.state.filter}
                />
                <ul className="list-unstyled">
                    {React.Children.toArray(children).filter(
                    child =>
                        ((!this.state.filter) || (child.props.children.startsWith(this.state.filter))) && (((Number(child.props.eventKey) >= startIndex) && (Number(child.props.eventKey) < endIndex))),
                    )}
                </ul>
                <Pagination size="sm" onClick={this.handlePaginationClick.bind(this)}>
                    { paginationItems }
                </Pagination>
                </div>
            );
            },
        );

        return (
          <Dropdown onSelect={this.props.handleObjectSelect.bind(this)} className="App-dropdown">
          <Dropdown.Toggle variant="secondary" as={CustomToggle} id="dropdown-custom-components">
              { this.getObjectName(this.props.objectSelection) }
          </Dropdown.Toggle>

          <Dropdown.Menu as={CustomMenu}>
              { this.props.objectList.map((item, i) => (
                  <Dropdown.Item
                  key={this.props.name + '-' + item.name}
                  eventKey={item.id}
                  >
                  {item.name}
                  </Dropdown.Item>
              ))}
          </Dropdown.Menu>
          </Dropdown>
                      
        );
    }
}