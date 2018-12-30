import CamoApp from '../../camo/CamoApp';
import CamoResourcePanelComponent from '../../camo/components/CamoResourcePanelComponent';
import CamoHeroOverviewComponent from '../../camo/components/CamoHeroOverviewComponent';

const app = new CamoApp();

app.addComponent(new CamoResourcePanelComponent());
app.addComponent(new CamoHeroOverviewComponent());

export { app };
