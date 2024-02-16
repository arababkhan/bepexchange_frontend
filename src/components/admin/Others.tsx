import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Row, Typography, Tag, Col, InputNumber, Input, Modal } from 'antd'
import { useSend, useSetEnableSell, useSetBuyFee, useSetSellFee, useGetBuyFee, useGetSellFee, useGetSellState, useDeposit } from '../../hooks/useTransactions'
import { notifyError, notifySuccess } from '../../services/NotificationService'
import { fonts } from '../../styles/variables'
import { useWeb3React } from '@web3-react/core'

const { Title } = Typography

export const Others: React.FC = () => {
  const {account} = useWeb3React();
  const send = useSend();
  const setEnableSell = useSetEnableSell();
  const setBuyFee = useSetBuyFee();
  const setSellFee = useSetSellFee();
  const getBuyFee = useGetBuyFee();
  const getSellFee = useGetSellFee();
  const getSellState = useGetSellState();
  const deposit = useDeposit();

  const [buyFee, setBuyFeeState] = useState(0);
  const [sellFee, setSellFeeState] = useState(0);
  const [amount, setAmount] = useState(0);
  const [receiver, setReceiver] = useState('');
  const [sellState, setSellState] = useState(false);
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState(0);

  const handleBuyFee = (value: number | null) => {
    if (value !== null && value > 0 && (Math.floor(value*10)===value*10)) {
      setBuyFeeState(value);
    } else {
      notifyError("Input value which is positive and one decimal")
    }
  };
  const handleSellFee = (value: number | null) => {
    if (value !== null && value > 0 && (Math.floor(value*10)===value*10)) {
      setSellFeeState(value);
    } else {
      notifyError("Input value which is positive and one decimal")
    }
  };
  const handleAmount = (value: number | null) => {
    if (value !== null && value > 0) {
      setAmount(value);
    }
  };
  const handleSetBuyFee = async() => {
    let w_res = await setBuyFee(buyFee);
    if(w_res !== 1) {
      notifyError("You don't have permission");
    }
  };
  const handleSetSellFee = async() => {
    let w_res = await setSellFee(sellFee);
    if(w_res !== 1) {
      notifyError("You don't have permission");
    }
  };

  const handleSellState = async () => {
    let w_res = await setEnableSell(!sellState);
    if(w_res === 1) {
      setSellState(!sellState);
    } else {
      notifyError("You don't have permission");
    }
  };

  const handleSend = () => {
    setIsShowConfirm(true);
  }

  const handleCancel = () => {
    setIsShowConfirm(false);
  }

  const handleUsdtAmount = (value: number | null) => {
    if (value !== null && value > 0) {
      setUsdtAmount(value);
    }
  }

  const handleDeposit = async () => {
    if(account) {
      let w_res = await deposit(usdtAmount, account);
      if(w_res === -1) {
        notifyError("not enough usdt");
      } else if(w_res === 0) {
        notifyError("transaction error");
      } else if(w_res === 1) {
        notifySuccess("deposit success");
      }
    } else {
      notifyError("Invalid account");
    }
  }
  const confirmSend = async () => {
    setIsShowConfirm(false)
    let w_res = await send(amount, receiver);
    if(w_res !== 1) {
      notifyError("You don't have permission!");
    }
  }

  useEffect(() => {
    async function getInitialValues() {
      let w_sellFee = await getSellFee();
      let w_buyFee = await getBuyFee();
      let w_sellEnable = await getSellState();

      setSellFeeState(w_sellFee);
      setBuyFeeState(w_buyFee);
      setSellState(w_sellEnable);
    }
    
    getInitialValues()
   }, [])
  return (
    <Row>
      <S.Col xs={24} sm={12}>
          <S.Title className="white orderDesc">Buy Fee</S.Title>
          <Row justify={'space-between'} align={'middle'} >
            <InputNumber style={{width: '100px'}} value={buyFee} onChange={handleBuyFee}></InputNumber>
            <S.Button style={{width: '80px'}} onClick={()=>handleSetBuyFee()}>Set</S.Button>
          </Row>

          <S.Title className="white orderDesc">Sell Fee</S.Title>
          <Row justify={'space-between'} align={'middle'} >
            <InputNumber style={{width: '100px'}} value={sellFee} onChange={handleSellFee}></InputNumber>
            <S.Button style={{width: '80px'}} onClick={()=>handleSetSellFee()}>Set</S.Button>
          </Row>
      </S.Col>
      <S.Col xs={24} sm={12}>
        <S.Title className="white orderDesc">Send RESBONO</S.Title>
        <Row justify={'space-between'} align={'middle'} >
          <S.Input value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder='receiver address'></S.Input>
          <InputNumber style={{width: '100px'}} value={amount} onChange={handleAmount}></InputNumber>
          <S.Button style={{width: '80px'}} onClick={handleSend}>Send</S.Button>
        </Row>
        <Row justify={'space-between'} style={{marginTop: '20px'}}>
          <S.Title className="white prod">Enable/Disable Sell</S.Title>
          <S.Button style={{width: '80px'}} onClick={handleSellState} className={sellState?'blue':'gray'}>{sellState?'Enabled':'Disabled'}</S.Button>
        </Row>
        <S.Title className="white orderDesc">Deposit USDT</S.Title>
        <Row justify={'space-between'}>
          <InputNumber style={{width: '100px'}} value={usdtAmount} onChange={handleUsdtAmount}></InputNumber>
          <S.Button style={{width: '80px'}} onClick={handleDeposit}>Deposit</S.Button>
        </Row>
      </S.Col>
      <S.Modal onCancel={handleCancel} onOk={confirmSend} open={isShowConfirm}>
        <h1>Please confirm again</h1>
        <h2>{receiver}</h2>
        <h2>{amount}</h2>
      </S.Modal>
    </Row>
  )
}

const S = {
  Title: styled(Title) `
    font-family: 'Changa';
    &.sub-title {
      margin: 70px 0px 10px !important;
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
      margin-top: 30px !important;
    }
    &.prod {
      font-weight: 200 !important;
      font-size: 1rem !important;
      margin-top: 10px !important;
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
    &.blue {
      background: ${props=>props.theme.blue.main} !important;
    }
    &.gray {
      background: #666 !important;
    }
  `,
  Tag: styled(Tag)`
    color: white !important;
    font-size: 14px;
    &.ant-tag .ant-tag-close-icon {
      color: white !important;
    }
  `,
  Col: styled(Col)`
    padding: 0px 10px;
    .ant-input-number {
      background-color: transparent !important;
      color: white !important;
      border: 1px solid ${props=>props.theme.blueberry.lighter} !important;
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
    .anticon {
      color: white !important;
    }
  `,
  Input: styled(Input)`
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    line-height: 1.5;
    color: ${(props)=>props.theme.white};
    background: transparent;
    background-clip: padding-box;
    border: 1px solid ${(props)=>props.theme.blueberry.lighter};
    border-radius: 0.25rem;
    width: 100%;
    display: inline-block;
    font-family: 'Changa';
    margin-bottom: 10px;
    &::placeholder {
      color: white;
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
