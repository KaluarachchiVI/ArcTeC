import "./App.css";
import { Route, BrowserRouter } from "react-router-dom"; // Import BrowserRouter
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/ChatPage";
import Dashboard from "./components/Dashboard";
import ArchitectDashboard from "./components/ArchitectDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Header from "./components/miscellaneous/Headermodel";

//sandith
import InsertFeedback from './components/InsertFeedback'
import FeedbackList from './components/FeedbackList'

//senudi
import ProjectList from './components/View1/ProjectList'
import ProjectAndTasks from './components/View2/ProjectAndTasks'; 

//chalaka
//import LandingPage from "./components/DocPage";
//import AddDocument from './Pages/AddDocument';
//import DocumentList from './Pages/DocumentList';
//import Edit from './Pages/Edit';
//import DocumentEdita from "./Pages/adminEdit";

function App() {
  return (
    <div className="App">
      <BrowserRouter> 
        <Header />
        <div className="container">
          <Route path="/" component={Homepage} exact />
          <Route path="/chats" component={Chatpage} />
          <Route path="/feedback" component={InsertFeedback} />
          <Route path="/feedbackinsert" component={FeedbackList} />
          <Route path="/taskflow" component={ProjectList} />
          <Route path="/task/:projectId" component={ProjectAndTasks} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/architect-dashboard" component={ArchitectDashboard} />
          <Route path="/admin-dashboard" component={AdminDashboard} />
          {/*<Route path="/AddDocument" element={<AddDocument />} />
          <Route path="/DocumentList" element={<DocumentList />} />
          <Route path="/edit/:id" element={<Edit />} />
  <Route path="/adminEdit/:id" element={<DocumentEdita />} */}
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
