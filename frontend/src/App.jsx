import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import BookmarksPage from "./pages/BookmarksPage";
import HistoryPage from "./pages/HistoryPage";

function App() {

    return (

        <Routes>

            <Route
                path="/"
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

        </Routes>

    );

}

export default App;