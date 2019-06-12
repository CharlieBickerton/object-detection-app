import React, { Component } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

function hasGetUserMedia() {
  return !!(
    (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    || navigator.webkitGetUserMedia
    || navigator.mozGetUserMedia
    || navigator.msGetUserMedia
  );
}

const constrainStringType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
  PropTypes.shape({
    exact: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  }),
  PropTypes.shape({
    ideal: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]),
  }),
]);

const constrainBooleanType = PropTypes.oneOfType([
  PropTypes.shape({
    exact: PropTypes.bool,
  }),
  PropTypes.shape({
    ideal: PropTypes.bool,
  }),
]);

const constrainLongType = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.shape({
    exact: PropTypes.number,
    ideal: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
  }),
]);

const constrainDoubleType = constrainLongType;

const audioConstraintType = PropTypes.shape({
  deviceId: constrainStringType,
  groupId: constrainStringType,
  autoGainControl: constrainBooleanType,
  channelCount: constrainLongType,
  latency: constrainDoubleType,
  noiseSuppression: constrainBooleanType,
  sampleRate: constrainLongType,
  sampleSize: constrainLongType,
  volume: constrainDoubleType,
});

const videoConstraintType = PropTypes.shape({
  deviceId: constrainStringType,
  groupId: constrainStringType,
  aspectRatio: constrainDoubleType,
  facingMode: constrainStringType,
  frameRate: constrainDoubleType,
  height: constrainLongType,
  width: constrainLongType,
});

export default class Camera extends Component {
  static defaultProps = {
    audio: true,
    className: '',
    height: 480,
    imageSmoothing: true,
    onUserMedia: () => {},
    onUserMediaError: () => {},
    screenshotFormat: 'image/webp',
    width: 640,
    screenshotQuality: 0.92,
  };

  static propTypes = {
    audio: PropTypes.bool,
    onUserMedia: PropTypes.func,
    onUserMediaError: PropTypes.func,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    screenshotFormat: PropTypes.oneOf([
      'image/webp',
      'image/png',
      'image/jpeg',
    ]),
    style: PropTypes.object,
    className: PropTypes.string,
    screenshotQuality: PropTypes.number,
    minScreenshotWidth: PropTypes.number,
    minScreenshotHeight: PropTypes.number,
    audioConstraints: audioConstraintType,
    videoConstraints: videoConstraintType,
    imageSmoothing: PropTypes.bool,
  };

  static mountedInstances = [];

  static userMediaRequested = false;

  constructor() {
    super();
    this.state = {
      hasUserMedia: false,
      modelLoaded: false,
    };
  }

  componentDidMount() {
    if (!hasGetUserMedia()) return;

    const { state } = this;

    Camera.mountedInstances.push(this);

    if (!state.hasUserMedia && !Camera.userMediaRequested) {
      this.requestUserMedia();
    }
    if (this.video) {
      this.initPredictions();
    }
  }

  componentDidUpdate(nextProps) {
    const { props } = this;
    if (
      JSON.stringify(nextProps.audioConstraints)
        !== JSON.stringify(props.audioConstraints)
      || JSON.stringify(nextProps.videoConstraints)
        !== JSON.stringify(props.videoConstraints)
    ) {
      this.requestUserMedia();
    }
  }

  componentWillUnmount() {
    const { state } = this;
    const index = Camera.mountedInstances.indexOf(this);
    Camera.mountedInstances.splice(index, 1);

    Camera.userMediaRequested = false;
    if (Camera.mountedInstances.length === 0 && state.hasUserMedia) {
      if (this.stream.getVideoTracks && this.stream.getAudioTracks) {
        this.stream.getVideoTracks().map(track => track.stop());
        this.stream.getAudioTracks().map(track => track.stop());
      } else {
        this.stream.stop();
      }
      window.URL.revokeObjectURL(state.src);
    }
  }

  initPredictions = async () => {
    const model = await cocoSsd.load('lite_mobilenet_v2');
    this.setState({ modelLoaded: true });
    this.predictFrame(model);
  }

  predictFrame = async (model) => {
    const {frame, ctx} = await this.collectFrame();
    const predictions = await model.detect(frame);
    this.renderPredictedFrame(predictions, frame, ctx)
    requestAnimationFrame(async () => {
      const {frame, ctx} = await this.collectFrame();
      const predictions = await model.detect(frame);
      this.renderPredictedFrame(predictions, frame, ctx)
    })
  }

  collectFrame = async () => {

    const { canvas, ctx } = this.getPredictionCanvas();

    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return {frame, ctx};
  }

  renderPredictedFrame = (predictions, frame, ctx) => {
    const font = "16px sans-serif";
    console.log(predictions, frame)
    predictions.forEach(prediction => {
      ctx.putImageData(frame, 0, 0);
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
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

      ctx.fillStyle = "#000000";
      ctx.fillText(prediction.class, x, y);
    });

  }

  getScreenshot() {
    const { state, props } = this;

    if (!state.hasUserMedia) return null;

    const req = this.getScreenShotCanvas();
    const canvas = req.canvas
    return (
      canvas
      && canvas.toDataURL(
        props.screenshotFormat,
        props.screenshotQuality,
      )
    );
  }

  getPredictionCanvas = () => {
    const canvas = document.getElementById("canvas");

    canvas.width = this.video.videoWidth;
    canvas.height = this.video.videoHeight;

    const ctx = canvas.getContext('2d');
    return { canvas, ctx }
  }

  getScreenShotCanvas() {
    const { state, props } = this;

    if (!state.hasUserMedia || !this.video.videoHeight) return null;

    if (!this.ctx) {
      const canvas = document.createElement('canvas');
      const aspectRatio = this.video.videoWidth / this.video.videoHeight;

      let canvasWidth = props.minScreenshotWidth || this.video.clientWidth;
      let canvasHeight = canvasWidth / aspectRatio;

      if (props.minScreenshotHeight && (canvasHeight < props.minScreenshotHeight)) {
        canvasHeight = props.minScreenshotHeight;
        canvasWidth = canvasHeight * aspectRatio;
      }

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      console.log('first ctx', this.ctx)
    }

    const { ctx, canvas } = this;
    ctx.imageSmoothingEnabled = props.imageSmoothing;
    ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);

    return this;
  }

  requestUserMedia() {
    const { props } = this;

    navigator.getUserMedia = navigator.mediaDevices.getUserMedia
      || navigator.webkitGetUserMedia
      || navigator.mozGetUserMedia
      || navigator.msGetUserMedia;

    const sourceSelected = (audioConstraints, videoConstraints) => {
      const constraints = {
        video: videoConstraints || true,
      };

      if (props.audio) {
        constraints.audio = audioConstraints || true;
      }

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          Camera.mountedInstances.forEach(instance => instance.handleUserMedia(null, stream));
        })
        .catch((e) => {
          Camera.mountedInstances.forEach(instance => instance.handleUserMedia(e));
        });
    };

    if ('mediaDevices' in navigator) {
      sourceSelected(props.audioConstraints, props.videoConstraints);
    } else {
      const optionalSource = id => ({ optional: [{ sourceId: id }] });

      const constraintToSourceId = (constraint) => {
        const { deviceId } = constraint || {};

        if (typeof deviceId === 'string') {
          return deviceId;
        }

        if (Array.isArray(deviceId) && deviceId.length > 0) {
          return deviceId[0];
        }

        if (typeof deviceId === 'object' && deviceId.ideal) {
          return deviceId.ideal;
        }

        return null;
      };

      MediaStreamTrack.getSources((sources) => {
        let audioSource = null;
        let videoSource = null;

        sources.forEach((source) => {
          if (source.kind === 'audio') {
            audioSource = source.id;
          } else if (source.kind === 'video') {
            videoSource = source.id;
          }
        });

        const audioSourceId = constraintToSourceId(props.audioConstraints);
        if (audioSourceId) {
          audioSource = audioSourceId;
        }

        const videoSourceId = constraintToSourceId(props.videoConstraints);
        if (videoSourceId) {
          videoSource = videoSourceId;
        }

        sourceSelected(
          optionalSource(audioSource),
          optionalSource(videoSource),
        );
      });
    }

    Camera.userMediaRequested = true;
  }

  handleUserMedia(err, stream) {
    const { props } = this;

    if (err) {
      this.setState({ hasUserMedia: false });
      props.onUserMediaError(err);

      return;
    }

    this.stream = stream;


    try {
      this.video.srcObject = stream;
      this.setState({ hasUserMedia: true });
    } catch (error) {
      this.setState({
        hasUserMedia: true,
        src: window.URL.createObjectURL(stream),
      });
    }

    props.onUserMedia();
  }

  render() {
    const { state, props } = this;

    return (
      <div>
        <video
          hidden
          autoPlay
          width={props.width}
          height={props.height}
          src={state.src}
          muted={props.audio}
          className={props.className}
          playsInline
          style={props.style}
          ref={(ref) => {
            this.video = ref;
          }}
        />
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
      </div>
    );
  }
}