import React from 'react';
import BridgeManager from "../lib/BridgeManager.js";
import PackageView from "./PackageView";

export default class ManageInstalled extends React.Component {

  constructor(props) {
    super(props);

    BridgeManager.get().beginStreamingItems();

    this.updateObserver = BridgeManager.get().addUpdateObserver(() => {
      this.reload();
    })
  }

  componentWillUnmount() {
    BridgeManager.get().removeUpdateObserver(this.updateObserver);
  }

  reload() {
    this.forceUpdate();
  }

  uninstallExt = (ext) => {
    BridgeManager.get().uninstallComponent(ext);
  }

  renameExt = (ext) => {

  }

  category = (title, extensions) => {
    return (
      <div className="panel-section">
        <h4 className="title panel-row">{title} ({extensions.length})</h4>
        <div className="packages panel-table panel-row">
          {extensions.map((ext, index) =>
            <div className="table-item">
              <PackageView key={ext.uuid} component={ext} hideMeta={true} />
            </div>
          )}
        </div>
      </div>
    )
  }

  render() {
    var extensions = BridgeManager.get().allInstalled();
    var themes = extensions.filter((candidate) => {return candidate.content_type == "SN|Theme" || candidate.content.area == "themes"});
    var editors = extensions.filter((candidate) => {return candidate.content.area == "editor-editor"});
    var components = extensions.filter((candidate) => {return candidate.content_type == "SN|Component" && candidate.content.area != "editor-editor"});
    var serverExtensions = extensions.filter((candidate) => {return candidate.content_type == "SF|Extension"});
    var actions = extensions.filter((candidate) => {return candidate.content_type == "Extension"});
    var other = extensions.subtract(themes).subtract(editors).subtract(components).subtract(serverExtensions).subtract(actions);

    return (
      <div className="panel-section no-border">

        <div className="panel-row">
          <h3 className="title">Installed Extensions ({extensions.length})</h3>
        </div>

        {themes.length > 0 &&
          this.category("Themes", themes)
        }

        {components.length > 0 &&
          this.category("Components", components)
        }

        {editors.length > 0 &&
          this.category("Editors", editors)
        }

        {actions.length > 0 &&
          this.category("Actions", actions)
        }

        {serverExtensions.length > 0 &&
          this.category("Server Extensions", serverExtensions)
        }

        {other.length > 0 &&
          this.category("Other", other)
        }


      </div>
    )
  }
}

Array.prototype.subtract = function(a) {
  return this.filter(function(i) {return a.indexOf(i) < 0;});
};
