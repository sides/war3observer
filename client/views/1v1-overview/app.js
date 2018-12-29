import CamoApp from '../../camo/CamoApp';
import CamoResourcePanelComponent from '../../camo/components/CamoResourcePanelComponent';

const app = new CamoApp();

app.addComponent(new CamoResourcePanelComponent());

export { app };
