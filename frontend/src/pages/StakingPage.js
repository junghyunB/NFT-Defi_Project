import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Slider from "react-slick";
import './StakingPage.css'
import { stakingViewAction } from '../redux/actions/stakingViewAction'
import { stakingAction } from '../redux/actions/stakingAction'
import { stakingCancelAction } from '../redux/actions/stakingCancelAction'
import { GrRefresh, GrGamepad } from "react-icons/gr";
import { ClaimModal, StakingModal, UnStakingModal } from '../components';
import { TbArrowBigLeftLines, TbArrowBigRightLines } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';


const StakingPage = () => {

  const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 1,
      currentSlide : '',
      slideCount : '',
      nextArrow: <TbArrowBigRightLines color='black' size={30} />,
      prevArrow: <TbArrowBigLeftLines color='black' size={30} />,
    // afterChange: function(index) {
    //   console.log(
    //     `Slider Changed to: ${index + 1}, background: #222; color: #bada55`
    //   );
    // }
  };
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {account} = useSelector(state => state.account)
    const {myNftList, stakingNftString, stakingReward , getStakingReward, successStaking, successUnStaking} = useSelector(state => state.stakingView)
    const [claimModal, setClaimModal] = useState(false)

    const staking = (edition) => {
      dispatch(stakingAction.stakingAct(account, edition))
    }

    const goToCardGame = () => {
      navigate('/cardgame')
    }

    const cancelStaking = (edition) => {
      dispatch(stakingCancelAction.stakingCancelAct(account, edition))
    }

    const changeState = () =>{
      dispatch(stakingViewAction.stakingViewAct(account))
    }

    let unStakeArr = []
    let comStakeArr = []

    const unStake = (id) => {

      if(unStakeArr.includes(id)){
        for(let i = 0; i < unStakeArr.length; i++) {
          if(unStakeArr[i] === id)  {
            unStakeArr.splice(i, 1);
          }
        }
      } else {
        unStakeArr.push(id)
      }
      console.log("Non스테이팅 배열확인", unStakeArr)
    }

    const comStake = (id) => {
      if(comStakeArr.includes(id)){
        for(let i = 0; i < comStakeArr.length; i++) {
          if(comStakeArr[i] === id)  {
            comStakeArr.splice(i, 1);
          }
        }
      } else {
        comStakeArr.push(id)
      }
      console.log("스테이킹 배열확인", comStakeArr)
    }

    const checkingNft = (e) => {
      if(e.checked){
        e.checked = false
      } else {
        e.checked = true;
      }
    } 

    console.log(account)
    useEffect( () => {
        dispatch(stakingViewAction.stakingViewAct(account))
    },[account])

  return (
    <>
    { claimModal ? <ClaimModal account={account}/> : null }
    { successStaking ? <StakingModal/> : null }
    { successUnStaking ? <UnStakingModal/> : null }

    <div className='stakingTitleContainer'>
              <h2>Staking</h2>
    </div>
    <div className="style-five"></div>
    <hr className="style-five"/> 
    <div className='stakingPageContainer'>
      <div className='stakingPageTopSection'>
        <div className='stakingRebateTitle'>
          <span>ZLT Rebate for Trading free</span>
        </div>
        <div className='stakingRewardTxt'>
          <span>
            Stake NFT to earn up to 100% ZLT rebate of your trade and reveive AirDrop the rewards at the end of NFT Lottery Game
          </span>
          
        </div>
        <div className='joinGameContainer'>
          <span className='joinGameTxt'>
            Join NFT Lottery Game
          </span>
          <GrGamepad className="gameIcon" onClick={goToCardGame}/>
          <button  className='refreshBtn' onClick={changeState} ><GrRefresh /></button>
        </div>
        <div className='zolTokenAmountContainer'>
          <div className='miningZolTokenSection'>
            <div className='miningZolTokenTitle'> <span>Zolaman Token currently being mined</span> </div>
            <div className='miningZolTokenAmount'> <span>{stakingReward} ZLT</span> </div>
          </div>
          <div className='myZolTokenSection'>
            <div className='myZolTokenTitle'> <span>Total Zolaman Tokens Received</span> </div>
            <div className='myZolTokenAmount'> <span>{getStakingReward} ZLT</span> </div>
          </div>
          <div>
            <button onClick={()=>setClaimModal(true)} className='claimBtn'>Claim</button>
          </div>
        </div>
      </div>
      <div className='stakingPageMainSection'>
        <h1>My NFTs</h1>
        <div className='stakingPageTitle'>
          <span className='stakingPageSpan1'>
            Total : {myNftList.length + stakingNftString.length}
          </span>
          <span className='stakingPageSpan1'>
            Not Staking : {myNftList.length}
          </span>
          <span className='stakingPageSpan2'> 
            Staking : {stakingNftString.length}
          </span>
        </div>
          {/* Stake Section */}
          <div className='unStakingContainer'>
            <div className='unStakingBoxContainer'>
              <div className='unStakingBoxSection'>
                <div>
                  <h2>
                    UnStake NFT 
                  </h2>
                  <span className='unStakeTxt'>
                    Do note that only NFTs that have been staked for afull 24 hours can enjoy the current day's ZLT rebate
                  </span>
                </div>
                <div className='unStakingCardMainContainer'>
                {
                  myNftList !== '' ?
                <Slider className='firstSlider' {...settings} >
                {
                  myNftList.map((item, index)=> {
                  return<div className='unStakingCardContainer'  key={index}>
                    
                      <div className='unStakingImgCard'
                        style={{
                          backgroundImage: 
                              "url(" + 
                              `https://gateway.pinata.cloud/ipfs/QmfDCXHotQP7tH252h5BPEPX6kLmPJSzKzddnVxQUhrw4m/${item}.png` + 
                              ")"
                        }}>
                        <input type='checkbox' className='unStakingCheckBox' />
                        <label className='unStakingCheckBoxCircle' onClick={(e)=>{unStake(item); checkingNft(e.target.parentNode.children[0]);}}></label>
                      </div>
                    </div>
                  })
                }
                  </Slider>
                    : null
                }   
                </div>
                <div className='unStakingBtn'>
                  <button onClick={()=>staking(unStakeArr)} className="learn-more">Staking</button>
                  {/* 모달창으로 넘기는거 시도 */}
                  {/* <button onClick={()=>setStakingModal(true)} className="learn-more">Staking</button> */}
                </div>
              </div>
            </div>
          </div>
          {/* UnStake section */}
          <div className='comStakingContainer'>
            <div className='comStakingBoxContainer'>
              <div className='comStakingBoxSection'>
                <div>
                  <h2>
                    Staking NFT 
                  </h2>
                </div>
                <div className='comStakingCardMainContainer'>
                {
                  stakingNftString !== '' ? 
                <Slider className='firstSlider' {...settings} >
                {
                  stakingNftString.map((item, index)=> {
                  return<div className='comStakingCardContainer'  key={index}>

                      <div className='comStakingImgCard'
                        style={{
                          backgroundImage: 
                              "url(" + 
                              `https://gateway.pinata.cloud/ipfs/QmfDCXHotQP7tH252h5BPEPX6kLmPJSzKzddnVxQUhrw4m/${item}.png` + 
                              ")"
                        }}>
                        <input type='checkbox' className='unStakingCheckBox' />
                        <label className='unStakingCheckBoxCircle' onClick={(e)=>{comStake(item); checkingNft(e.target.parentNode.children[0]);}}></label>
                      </div>
                    </div>
                  })
                }
                  </Slider>
                    : null
                }   
                </div>
                <div className='comStakingBtn'>
                  {/* <button className="learn-more">Staking</button> */}
                  <button onClick={()=>cancelStaking(comStakeArr)} className="learn-more">UnStake</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </div>
    </>
  )
}

export default StakingPage