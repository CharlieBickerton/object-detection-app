import React from 'react';
// import * as cocoSSD from '@tensorflow-models/coco-ssd';
import Webcam from "react-webcam";
import { Button, Row, Col } from 'antd';


class LiveStream extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props)
  }

  render() {

    return (
      <Row type="flex" justify="center">
        <Col sm={24}>
          <Webcam
            audio={false}
            height={this.props.windowHeight - 150}
            width={this.props.windowWidth}
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
}

export default LiveStream;
