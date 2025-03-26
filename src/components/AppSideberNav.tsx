import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'

export interface NavItem {
  component: React.ElementType;
  name?: string;
  badge?: { color: string; text: string };
  icon?: React.ReactNode;
  to?: string;
  href?: string;
  items?: NavItem[];
  [key: string]: unknown;
}

interface AppSidebarNavProps {
  items: NavItem[];
}

export const AppSidebarNav: React.FC<AppSidebarNavProps> = ({ items }) => {
  const navLink = (name: string | undefined, icon: React.ReactNode, badge: { color: string; text: string } | undefined, indent = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto" size="sm">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item: NavItem, index: number, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink
            {...(rest.to && { as: NavLink })}
            {...(rest.href && { target: '_blank', rel: 'noopener noreferrer' })}
            {...rest}
          >
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

const navGroup = (item: NavItem, index: number) => {
    const { component, name, icon, items, ...rest } = item
    const Component = component
    return (
        <Component
            compact
            as="div"
            key={index}
            toggler={navLink(name, icon, undefined)}
            {...rest}
        >
            {items?.map((item: NavItem, index: number) =>
                item.items ? navGroup(item, index) : navItem(item, index, true),
            )}
        </Component>
    )
}

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}