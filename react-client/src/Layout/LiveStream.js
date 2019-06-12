import React from 'react';
// import Webcam from "react-webcam";
import { Button, Row, Col } from 'antd';
import Camera from '../Camera';

class LiveStream extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
  }


  render() {

    return (
      <Row type="flex" justify="center">
        <Col sm={24}>
          <Camera
            audio={false}
            height={this.props.windowHeight - 150}
            width={this.props.windowWidth}
            className="video-stream"
          />
        </Col>
        <Col sm={24}>
          <div style={{textAlign: "center"}}>
            <Button >Sign Up</Button>
            <Button style={{margin: '10px'}} >Sign Up</Button>
          </div>
        </Col>
      </Row>
    );
  }

  // prediction = async () => {
  //   const model = await cocoSsd.load();
  // }

}

export default LiveStream;
