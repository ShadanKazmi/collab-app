// import { Route, Routes, useLocation } from 'react-router-dom';
// import './App.css';
// import Home from './Pages/Home';
// import NavBar from './Components/NavBar';
// import TeamPage from './Pages/TeamPage';
// import AuthPage from './Pages/AuthPage';
// import UserProfile from './Pages/UserProfile';
// import UserDetails from './Pages/UserDetails';
// import TeamFiles from './Components/TeamFiles';
// import TeamTasks from './Components/TeamTasks';
// import AllTasks from './Pages/AllTasks';
// import Chat from './Pages/Chat';
// import AllChats from './Pages/AllChats';

// function App() {
//   const location = useLocation();
//   const isAuthPage = location.pathname === '/auth';
//   return (
//     <div>
//       {!isAuthPage && <NavBar />}
//       <div className={`flex-1 p-10 ${!isAuthPage ? 'ml-56' : ''}`}>
//         <Routes>
//           <Route path='/' element={<Home/>} />
//           <Route path='/teamDetails/:teamId' element={<TeamPage />} />
//           <Route path='/auth' element={<AuthPage />} />
//           <Route path='/profile' element = {<UserProfile/>}/>
//           <Route path='/userProfile' element = {<UserDetails/>}/>
//           <Route path='/teamDetails/:teamId/files' element = {<TeamFiles/>}/>
//           <Route path='/teamDetails/:teamId/tasks' element = {<TeamTasks/>}/>
//           <Route path='/tasks' element = {<AllTasks/>}/>
//           <Route path='/chat' element = {<AllChats/>}/>
//           <Route path='/chat/:userId' element = {<Chat/>}/>
//         </Routes>
//       </div>
//     </div>
//   );
// }

// export default App;


import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import { useContext } from 'react';
import Home from './Pages/Home';
import NavBar from './Components/NavBar';
import TeamPage from './Pages/TeamPage';
import AuthPage from './Pages/AuthPage';
import UserProfile from './Pages/UserProfile';
import UserDetails from './Pages/UserDetails';
import TeamFiles from './Components/TeamFiles';
import TeamTasks from './Components/TeamTasks';
import AllTasks from './Pages/AllTasks';
import Chat from './Pages/Chat';
import { authContext } from './api/AuthContext';
import { Loader } from 'semantic-ui-react';
import AllChats from './Pages/AllChats';

function App() {
  const location = useLocation();
  const { userState, loading } = useContext(authContext);
  const isAuthPage = location.pathname === '/auth';

  if (loading) {
    return <Loader active inline='centered' size='large'>Loading...</Loader>;
  }

  if (userState === 'Logged-Out' && !isAuthPage) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div>
      {userState === 'Logged-In' && !isAuthPage && <NavBar />}
      <div className={`flex-1 p-10 ${userState === 'Logged-In' && !isAuthPage ? 'ml-56' : ''}`}>
        <Routes>
          <Route path='/auth' element={<AuthPage />} />
          <Route path='/' element={<Home />} />
          <Route path='/teamDetails/:teamId' element={<TeamPage />} />
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/userProfile' element={<UserDetails />} />
          <Route path='/teamDetails/:teamId/files' element={<TeamFiles />} />
          <Route path='/teamDetails/:teamId/tasks' element={<TeamTasks />} />
          <Route path='/tasks' element={<AllTasks />} />
          <Route path='/chat' element={<AllChats />} />
          <Route path='/chat/:userId' element={<Chat />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
