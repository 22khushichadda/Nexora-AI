import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import BookmarksPage from "./pages/BookmarksPage";
import HistoryPage from "./pages/HistoryPage";
import PdfViewer from "./pages/PdfViewer";
import TeamPage from "./pages/TeamPage";
import InvitePage from "./pages/InvitePage";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Navigate to="/dashboard" />} />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/documents"
        element={<Documents />}
      />

      <Route
        path="/bookmarks"
        element={<BookmarksPage />}
      />

      <Route
        path="/history"
        element={<HistoryPage />}
      />

      <Route
        path="/viewer/:id"
        element={<PdfViewer />}
      />

      <Route
    path="/team"
    element={<TeamPage />}
/>

<Route
    path="/invite/:token"
    element={<InvitePage />}
/>

    </Routes>
  );
}

export default App;