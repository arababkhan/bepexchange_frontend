import { Row, Col, Typography, Image, InputNumber, Button } from 'antd'
import { LikeOutlined, SendOutlined } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { DefaultPageTemplate } from './template/DefaultPageTemplate'
import { useSwitchChain } from '../hooks/useSwitchChain'
import { useGetBuyPrice, useGetSellPrice, useGetBuyFee, useGetSellFee, useGetTokenBalance, useGetUsdtBalance, useGetSellState, useBuy, useSell } from '../hooks/useTransactions'
import { notifyError, notifySuccess } from '../services/NotificationService'

const { Title, Paragraph } = Typography

export default function MarketplacePage() {
  const {account, chainId} = useWeb3React();
  const switchChain = useSwitchChain();
  const getBuyPrice = useGetBuyPrice();
  const getSellPrice = useGetSellPrice();
  const getBuyFee = useGetBuyFee();
  const getSellFee = useGetSellFee();
  const getUsdtBalance = useGetUsdtBalance();
  const getTokenBalance = useGetTokenBalance();
  const getSellState = useGetSellState();
  const sellRes = useSell();
  const buyRes = useBuy();

  const [sell, setSell] = useState(false);
  const [sellPrice, setSellPrice] = useState(0);
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellFee, setSellFee] = useState(0);
  const [buyFee, setBuyFee] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [orderAmount, setOrderAmount] = useState(0);
  const [preAmount, setPreAmount] = useState(0);
  const [enableSell, setEnableSell] = useState(false);
  
  useEffect(() => {
    if(chainId !== 56)
      switchChain(56);

    const getInitValues = async() => {
      let w_buyPrice = await getBuyPrice();
      let w_sellPrice = await getSellPrice();
      let w_sellFee = await getSellFee();
      let w_buyFee = await getBuyFee();
      let w_usdtBalance = await getUsdtBalance(account ||'');
      let w_tokenBalance = await getTokenBalance(account || '');
      let w_sellEnable = await getSellState();

      setBuyPrice(w_buyPrice);
      setSellPrice(w_sellPrice);
      setSellFee(w_sellFee);
      setBuyFee(w_buyFee);
      setUsdtBalance(w_usdtBalance);
      setTokenBalance(w_tokenBalance);
      setEnableSell(w_sellEnable);
    }

    getInitValues();
  }, [account, chainId])

  const handleOrderType = () => {
    if(!enableSell) {
      notifyError('Currently sell function is disabled');
      return;
    }

    setSell(!sell);
  }

  const handleOrderAmount = (value: number | null) => {
    if(value !== null && value > 0) {
      setOrderAmount(value);
      let w_preAmount = 0;
      if(sell) {
        w_preAmount = value * sellPrice - value * sellPrice * sellFee / 100;
        setPreAmount(Math.floor(w_preAmount * 1000)/1000);
      } else {
        w_preAmount = (value - value * buyFee / 100) / buyPrice;
        setPreAmount(Math.floor(w_preAmount * 1000)/1000)
      }
    }
  }

  const handleOrder = async() => {
    if(sell) {
      if(!enableSell)
      {
        notifyError("sell function is currently disabled");
        return;
      }
      if(!account)
      {
        notifyError("account is undefined");
        return;
      }
      let w_res = await sellRes(orderAmount, account, preAmount);
      if(w_res === -1) {
        notifyError("You don't have enough token");
      } else if(w_res === -2) {
        notifyError("The Pool doesn't have enough USDT");
      } else if(w_res === 0) {
        notifyError("transaction error occured");
      } else if(w_res === 1) {
        notifySuccess("sold token successfully");
        let w_usdtBalance = await getUsdtBalance(account ||'');
        let w_tokenBalance = await getTokenBalance(account || '');
        let w_sellEnable = await getSellState();
        setUsdtBalance(w_usdtBalance);
        setTokenBalance(w_tokenBalance);
        setEnableSell(w_sellEnable);
      }
    } else {
      if(!account)
      {
        notifyError("account is undefined");
        return;
      }
      let w_res = await buyRes(orderAmount, account);
      if(w_res === -1) {
        notifyError("You don't have enough USDT");
      } else if(w_res === 0) {
        notifyError("transaction error occured");
      } else if(w_res === 1) {
        notifySuccess("bought token successfully");
        let w_usdtBalance = await getUsdtBalance(account ||'');
        let w_tokenBalance = await getTokenBalance(account || '');
        let w_sellEnable = await getSellState();
        setUsdtBalance(w_usdtBalance);
        setTokenBalance(w_tokenBalance);
        setEnableSell(w_sellEnable);
      }
    }
  }
  return (
    <>    
    <DefaultPageTemplate fullWidth marginMax> 
      <Row style={{marginTop: '20px'}} justify={'center'}>
        <S.Title className="main-title white">RESBONO INVETMENTS</S.Title>
      </Row>
      <Row justify={'center'}>
        <S.Paragraph className='white'>Free from sign-up, complications</S.Paragraph>
      </Row>
      <Row justify={'center'}>
        <S.Panel>
          <S.Row>
            <Col xs={8} sm={8} md={8} lg={8} xl={8}>
              <Row>
                <S.Title className="pan-title green">{sell?'Sell':'Buy'}</S.Title>
              </Row>
            </Col>
            <Col xs={16} sm={16} md={16} lg={16} xl={16}>
              <Row justify={'end'}>
                <S.Paragraph className="info blue">Price ${sell?sellPrice:buyPrice}</S.Paragraph>
                <S.Paragraph className="info blue right">Fee {sell?sellFee:buyFee}%</S.Paragraph>
              </Row>
            </Col>
            {!enableSell && <S.Paragraph className="info gray">The "sell" function is currently disabled</S.Paragraph>}
          </S.Row>
          <S.Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Row>
                <S.Image src={sell?"assets/images/tokenlogo.png":"assets/images/usdt.png"}></S.Image>
                <S.Paragraph className="white swap">{sell?'RES':'USDT'}</S.Paragraph>
              </Row>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Row justify={'end'}>
                <S.Paragraph className="white swap right">balance {sell?Math.floor(tokenBalance*100)/100:Math.floor(usdtBalance*100)/100}</S.Paragraph>
              </Row>
            </Col>
          </S.Row>
          <S.Row className="inputRow" justify={'center'}>
            <InputNumber value={orderAmount} onChange={handleOrderAmount}></InputNumber>
          </S.Row>
          <S.Row className="buttonRow" justify={'center'}>
            <S.Button onClick={handleOrderType}>
              <svg viewBox='0 0 24 24' style={{width: '20px'}} xmlns="http://www.w3.org/2000/svg">
                <path d="M16 17.01V11c0-.55-.45-1-1-1s-1 .45-1 1v6.01h-1.79c-.45 0-.67.54-.35.85l2.79 2.78c.2.19.51.19.71 0l2.79-2.78c.32-.31.09-.85-.35-.85H16zM8.65 3.35L5.86 6.14c-.32.31-.1.85.35.85H8V13c0 .55.45 1 1 1s1-.45 1-1V6.99h1.79c.45 0 .67-.54.35-.85L9.35 3.35a.501.501 0 00-.7 0z">      
                </path>
              </svg>
            </S.Button>
          </S.Row>
          <S.Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Row>
                <S.Image src={sell?"assets/images/usdt.png":"assets/images/tokenlogo.png"}></S.Image>
                <S.Paragraph className="white swap">{sell?'USDT':'RES'}</S.Paragraph>
              </Row>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <Row justify={'end'}>
                <S.Paragraph className="white swap right">balance {sell?Math.floor(usdtBalance*100)/100:Math.floor(tokenBalance*100)/100}</S.Paragraph>
              </Row>
            </Col>
          </S.Row>
          <S.Row className="inputRow" justify={'center'}>
            <InputNumber value={preAmount} readOnly></InputNumber>
          </S.Row>
          <S.Row justify={'center'}>
            <S.Button className="swap" onClick={handleOrder}>{sell?'SELL':'BUY'}</S.Button>
          </S.Row>
        </S.Panel>
      </Row>
      <S.Row className="worksRow" justify={'center'}>
        <Col xs={24} sm={24} md={8}>
          <Row justify={'center'}>
            <Image src="assets/images/anyswap.png"></Image>
          </Row>
          <Row justify={'center'}>
            <S.Title className='sub-title white'>Select the currency</S.Title>
            <S.Paragraph className="white">Switch Buy/Sell option and input token amount you want to buy or sell.</S.Paragraph>
          </Row>
        </Col> 
        <Col xs={24} sm={24} md={8}>
          <Row justify={'center'}>
            <S.Button className="send"><S.SendOutlined></S.SendOutlined></S.Button>
          </Row>
          <Row justify={'center'}>
            <S.Title className='sub-title white'>Send and receive coins</S.Title>
            <S.Paragraph className="white">To continue, send the indicated amount of coins by clicking Buy/Sell button.</S.Paragraph>
          </Row>
        </Col> 
        <Col xs={24} sm={24} md={8}>
          <Row justify={'center'}>
            <S.Button className="like"><S.LikeOutlined></S.LikeOutlined></S.Button>
          </Row>
          <Row justify={'center'}>
            <S.Title className='sub-title white'>That's all!</S.Title>
            <S.Paragraph className="white">USDT/RESBONO is sent directly to your wallet, we don’t store it on our service.</S.Paragraph>
          </Row>
        </Col> 
      </S.Row>
    </DefaultPageTemplate>
    </>
  )
}

export const S = {
  Title: styled(Title) `
    font-family: 'Changa';
    &.main-title {
      margin: 20px 0px 0px !important;
      font-weight: 400 !important;
      font-size: 3rem !important;
    }
    &.sub-title {
      margin: 20px 0px 20px !important;
      font-weight: 300 !important;
      font-size: 1.5rem !important;
      display: inline;
    }
    &.pan-title {
      margin: 0px 0px 20px !important;
      font-weight: 300 !important;
      font-size: 1.5rem !important;
      display: inline;
    }
    &.white {
      color: ${props=>props.theme.white};
    } 
    &.blueberry-lighter {
      color: ${props=>props.theme.blueberry.lighter};
    }   
    &.green {
      color: #80d183;
    }
    &.right {
      text-align: right;
    }    
  `,
  Paragraph: styled(Paragraph)`
    font-size: 16px;
    font-family: 'Changa';
    @media (min-width: ${props => props.theme.viewport.desktopXl}) {
      font-size: 22px;
    }
    &.right {
      text-align: right;
    }
    &.white {
      color: ${props=>props.theme.white};
    } 
    &.gray {
      color: ${props=>props.theme.gray['5']};
    }
    &.blue {
      color: #7cc5ff;
    }
    &.green {
      color: #80d183;
    }
    &.blueberry-lighter {
      color: ${props=>props.theme.blueberry.lighter};
    }
    &.swap {
      display: inline;
      margin: 0px;
      transition: opacity 30s ease-in-out !important;
    }
    &.info {
      display: inline;
      margin-left: 20px;
    }
  `,
  Panel: styled.div`
    border-radius: 5px;
    background-color: ${props => props.theme.black.light};
    padding: 40px 20px;
    width: 320px;
  `,
  Row: styled(Row)`
    margin: 20px 0px 0px;
    &.inputRow {
      margin: 10px 0px;
      .ant-input-number {
        background-color: transparent !important;
        color: white !important;
        border: 1px solid #7cc5ff !important;
        width: 100%;
        height: 50px;
        padding-top: 9px;
        font-size: 20px;
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
    }
    &.buttonRow {
      margin: 40px 0px 20px;
    }
    &.worksRow {
      margin: 50px 0px 0px;
    }
  `,
  Image: styled(Image)`
    width: 20px !important;
    margin-right: 5px !important;
  `,
  Col: styled(Col)`
    &.swapCol {
      border-radius: 5px;
      background-color: ${props => props.theme.black.light};
      padding: 20px 10px;
      @media (max-width: ${props => props.theme.viewport.desktopXl}) {
        padding: 40px 30px;
      }
      @media (max-width: ${props => props.theme.viewport.desktopl}) {
        padding: 25px 20px;
      }
      @media (max-width: ${props => props.theme.viewport.desktop}) {
        padding: 20px 10px;
      }
      @media (max-width: 767px) {
        padding: 30px 10px;
        margin: 20px 0px;
      }
      @media (max-width: ${props => props.theme.viewport.mobile}) {
        padding: 20px 10px;
        margin: 20px 0px;
      }
    }
    &.introCol {
      padding-right: 20px;
    }
  `,
  Button: styled(Button)`
    width: 32px;
    height: 32px;
    border-radius: 32px;
    background-color: #1fc7d4;
    border: 0px solid #1fc7d4;
    &:hover {
      background-color: #1f89d4;
    }
    >svg {
      color: white !important;
      fill: white !important;
      cursor: pointer;
      font-weight: 600;
      position: relative;
      left: -8px;
      top: 2px;
    }
    &.swap {
      width: 100%;
      background-color: #1fc7d4;
      color: white;
      border-radius: 10px;
      height: 40px;
      font-size: 18px;
      font-weight: 600;
      font-family: 'Changa';
      &:hover {
        background-color: #1f89d4;
        color: white;
      }
    }
    &.send {
      width: 64px;
      height: 64px;
      border-radius: 64px;
      background-color: rgb(15,117,252);
    }
    &.like {
      width: 64px;
      height: 64px;
      border-radius: 64px;
      background-color: rgb(16,74,222);
    }
  `,
  SendOutlined: styled(SendOutlined)` 
    color: white;
    font-size: 32px;
  `,
  LikeOutlined: styled(LikeOutlined)` 
    color: white;
    font-size: 32px;
  `
}
