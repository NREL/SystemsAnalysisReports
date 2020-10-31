import React from 'react'

const Page = ({ title, location = {}, children, links}) => (
        <React.Fragment>
          <div>
            {links ? (
              <React.Fragment>
                <Sidebar links={links} />
                <div>{children}</div>
              </React.Fragment>
            ) : (
              children
            )}
          </div>
        </React.Fragment>
  )