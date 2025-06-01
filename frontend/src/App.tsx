import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  HomePage,
  ChatPage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  EditSubProfilePage,
  CreateCompanyProfilePage,
  CreateCandidateProfilePage,
} from "@/pages";
import { RequireAuth } from "@/components";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/create-candidate"
          element={
            <RequireAuth>
              <CreateCandidateProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/create-company"
          element={
            <RequireAuth>
              <CreateCompanyProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/chat/:subProfileId"
          element={
            <RequireAuth>
              <ChatPage />
            </RequireAuth>
          }
        />
        <Route
          path="/edit-sub-profile/:subProfileId"
          element={
            <RequireAuth>
              <EditSubProfilePage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
