import { Routes, Route } from "react-router-dom";

import Dashboard from "../modules/dashboard/dashboard";
import ThankYou from "../modules/dashboard/thank-you/thank-you";
import Otp from "../shared/components/otp-modal/otp";
import PendingApplication from "../modules/dashboard/pending-resume-application/pending-resume-application";

const Main = () => {
  return (
    <>
      <Routes>
        <Route path="super-short-form" element={<Dashboard />}></Route>
        <Route path="sg/thankyou" element={<ThankYou />}></Route>
        <Route path="otp" element={<Otp />}></Route>
        <Route path="pending-application" element={<PendingApplication />}></Route>
        <Route path="/*" element={<Dashboard />}></Route>
      </Routes>
    </>
  );
};

export default Main;

