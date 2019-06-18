import React from 'react';
import {Layout} from 'antd'
import TopNav from './TopNav';
import LiveStream from './LiveStream';
import Login from '../Forms/Login';
import Register from '../Forms/Register';
const { Content } = Layout;



class HomePage extends React.Component {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    console.log('this.props:', this.props)
  }

  render() {
    return (
      <div>
        <Layout>

          { this.props.type === 'Authed' ?
            <div>
              <TopNav userAuthBool={true}/>
              <Content style={{ marginTop: 64, height: this.props.windowHeight - 85 }}>
                <LiveStream authed={true} windowHeight={this.props.windowHeight} windowWidth={this.props.windowWidth} />
              </Content>
            </div>
            : this.props.type === 'Login' ?
            <div>
              <TopNav userAuthBool={false}/>
              <Content style={{ marginTop: 64, height: this.props.windowHeight - 85 }}>
                <Login/>
              </Content>
            </div>
            : this.props.type === 'Register' ?
            <div>
              <TopNav userAuthBool={false}/>
              <Content style={{ marginTop: 64, height: this.props.windowHeight - 85 }}>
                <Register/>
              </Content>
            </div>
            :
            <div>
              <TopNav userAuthBool={false}/>
              <Content style={{ marginTop: 64, height: this.props.windowHeight - 85 }}>
                <LiveStream authed={false} windowHeight={this.props.windowHeight} windowWidth={this.props.windowWidth} />
              </Content>
            </div>
          }
          <Layout className="Footer" style={{ backgroundColor: 'White', textAlign: 'center' }}>Detect ©2019 Created by Charlie Bickerton</Layout>
        </Layout>
      </div>

    );
  }
}

export default HomePage;
