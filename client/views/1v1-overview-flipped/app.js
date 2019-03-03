import CamoApp from '../../camo/CamoApp';
import CamoResourcePanelComponent from '../../camo/components/CamoResourcePanelComponent';
import CamoHeroOverviewComponent from '../../camo/components/CamoHeroOverviewComponent';

const app = new CamoApp({ settings: { reversePlayerOrder: true }});

app.addComponent(new CamoResourcePanelComponent());
app.addComponent(new CamoHeroOverviewComponent());

export { app };
