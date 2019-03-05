import MapComponent from './mapComponent';
import ClusterMarker from './mapComponent/component/ClusterMarker';
import CommunityPolygon from './mapComponent/component/CommunityPolygon';
import InfoWindow from './mapComponent/component/InfoWindow';
import MakerPoints from './mapComponent/component/MakerPoints';
import MapResetTools from './mapComponent/component/MapResetTools';
import MapSearch from './mapComponent/component/MapSearch';
import MarkerContent from './mapComponent/component/MarkerContent';
import MouseTool from './mapComponent/component/MouseTool';
import ResourceLayer from './mapComponent/component/ResourceLayer';
import RoadNetwork from './mapComponent/component/RoadNetwork';
import ViilageCluster from './mapComponent/component/ViilageCluster';
import Trajectory from './mapComponent/component/Trajectory'
import * as mapContext from './mapComponent/mapContext';
import { providerMap } from './providerMap';

const LMap = {
  MapComponent,
  ClusterMarker,
  CommunityPolygon,
  InfoWindow,
  MakerPoints,
  MapResetTools,
  MapSearch,
  MarkerContent,
  MouseTool,
  ResourceLayer,
  RoadNetwork,
  ViilageCluster,
  mapContext,
  providerMap,
  Trajectory
}
export default LMap;
