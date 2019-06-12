import React from 'react';
import './App.css';
import {Layout} from 'antd'
import TopNav from './Layout/TopNav';
import LiveStream from './Layout/LiveStream';
const { Content } = Layout;



class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      windowHeight: window.innerHeight, // 64 = height of navBar
      windowWidth: window.innerWidth,
    };
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
    this.setState({ windowHeight, windowWidth });
  }

  render() {
    return (
      <Layout>
        <TopNav/>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <LiveStream windowHeight={this.state.windowHeight} windowWidth={this.state.windowWidth} />
        </Content>
        <Layout className="Footer" style={{ textAlign: 'center' }}>Detect ©2019 Created by Charlie Bickerton</Layout>
      </Layout>
    );
  }
}

export default App;
