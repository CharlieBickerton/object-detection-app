import React from 'react';
// import * as cocoSSD from '@tensorflow-models/coco-ssd';
import Webcam from "react-webcam";


class LiveStream extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props)
  }

  render() {
    return (
      <Webcam
        width={this.props.windowWidth - 60}
        height={this.props.windowHeight - 90}
      />
    );
  }
}

export default LiveStream;
