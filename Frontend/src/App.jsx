import React from 'react'
import Login from './componets/loginPage'
import { Route, Routes } from 'react-router-dom'
import Signup from './componets/signUp'
import Dashboard from './componets/dashboard'
import Balances from './componets/balance'
import AddExpense from './componets/addExpenses'
import CreateGroup from './componets/createGroup'
import GroupDetails from './componets/groupDetails'
import ProtectedRoute from './componets/ProtectedRoute'
import { useAuth } from './Context/AuthContext'
import EditExpenses from './componets/EditExpenses'
import ExpenseCard from"./componets/ExpenseCard"

 

const App = () => {
   
   const {user} = useAuth()
  const currentUserID = user?._id  

  return (
    
    <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/signUp' element={<Signup/>} />
      <Route path='/dashboard' element={ <ProtectedRoute> <Dashboard/> </ProtectedRoute>} />
      
      <Route path='/create-group' element={<ProtectedRoute>  <CreateGroup currentUserId={currentUserID}   /> </ProtectedRoute>} />
      <Route path='/groups/:groupId' element={<ProtectedRoute> <GroupDetails/> </ProtectedRoute>} />
      <Route path='/groups/:groupId/add' element={<ProtectedRoute> <AddExpense/></ProtectedRoute>} />
      <Route path='/groups/:groupId' element={<ProtectedRoute> <GroupDetails/> </ProtectedRoute>} />
      <Route path='/expenses/:expenseId/edit' element={<ProtectedRoute> <EditExpenses/> </ProtectedRoute>} />
      <Route path='/expenses/:expenseId' element={<ProtectedRoute> <ExpenseCard/></ProtectedRoute>} />
      <Route path='/groups/:groupId/balances' element={<ProtectedRoute><Balances/></ProtectedRoute>} />
      
      
    </Routes>
  )
}

export default App