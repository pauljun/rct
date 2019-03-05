import React from 'react';
const MonitorNavigation = Loader.loadBusinessComponent('MonitorNavigation')

class ModuleView extends React.Component {
  render() {
    return <MonitorNavigation
      libType={4}
      currentMenu='privateNetLibraryView'
    >
        专网套件布控库管理
    </MonitorNavigation>
  }
}

export default ModuleView