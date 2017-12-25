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

  render() {
    let p = this.state.packageInfo;
    let hostedComponent = BridgeManager.get().itemForPackage(p, false);
    let localComponent = BridgeManager.get().itemForPackage(p, true);
    let installed = hostedComponent || localComponent;
    let hasLocalOption = p.download_url != null;
    let showOpenOption = installed && ["rooms", "modal"].includes((hostedComponent || localComponent).content.area);
    var updateAvailable = false, installedVersion;

    if(localComponent) {
      installedVersion = localComponent.content.package_info.version;
      updateAvailable = compareVersions(p.version, installedVersion) == 1;
    }

    return (
      <div>
        <p><strong>{p.name}</strong></p>
        <p>Latest Version: {p.version}</p>

        {localComponent &&
          <p>Installed Version: {installedVersion}</p>
        }

        <button onClick={this.togglePackageInstallation}>
          {hostedComponent ? "Uninstall" : "Install"}
        </button>

        {hasLocalOption &&
          <button onClick={this.togglePackageLocalInstallation}>
            {localComponent ? "Uninstall Offline" : "Install Offline"}
          </button>
        }

        {showOpenOption &&
          <button onClick={this.openComponent}>
            Open
          </button>
        }

        {updateAvailable &&
          <button onClick={this.updateComponent}>
            Update
          </button>
        }

      </div>
    )
  }

}
