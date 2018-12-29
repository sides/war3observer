import './CamoResourcePanelComponent.scss';

import * as m from 'mithril';
import { getPlayerColor } from '../../common/utils/color';
import ResourcePanelComponent from '../../common/components/ResourcePanelComponent';

export default class CamoResourcePanelComponent extends ResourcePanelComponent {
  icons() {
    return {
      human: require('../assets/ui/human.png'),
      orc: require('../assets/ui/orc.png'),
      nightelf: require('../assets/ui/nightelf.png'),
      undead: require('../assets/ui/undead.png'),
      gold: require('../assets/ui/gold.png'),
      lumber: require('../assets/ui/lumber.png'),
      supply: require('../assets/ui/supply.png')
    };
  }
}
