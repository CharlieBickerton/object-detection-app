import React from 'react';
import './App.css';
import {Layout} from 'antd'
import TopNav from './Layout/TopNav';
import LiveStream from './Layout/LiveStream';
import Login from './Forms/Login';
import Register from './Forms/Register';

import { Route } from 'react-router-dom'
const { Content } = Layout;



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowHeight: window.innerHeight, // 64 = height of navBar
      windowWidth: window.innerWidth,
    };
    this.updateLayoutDimensions = this.updateLayoutDimensions.bind(this);
  }
  
  componentDidMount() {
    // set layout height, and attach a viewport size listener
    window.addEventListener("resize", this.updateLayoutDimensions);
    console.log(this.state)
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateLayoutDimensions);
  }

  updateLayoutDimensions() {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    this.setState({ 
      windowHeight,
      windowWidth, 
    });
  }

  render() {
    return (
      <div>
        <Layout>
          <TopNav/>
          <Content style={{ marginTop: 64, height: this.state.windowHeight - 85 }}>
            <Route 
              exact path="/"
              render={ ()=> <LiveStream windowHeight={this.state.windowHeight} windowWidth={this.state.windowWidth} /> }
            />
            <Route path="/login" render={ () => <Login/>}></Route>
            <Route path="/register" render={ () => <Register/>}></Route>
          </Content>
          <Layout className="Footer" style={{ backgroundColor: 'White', textAlign: 'center' }}>Detect ©2019 Created by Charlie Bickerton</Layout>
        </Layout>
      </div>

    );
  }
}

export default App;
