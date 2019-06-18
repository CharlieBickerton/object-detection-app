import React from 'react';
import {Layout, Menu} from 'antd'
import { NavLink, withRouter } from "react-router-dom";
const { Item } = Menu;


class TopNav extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  render() {
    return (
      <Layout style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        <Menu
          mode="horizontal"
          defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Item key="1">Detect</Item>
          <Item style={{ textAlign: "right", float: "right" }} key="2">
            <NavLink to="/login">Login</NavLink>
          </Item>
          <Item style={{ textAlign: "right", float: "right" }} key="3">
            Register
          </Item>
        </Menu>
      </Layout>
    );
  }
}

export default withRouter(TopNav);
