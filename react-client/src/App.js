import React from 'react';
import './App.css';
import { Route } from 'react-router-dom'
import HomePage from './Layout/HomePage';
import { ProtectedRoute } from './Components/ProtectedRoute';

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
        <ProtectedRoute path="/app" component={HomePage}
          userAuthBool={true} type={'Authed'}
          windowHeight={this.state.windowHeight} windowWidth={this.state.windowWidth}
        />
        <ProtectedRoute path="/account" component={HomePage}
          userAuthBool={true} type={'AuthedAccount'}
          windowHeight={this.state.windowHeight} windowWidth={this.state.windowWidth}
        />
        <Route exact path="/" render={
          () => <HomePage userAuthBool={false} type={'notAuthed'}
          windowHeight={this.state.windowHeight} windowWidth={this.state.windowWidth}/>
        }/>
        <Route path="/login" render={
          () => <HomePage userAuthBool={false} type={'Login'}
          windowHeight={this.state.windowHeight} windowWidth={this.state.windowWidth}/>
        }/>
        <Route exact path="/register" render={
          () => <HomePage userAuthBool={false} type={'Register'}
          windowHeight={this.state.windowHeight} windowWidth={this.state.windowWidth}/>
        }/>
      </div>

    );
  }
}

export default App;
