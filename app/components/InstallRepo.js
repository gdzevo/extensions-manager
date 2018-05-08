import React from 'react';
import Repo from "../models/Repo.js";
import RepoController from "../lib/RepoController.js";
import BridgeManager from "../lib/BridgeManager.js";

export default class InstallRepo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {url: ""};
  }

  installProLink(url) {
    var decoded;
    try {
      // base64 decode
      decoded = atob(url);
    } catch (e) {}

    if(decoded) {
      url = decoded;
    }

    BridgeManager.get().installRepoUrl(url);
    this.setState({url: ""});
  }

  handleKeyPress = (e) => {
    if(e.key === 'Enter') {
      this.installProLink(this.state.url);
    }
  }

  handleChange = (event) => {
    this.setState({url: event.target.value});
  }

  submitUrl = () => {
    this.installProLink(this.state.url);
  }

  render() {
    return (
      <div id="install-repo" className="panel-section">
        <div className="panel-row centered">
          <h1 className="title"><strong>Enter Your Extended Activation Code</strong></h1>
        </div>
        <div className="notification info dashed one-line">
          <input
            className="info clear center-text"
            placeholder="Enter Extended Code"
            type="url"
            value={this.state.url}
            onKeyPress={this.handleKeyPress}
            onChange={this.handleChange}
          />
        </div>

        {this.state.url && this.state.url.length > 0 &&
          <div id="submit-button" className="panel-row centered">
            <a onClick={this.submitUrl} className="button success big">
              <div className="label">
                Submit Code
              </div>
            </a>
          </div>
        }

        <div className="panel-row centered">
          <h1 className="title center-text">
            <strong>Standard Notes Extended</strong> gives you access to powerful editors, extensions, tools, themes, and cloud backup options.
          </h1>
        </div>
        <div className="panel-row" />
        <div className="panel-row centered">
          <a href="https://standardnotes.org/extensions" target="_blank" className="button info big">
            <div className="label">
              Learn More
            </div>
          </a>
        </div>
      </div>
    )
  }

}
