import { BrowserRouter } from "react-router-dom";
import AppLayout from "./app/layouts/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}