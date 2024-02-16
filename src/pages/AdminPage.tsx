import { Button, InputNumber, Row, Col, Typography, Tabs, Modal } from 'antd'
import React, { useState, useEffect, useContext } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { useSwitchChain } from '../hooks/useSwitchChain'
import { DefaultPageTemplate } from './template/DefaultPageTemplate'
import { Wallets } from '../components/admin/Wallets'
import { Others } from '../components/admin/Others'
import { AppContext } from '../contexts';
import { notifyError, notifySuccess } from '../services/NotificationService'
import { fonts } from '../styles/variables'
import { useGetBuyPrice, useGetSellPrice, useGetFeeProfit, useGetNetProfit, useSetBuyPrice, useSetSellPrice, useWithdrawFeeProfit, useWithdrawNetProfit } from '../hooks/useTransactions'

const { Title } = Typography
const { TabPane } = Tabs

export default function AdminPage() {
  const {chainId} = useWeb3React()
  const switchChain = useSwitchChain();
  const { user } = useContext(AppContext)
  const navigate = useNavigate()
  const getBuyPrice = useGetBuyPrice();
  const getSellPrice = useGetSellPrice();
  const getNetBalance = useGetNetProfit();
  const getFeeBalance = useGetFeeProfit();
  const setConSellPrice = useSetSellPrice();
  const setConBuyPrice = useSetBuyPrice();
  const withdrawFee = useWithdrawFeeProfit();
  const withdrawNet = useWithdrawNetProfit();

  const [sellPrice, setSellPrice] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [netBalance, setNetBalance] = useState(0)
  const [feeBalance, setFeeBalance] = useState(0)

  useEffect(() => {
    if(chainId !== 56 && chainId !== 97)
      switchChain(97);

    const getInitValues = async() => {
      let w_buyPrice = await getBuyPrice();
      let w_sellPrice = await getSellPrice();
      let w_netBalance = await getNetBalance();
      let w_feeBalance = await getFeeBalance();
      setBuyPrice(w_buyPrice);
      setSellPrice(w_sellPrice);
      setNetBalance(w_netBalance);
      setFeeBalance(w_feeBalance);
    }

    if (!user.role) {
      notifyError('You do not have permission!')
      navigate("/")
    } else if(user.role === 1 || user.role === 3){
      getInitValues();
    }
  }, [user.account])

  const handleSetBuyPrice = async () => {
    let w_res = await setConBuyPrice(buyPrice);
    if(w_res === 1) {
      notifySuccess('set buy price successfully')
    } else {
      notifyError('set buy price failed')
    }
  }

  const handleSetSellPrice = async () => {
    let w_res = await setConSellPrice(sellPrice);
    if(w_res === 1) {
      notifySuccess('set sell price successfully')
    } else {
      notifyError('set sell price failed')
    }
  }

  const handleWithdraw = async (type:string) => {
    if(type === 'net') {
      let w_res = await withdrawNet();
      if(w_res === 1) {
        notifySuccess("withdraw successfully");
        let w_netBalance = await getNetBalance();
        let w_feeBalance = await getFeeBalance();
        setNetBalance(w_netBalance);
        setFeeBalance(w_feeBalance);
      } else {
        notifyError("you don't have balance or permission");
      }
    } else if(type === 'fee') {
      let w_res = await withdrawFee();
      if(w_res === 1) {
        notifySuccess("withdraw successfully");
        let w_netBalance = await getNetBalance();
        let w_feeBalance = await getFeeBalance();
        setNetBalance(w_netBalance);
        setFeeBalance(w_feeBalance);
      } else {
        notifyError("you don't have balance or permission");
      }
    }
  }

  const handleBuyPrice = (value:number | null) => {
    if(value !== null && value > 0)
      setBuyPrice(value);
  }

  const handleSellPrice = (value:number | null) => {
    if(value !== null && value > 0)
      setSellPrice(value);
  }
  return (
    <>    
    <DefaultPageTemplate fullWidth marginMax> 
      <Row>
        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 24, offset: 0 }} md={{ span: 20, offset: 2 }} lg={{ span: 18, offset: 3 }}>
          <Row>
            <S.Title className="white sub-title">Balance</S.Title>
          </Row>
          <Row align={'middle'} >
            <Col xs={24} md={12} style={{padding: '10px 0px 10px 30px'}}>
            <Row justify={'space-between'} align={'middle'}>
              <div>
              <S.Title style={{display: 'inline', marginRight: '20px'}} className="blueberry-lighter orderDesc">Net Profit</S.Title>
              <S.Title style={{display: 'inline'}} className="white orderDesc">{netBalance} USDT</S.Title>
              </div>
              <S.Button style={{marginLeft: '15px'}} onClick={() => {handleWithdraw('net')}}>Withdraw</S.Button>
            </Row>
            </Col>
            <Col xs={24} md={12} style={{padding: '10px 0px 10px 30px'}}>
            <Row justify={'space-between'} align={'middle'}>
              <div>
              <S.Title style={{display: 'inline', marginRight: '20px'}} className="blueberry-lighter orderDesc">Fee Profit</S.Title>
              <S.Title style={{display: 'inline'}} className="white orderDesc">{feeBalance} USDT</S.Title>
              </div>
              <S.Button style={{marginLeft: '15px'}} onClick={() => {handleWithdraw('fee')}}>Withdraw</S.Button>
            </Row>
            </Col>
          </Row>
          <Row>
            <S.Title className="white sub-title">Set Buy Price</S.Title>
          </Row>
          <S.Row justify={'space-between'} align={'middle'} >
            <InputNumber name="buyprice" value={buyPrice} onChange={handleBuyPrice} />
            <S.Button style={{width: '80px'}} onClick={handleSetBuyPrice}>Set</S.Button>
          </S.Row>
          <Row>
          <S.Title className="white sub-title">Set Sell Price</S.Title>
          </Row>
          <S.Row justify={'space-between'} align={'middle'} >
            <InputNumber name="sellprice" value={sellPrice} onChange={handleSellPrice} />
            <S.Button style={{width: '80px'}} onClick={handleSetSellPrice}>Set</S.Button>
          </S.Row>
          {user.role === 2 && <Row style={{marginTop: '40px'}}>
            <S.Tabs defaultActiveKey="1">
              <TabPane tab="Wallets" key="1">
                <Wallets />
              </TabPane>
              <TabPane tab="Others" key="2">
                <Others />
              </TabPane>
            </S.Tabs>
          </Row>}
        </Col>
      </Row>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  Title: styled(Title) `
    font-family: 'Changa';
    &.sub-title {
      margin: 30px 0px 10px !important;
      font-weight: 300 !important;
      font-size: 1.5rem !important;
    }
    &.white {
      color: ${props=>props.theme.white};
    } 
    &.blueberry-lighter {
      color: ${props=>props.theme.blueberry.lighter};
    }   
    &.orderDesc {
      font-weight: 200 !important;
      font-size: 1rem !important;
      margin-top: 10px !important;
    }
  `,
  Row: styled(Row)`
    .ant-input-number {
      background-color: transparent !important;
      background-clip: padding-box;
      color: white !important;
      border: 1px solid ${(props)=>props.theme.blueberry.lighter};
      border-radius: 0.25rem;
      width: 100%;

      line-height: 1.5;
      display: inline-block;
      @media (min-width: 230px) {
        margin-bottom: 10px;
      }
      @media (min-width: 530px) {
        width: 250px;
        margin-bottom: 0px;
      }
    }
    .ant-input-number-input {
      color: white !important;
    }
    .ant-input-number-handler {
      color: white !important;
      border-inline-start: 0px solid !important;
    }
    .ant-input-number-handler-wrap {
      background-color: transparent;
      border: 0px solid !important;
    }
    .ant-input-number-handler-down {
      border-block-start: 0px solid;
      border-end-end-radius: 0px;
    }
  `,
  Button: styled(Button)`
    background: ${props=>props.theme.blue.main};
    color: ${props=>props.theme.white};
    font-weight: 200;
    font-family: 'Changa';
    border: 0px solid;
    cursor: pointer !important;
    &:hover,
    &:active,
    &:focus {
      background-color: ${props=>props.theme.yellow.darker};
      color: ${props=>props.theme.white} !important;
    }
  `,
  Tabs: styled(Tabs)`
    width: 100% !important;
    .ant-tabs-tab {
      
      color: white; // Color for tab titles
      font-family: 'Changa';
      font-size: 18px;
      &.ant-tabs-tab-active .ant-tabs-tab-btn {
        color: white !important;
      }
    }
    .ant-tabs-ink-bar {
      background-color: ${(props)=>props.theme.blueberry.lighter};
    }
  `,
  Modal: styled(Modal)`
    .ant-modal-body {
      padding: 0;
    }
    .ant-modal-footer {
      display: flex;
      justify-content: center;

      .ant-btn-default {
        background-color: ${props=>props.theme.yellow.darker}; 
        border: 0px solid; 
      }
    }
    .ant-modal-content {
      background: ${props => props.theme.blueberry.light};
      border-radius: 16px;
      max-width: 300px;
      margin: auto;
      h1 {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 24px;
        text-align: center;
        color: ${props=>props.theme.white};
      }
      h2 {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 300;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        color: ${props=>props.theme.white};
      }
      span {
        font-family: ${fonts.nunito};
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 22px;
        color: ${props=>props.theme.white};
      }
      .ant-modal-close {
        display: none;
      }
    }
    .ant-modal-header {
      background: ${props => props.theme.blueberry.light};
      border-top-left-radius: 16px;
      border-top-right-radius: 16px;
      border-bottom: none;
    }
  `
}
