import React from 'react';
import Repo from "../models/Repo.js";
import RepoController from "../lib/RepoController.js";
import BridgeManager from "../lib/BridgeManager.js";
var compareVersions = require('compare-versions');

export default class PackageView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {packageInfo: props.packageInfo};
  }

  get packageInfo() {
    return this.state.packageInfo;
  }

  togglePackageInstallation = () => {
    if(BridgeManager.get().isPackageInstalledHosted(this.packageInfo)) {
      BridgeManager.get().uninstallPackageHosted(this.packageInfo);
    } else {
      BridgeManager.get().installPackageHosted(this.packageInfo);
    }
  }

  togglePackageLocalInstallation = () => {
    if(BridgeManager.get().isPackageInstalledLocal(this.packageInfo)) {
      BridgeManager.get().uninstallPackageOffline(this.packageInfo);
    } else {
      BridgeManager.get().installPackageOffline(this.packageInfo);
    }
  }

  openComponent = () => {
    BridgeManager.get().sendOpenEvent(this.packageInfo);
  }

  updateComponent = () => {
    BridgeManager.get().installPackageOffline(this.packageInfo);
  }

  openUrl = (url) => {
    var win = window.open(url, '_blank');
    win.focus();
  }

  render() {
    let p = this.state.packageInfo;
    let hostedComponent = BridgeManager.get().itemForPackage(p, false);
    let localComponent = BridgeManager.get().itemForPackage(p, true);
    let installed = hostedComponent || localComponent;
    let hasLocalOption = p.download_url != null;
    let showOpenOption = installed && ["rooms", "modal"].includes((hostedComponent || localComponent).content.area);
    var updateAvailable = false, installedVersion;
    var localInstallationAvailable = BridgeManager.get().localComponentInstallationAvailable();

    if(localInstallationAvailable && localComponent) {
      installedVersion = localComponent.content.package_info.version;
      updateAvailable = compareVersions(p.version, installedVersion) == 1;
    }

    return [
        <div className="item-content">
          <div className="item-column">
            {p.thumbnail_url &&
              <img src={p.thumbnail_url} />
            }

            <h4><strong>{p.name}</strong></h4>
            <p>{p.description}</p>

            {localInstallationAvailable &&
              <p>Latest Version: {p.version}</p>

              [localComponent &&
                <p>Installed Version: {installedVersion}</p>
              ]
            }
          </div>
        </div>,

        <div className="item-footer">
          <div className="button-group">
            <div className={"button " + (hostedComponent ? 'danger' : 'info')} onClick={this.togglePackageInstallation}>
              {hostedComponent ? "Uninstall" : "Install"}
            </div>

            {localInstallationAvailable && hasLocalOption &&
              <div className="button info" onClick={this.togglePackageLocalInstallation}>
                {localComponent ? "Uninstall Offline" : "Install Offline"}
              </div>
            }

            {showOpenOption &&
              <div className="button success" onClick={this.openComponent}>
                Open
              </div>
            }

            {localInstallationAvailable && updateAvailable &&
              <div className="button info" onClick={this.updateComponent}>
                Update
              </div>
            }

            {p.marketing_url &&
              <div className="button default" onClick={() => {this.openUrl(p.marketing_url)}}>
                Info
              </div>
            }
          </div>
        </div>
    ]
  }

}
