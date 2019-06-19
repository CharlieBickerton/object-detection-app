import React from 'react';
import Webcam from "react-webcam";
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Button, Row, Col, Spin } from 'antd';
import { NavLink } from 'react-router-dom';
import Api from '../utils/Api';

const font = "16px sans-serif";

class LiveStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('currentUser')),
      hasUserMedia: false,
      modelLoaded: false,
      // facingMode: "environment",
    };
  }

  capture = async () => {
    const canvas = document.getElementById("canvas");
    const imageSrc = canvas.toDataURL("image/png")
    await Api.savePrediction(imageSrc, this.state.user.token);
  };

  componentDidMount() {
    this.initPredictions();
  }

  initPredictions = async () => {
    this.model = await cocoSsd.load('lite_mobilenet_v2');
    this.setState({ modelLoaded: true });
    this.streamPredictions()
  }

  collectAndDrawCanvas = (video) => {
    try {
      const canvas = document.getElementById("canvas");
      if (canvas) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = font;
        ctx.textBaseline = "top";
        return {canvas, ctx};
      }
    } catch (error) {
      console.log(error)
    }
  }

  drawPrediction = (prediction, ctx) => {
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
  }


  streamPredictions = async () => {
    try {
      const video = await document.getElementsByClassName("video-live-stream")[0]
      // const video = await document.getElementsByTagName("video")[0]
      // draw canvas and frame
      if (video) {
        const predictions = await this.model.detect(video);
        const {canvas, ctx} = await this.collectAndDrawCanvas(video)
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // render inference
        predictions.map(prediction => {
          this.drawPrediction(prediction, ctx);
        });

        // repeat using rAF
        requestAnimationFrame(() => {
          this.streamPredictions();
        })
      } else { console.log('no video') }
    } catch (error) {
      console.log(error)
    } 
  }

  // switchCamera = () => {
  //   console.log('in switch cam')
  //   if (this.state.facingMode === "user") {
  //     this.setState({
  //       facingMode: "environment"
  //     })
  //   }
  // }

  render() {
    let height = "initial"
    let width = "initial"
    if (this.props.windowHeight > this.props.windowWidth) {
      height = "auto";
      width = "100%";
    } else {
      height = "100%";
      width = "auto%";
    }
    // let videoConstraints = {
    //   facingMode: this.state.facingMode
    // };

    return (
      <Row>
        <Col sm={24}>
          <div 
            hidden
          >
            <Webcam
              audio={false}
              className={'video-live-stream'}
              // videoConstraints={videoConstraints}
              style={{
                height: height,
                width: width,
                objectFit: "fill",
                position: "absolute"
              }}
            />
          </div>
          { this.state.modelLoaded ?
            <div 
            style={{textAlign: "center", height: height, width: width}}
            >
              <canvas id="canvas"
                style={{
                  height: height,
                  width: width,
                  maxHeight: this.props.windowHeight - 150
                }}
              />
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
          <div style={{marginTop: "15px",textAlign: "center"}}>
            { !this.props.authed ?
              <NavLink to={'/register'}><Button style={{margin: '10px'}} >Sign up to save detections</Button></NavLink>
            :
              <Button onClick={this.capture}>Click to save prediction</Button>
            }
          </div>
        </Col>
      </Row>
    );
  }

}

export default LiveStream;
