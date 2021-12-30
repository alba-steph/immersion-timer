import React from "react";
import "./logo192.png";
import "./App.css";
import chimes from "./Alto.wav";

function App() {
  return (
    <div className="App">
      <Header />
      <Timer />
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <h1 className="title">flow / rest</h1>
      <p className="subtitle">an immersion timer</p>
    </div>
  );
}

class Timer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flow: true,
      active: false,
      flowLength: 25,
      restLength: 5,
      remaining: 10,
      counting: null,
    };
  }

  decrementTime = () => {
    let remaining = this.state.remaining;
    if (remaining > 0) {
      this.setState({
        remaining: remaining - 1,
      });
    } else {
      this.switchAttn();
      this.setState({
        remaining: this.findTotalSecs(),
      });
    }
  };

  onStartStopClick = () => {
    let active = this.state.active;
    let intervalId;
    if (active) {
      clearInterval(this.state.counting);
      intervalId = null;
    } else {
      intervalId = setInterval(this.decrementTime, 1000);
    }
    this.setState({
      active: !active,
      counting: intervalId,
    });
  };

  onReset = () => {
    let audio = document.getElementById("beep");
    audio.pause();
    audio.load();
    if (this.state.active) {
      clearInterval(this.state.counting);
    }
    this.setState({
      flow: true,
      active: false,
      flowLength: 25,
      restLength: 5,
      remaining: 1500,
      counting: null,
    });
  };

  onFlowPlusClick = () => {
    let flowLength = this.state.flowLength;
    let remaining = this.state.remaining;
    if (this.state.flow) {
      remaining = (flowLength + 1) * 60;
    }
    this.setState({
      flowLength: flowLength + 1,
      remaining: remaining,
    });
  };

  onFlowMinusClick = () => {
    let flowLength = this.state.flowLength;
    let remaining = this.state.remaining;
    if (this.state.flow) {
      remaining = (flowLength - 1) * 60;
    }
    this.setState({
      flowLength: flowLength - 1,
      remaining: remaining,
    });
  };

  onRestPlusClick = () => {
    let restLength = this.state.restLength;
    let remaining = this.state.remaining;
    if (!this.state.flow) {
      remaining = (restLength + 1) * 60;
    }
    this.setState({
      restLength: restLength + 1,
      remaining: remaining,
    });
  };

  onRestMinusClick = () => {
    let restLength = this.state.restLength;
    let remaining = this.state.remaining;
    if (!this.state.flow) {
      remaining = (restLength - 1) * 60;
    }
    this.setState({
      restLength: restLength - 1,
      remaining: remaining,
    });
  };

  getBtnText = (testActive) => {
    let btnText;
    testActive ? (btnText = "stop") : (btnText = "start");
    return btnText;
  };

  getLabel = (testFlow) => {
    let label;
    testFlow ? (label = "flow") : (label = "rest");
    return label;
  };

  switchAttn = () => {
    this.setState({
      flow: !this.state.flow,
    });
    let audio = document.getElementById("beep");
    audio.play();
  };

  findTotalSecs = () => {
    let totalMins;
    this.state.flow
      ? (totalMins = this.state.flowLength)
      : (totalMins = this.state.restLength);
    let totalSecs = totalMins * 60;
    return totalSecs;
  };

  displayTime = (totalSecs) => {
    let mins = Math.floor(totalSecs / 60);
    let secs = totalSecs % 60;
    function digits(d) {
      d = ("0" + d).slice(-2);
      return d;
    }
    let time = digits(mins) + ":" + digits(secs);
    return time;
  };

  render() {
    return (
      <div id="timer">
        <div className="countdown">
          <label htmlFor="time-left" id="timer-label">
            {this.getLabel(this.state.flow)}
            <div id="time-left">{this.displayTime(this.state.remaining)}</div>
          </label>
          <audio src={chimes} type="audio/wav" id="beep" hidden></audio>
          <button id="start_stop" onClick={this.onStartStopClick}>
            {this.getBtnText(this.state.active)}
          </button>
          <button id="reset" onClick={this.onReset}>
            reset
          </button>
        </div>
        <SetFlow
          flowLength={this.state.flowLength}
          active={this.state.active}
          onPlusClick={this.onFlowPlusClick}
          onMinusClick={this.onFlowMinusClick}
        />
        <SetRest
          restLength={this.state.restLength}
          active={this.state.active}
          onPlusClick={this.onRestPlusClick}
          onMinusClick={this.onRestMinusClick}
        />
      </div>
    );
  }
}

class SetFlow extends React.Component {
  onPlusClick = () => {
    if (!this.props.active && this.props.flowLength < 60) {
      this.props.onPlusClick();
    }
  };
  onMinusClick = () => {
    if (!this.props.active && this.props.flowLength > 1) {
      this.props.onMinusClick();
    }
  };

  render() {
    return (
      <div className="setflow">
        <label htmlFor="session-length" id="session-label">
          flow length
          <div id="session-length">{this.props.flowLength}</div>
          <button id="session-increment" onClick={this.onPlusClick}>
            +
          </button>
          <button id="session-decrement" onClick={this.onMinusClick}>
            -
          </button>
        </label>
      </div>
    );
  }
}

class SetRest extends React.Component {
  onPlusClick = () => {
    if (!this.props.active && this.props.restLength < 60) {
      this.props.onPlusClick();
    }
  };
  onMinusClick = () => {
    if (!this.props.active && this.props.restLength > 1) {
      this.props.onMinusClick();
    }
  };

  render() {
    return (
      <div className="setrest">
        <label htmlFor="break-length" id="break-label">
          rest length
          <div id="break-length">{this.props.restLength}</div>
          <button id="break-increment" onClick={this.onPlusClick}>
            +
          </button>
          <button id="break-decrement" onClick={this.onMinusClick}>
            -
          </button>
        </label>
      </div>
    );
  }
}

function Footer() {
  return (
    <div className="resources">
      <p>
        Coded by Stephanie Albanese in <a href="https://reactjs.org/">React</a>{" "}
        <img src="./logo192.png" className="logo" alt="React logo"></img>
      </p>
      <p>
        Challenge by{" "}
        <a href="https://www.freecodecamp.org/learn/front-end-development-libraries/front-end-development-libraries-projects/build-a-25--5-clock">
          freeCodeCamp
        </a>{" "}
        Front End Development Libraries certification curriculum
      </p>
      <p>
        Audio from{" "}
        <a href="https://www.shockwave-sound.com/free-sound-effects/wind-chimes-sounds">
          Shockwave-Sound
        </a>
      </p>
    </div>
  );
}

export default App;
