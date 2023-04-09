import "./App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, useLocation } from "react-router-dom";
import WorkflowList from "./pages/WorkflowList";
import WorkflowDesigner from "./pages/WorkflowDesigner";
import { QueryClient, QueryClientProvider } from "react-query";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route exact path="/" element={<WorkflowList />}></Route>
          <Route
            exact
            path="/workflow-designer/:id"
            element={<WorkflowDesigner />}
          ></Route>
        </Routes>
      </QueryClientProvider>
    </>
  );
}

export default App;
