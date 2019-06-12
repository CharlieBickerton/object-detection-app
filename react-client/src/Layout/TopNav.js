import React from 'react';
import {Layout, Menu} from 'antd'
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
            Login
          </Item>
          <Item style={{ textAlign: "right", float: "right" }} key="3">
            Register
          </Item>
        </Menu>
      </Layout>
    );
  }
}

export default TopNav;
