import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown'
import FormControl from 'react-bootstrap/FormControl';
//import Pagination from 'react-bootstrap/Pagination';
//import ReactPaginate from 'react-paginate';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import { OBJECT_SELECTION_PAGINATION_ITEMS } from '../constants/settings';

export class ObjectSelectionDropDown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filter: '',
            currentPage: 1,
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
        const selected = event;

        this.setState({
            currentPage: selected,
        });
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

            const selected = this.state.currentPage;

            // Get the start/stop indices for the pagination
            // Initialize to full array
            var startIndex = 0;
            var endIndex = React.Children.toArray(children).length;
    
            // Only apply pagination if no filter exists.  Otherwise filtered results may not show.
            if (!this.state.filter) {
                startIndex = (selected-1)*OBJECT_SELECTION_PAGINATION_ITEMS;
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
                    {
                        React.Children.toArray(children).filter(
                            child => 
                                ((!this.state.filter) || (child.props.children.includes(this.state.filter))) 
                                &&
                                (((Number(child.props.eventKey) >= startIndex) && (Number(child.props.eventKey) < endIndex))),

                        )
                    }
                </ul>
                { !this.state.filter ? 
                    <Pagination
                    current={this.state.currentPage}
                    total={this.props.objectList.length}
                    pageSize={OBJECT_SELECTION_PAGINATION_ITEMS}
                    onChange={this.handlePaginationClick.bind(this)}
                    showLessItems={true}
                    locale={'en_US'}
                    /> 
                : null}
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