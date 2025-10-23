import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../DashboardLayout";

import NewCampaign from "../pages/NewCampaign";
import Campaign from "../pages/Campaign";
import CampaignInformation from "../pages/CampaignInformation";
import OverView from "../pages/OverView";

export default function AppRoutes() {
  return (
    <Routes>
    
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Campaign />} /> 
        <Route path="/dashboard/newcampaign" element={<NewCampaign />} />
        <Route path="/dashboard/campaign" element={<Campaign />} />
        <Route path="/dashboard/overview" element={<OverView />} />
        <Route
          path="/dashboard/campaigninformation/:id"
          element={<CampaignInformation />}
        />
      </Route>
    </Routes>
  );
}
