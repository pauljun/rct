declare namespace LMap {
  declare var MapComponent: ReactElement;
  declare var ClusterMarker: ReactElement;
  declare var CommunityPolygon: ReactElement;
  declare var InfoWindow: ReactElement;
  declare var MakerPoints: ReactElement;
  declare var MapResetTools: ReactElement;
  declare var MapSearch: ReactElement;
  declare var MarkerContent: ReactElement;
  declare var MouseTool: ReactElement;
  declare var PathSimplifier: ReactElement;
  declare var ResourceLayer: ReactElement;
  declare var RoadNetwork: ReactElement;
  declare var ViilageCluster: ReactElement;
  declare var mapContext: {
    Provider: ReactElement;
    Consumer: ReactElement;
    map: (Component: ReactElement) => ReactElement;
  };
  function providerMap(Component: ReactElement): ReactElement;
}
