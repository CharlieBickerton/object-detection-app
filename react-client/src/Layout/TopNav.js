import React from 'react';
import {Layout, Menu, Icon} from 'antd'
import { NavLink, withRouter } from "react-router-dom";
import auth from '../utils/auth';
const { Item } = Menu;


class TopNav extends React.Component {
  // constructor(props) {
  //   super(props);
  // }

  logout = () => {
    auth.logout()
  }

  componentDidMount() {
    console.log('topnav props',this.props)
  }

  render() {
    return (
      <Layout style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
        { this.props.userAuthBool === true ? 
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Item key="1"><NavLink to="/app"><Icon type="home" />Detect</NavLink></Item>
            <Item key="3" style={{ textAlign: "right", float: "right" }}>
              <a target="_blank" rel="noopener noreferrer" onClick={this.logout}>
                <Icon type="logout" /> Logout
              </a>
            </Item>
            <Item key="2" style={{ textAlign: "right", float: "right" }}>
              <NavLink to="/Account"><Icon type="user" />Account</NavLink>
            </Item>
          </Menu>
        :
          <Menu
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{ lineHeight: '64px' }}
          >
            <Item key="1"><NavLink to="/"><Icon type="home" />Detect</NavLink></Item>
            <Item style={{ textAlign: "right", float: "right" }} key="2">
              <NavLink to="/login"><Icon type="login" />Login</NavLink>
            </Item>
            <Item style={{ textAlign: "right", float: "right" }} key="3">
              <NavLink to="/register"><Icon type="user-add" />Register</NavLink>
            </Item>
          </Menu>
        }
      </Layout>
    );
  }
}

export default withRouter(TopNav);
