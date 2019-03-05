import React from 'react';
import Map from './mapComponent';
export function providerMap(args) {
  let className = '';
  let style = {};
  let mapConfig = {}
  if (typeof args === 'string') {
    className = args;
  }
  if (typeof args === 'object') {
    className = args.className;
    style = args.style;
    mapConfig = args.mapConfig
  }
  return function(WrapComponent) {
    class WrapProviderComponent extends React.Component {
      render() {
        const { forwardRef, ...props } = this.props;
        return (
          <Map className={className} style={style} mapConfig={mapConfig}>
            <WrapComponent {...props} ref={forwardRef} />
          </Map>
        );
      }
    }
    return React.forwardRef((props, ref) => {
      return <WrapProviderComponent {...props} forwardRef={ref} />;
    });
  };
}
