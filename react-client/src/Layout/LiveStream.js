import React from 'react';
import Webcam from "react-webcam";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Button, Row, Col, Spin } from 'antd';
// import Camera from '../Camera';

class LiveStream extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      hasUserMedia: false,
      modelLoaded: false,
    };
  }

  componentDidMount() {
    this.initPredictions();
  } 

  initPredictions = async () => {
    this.model = await cocoSsd.load('lite_mobilenet_v2');
    this.setState({ modelLoaded: true });
    this.streamPredictions()
  }

  streamPredictions = async () => {
    const video = await document.getElementsByTagName("video")[0]
    // draw canvas and frame
    const predictions = await this.model.detect(video);

    const canvas = document.getElementById("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // predict on frame

    // const firstPrediction = predictions[0]

    // render inference
    predictions.forEach(prediction => {
      const y = prediction.bbox[1];
      const x = prediction.bbox[0];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });
    
    // repeat using rAF
    requestAnimationFrame(() => {
      this.streamPredictions();
    })
  }

  render() {

    return (
      <Row type="flex" justify="center">
        <Col sm={24}>
          <div hidden>
            <Webcam
              audio={false}
              className="video-stream"
            />
          </div>
          { this.state.modelLoaded ?
            <div style={{textAlign: "center", height: this.props.height, width: this.props.width}}>
              <canvas id="canvas"/>
            </div>
          :
            <div style={{textAlign: "center", paddingTop: "10%"}}>
              <Spin size="large"/>
              <br/>
              <div>Loading Detection Model</div>
            </div>
          }
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
