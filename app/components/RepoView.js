import React from 'react';
import Repo from "../models/Repo.js";
import RepoController from "../lib/RepoController.js";
import BridgeManager from "../lib/BridgeManager.js";
import PackageView from "./PackageView";

export default class RepoView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {packages: []};

    this.needsUpdateComponents = true;

    this.repoController = new RepoController({repo: props.repo});
    this.repoController.getPackages((packages, error) => {
      if(!error) {
        this.setState({packages: packages});
        if(this.receivedBridgeItems && this.needsUpdateComponents) {
          this.updateComponentsWithNewPackageInfo();
        }
      }
    })

    this.updateObserver = BridgeManager.get().addUpdateObserver(() => {
      this.receivedBridgeItems = true;
      if(this.needsUpdateComponents && this.state.packages.length > 0) {
        this.updateComponentsWithNewPackageInfo();
      }
      this.reload();
    })
  }

  updateComponentsWithNewPackageInfo() {
    this.needsUpdateComponents = false;
    // Update expiration dates for packages
    var needingSave = []
    for(let packageInfo of this.state.packages) {
      let installed = BridgeManager.get().itemForPackage(packageInfo);
      if(installed) {
        var needsSave = false;
        let validUntil = new Date(packageInfo.valid_until);
        // .getTime() must be used to compare dates
        if(!installed.content.valid_until || (installed.content.valid_until.getTime() !== validUntil.getTime())) {
          installed.content.valid_until = validUntil;
          needsSave = true;
        }

        if(!installed.content.package_info || installed.content.package_info !== packageInfo) {
          installed.content.package_info = packageInfo;
          needsSave = true;
        }

        if(needsSave) {
          needingSave.push(installed);
        }
      }
    }

    if(needingSave.length > 0) {
      BridgeManager.get().saveItems(needingSave);
    }
  }

  componentWillUnmount() {
    BridgeManager.get().removeUpdateObserver(this.updateObserver);
  }

  reload() {
    this.forceUpdate();
  }

  toggleOptions = () => {
    this.setState({showOptions: !this.state.showOptions});
  }

  deleteRepo = () => {
    if(confirm("Are you sure you want to delete this ProLink repository?")) {
      BridgeManager.get().uninstallRepo(this.props.repo);
    }
  }

  render() {
    return (
      <div className="panel-section">
        <div className="panel-row">
          <h3 className="title">Repository</h3>
          <a onClick={this.toggleOptions} className="info">Options</a>
        </div>

        {this.state.showOptions &&
            <div className="panel-row">
              <a onClick={this.deleteRepo} className="danger">Delete</a>
            </div>
        }

        <div className="panel-row">
          <div className="packages panel-table">
            {this.state.packages.map((p, index) =>
              <div className="package table-item">
                <PackageView key={p.identifier} packageInfo={p} />
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

}
