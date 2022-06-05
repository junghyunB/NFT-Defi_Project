import './App.css';
import { useEffect, useState } from "react";
import { Routes, Route } from 'react-router-dom';
import { MainPage, PreMintingPage, AdminPage, MyPage, AllMintPage } from './pages';
import { Navbar, Footer } from './components'

function App() {

  // const [account, setAccount] = useState();

  // const getAccount = async() => {
  //   try {
  //     const accounts = await window.klaytn.enable();
  //     console.log(accounts)
  //     setAccount(accounts[0]);
  //   } catch(error) {
  //     console.error(error);
  //   }   
  // }


  // useEffect(() => {
  //   if(window.klaytn) {
  //     getAccount();
  //   }
  // }, []);


  return (
    <>
    <div>
      <Navbar/>
      <Routes>
        <Route path='/' element={<MainPage/>} />
        <Route path='/mypage' element={<MyPage/>} />
        <Route path='/pre-minting' element={<PreMintingPage/>} />
        <Route path='/admin' element={<AdminPage/>} />
        <Route path='/all-minting' element={<AllMintPage/>} />
      </Routes>
      <Footer/>
    </div>
    </>
  );
}

export default App;
