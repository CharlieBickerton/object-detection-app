import React from 'react';
import './App.css';
import {Layout} from 'antd'
import TopNav from './Layout/TopNav';
import LiveStream from './Layout/LiveStream';
const { Content } = Layout;



class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <TopNav/>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <LiveStream/>
        </Content>
        <Layout style={{ textAlign: 'center' }}>Detect ©2019 Created by Charlie Bickerton</Layout>
      </Layout>
    );
  }
}

export default App;
