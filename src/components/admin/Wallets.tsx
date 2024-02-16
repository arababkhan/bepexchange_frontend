import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button, Row, Typography, Input, Tag, Col, Modal} from 'antd'
import { useGetadmins, useDeleteadmin, useAddadmin, useSetNetWithdrawAddress, useSetFeeWithdrawAddress, useGetFeeWithdrawAddress, useGetNetWithdrawAddress } from '../../hooks/useTransactions'
import { notifyError } from '../../services/NotificationService'
import { fonts } from '../../styles/variables'
import {formatShortAddress} from '../../services/UtilService'
const { Title } = Typography

export const Wallets: React.FC = () => {
  const getAdmins = useGetadmins();
  const addAdmin = useAddadmin();
  const deleteAdmin = useDeleteadmin();
  const setNetWithdrawAddress = useSetNetWithdrawAddress();
  const setFeeWithdrawAddress = useSetFeeWithdrawAddress();
  const getFeeWithdrawAddress = useGetFeeWithdrawAddress();
  const getNetWithdrawAddress = useGetNetWithdrawAddress();

  const [adminWallets, setAdminWallets] = useState<string[]>([])
  const [admin, setAdmin] = useState<string>('')
  const [feeAddress, setFeeAddress] = useState<string>('');
  const [netAddress, setNetAddress] = useState<string>('');
  const [isShowConfirmFee, setIsShowConfirmFee] = useState(false);
  const [isShowConfirmNet, setIsShowConfirmNet] = useState(false);

  const handleAddAdmin = async () => {
    let w_res = await addAdmin(admin);
    setAdmin('');
    if(w_res === 1) {
      let w_admins = await getAdmins();
      setAdminWallets(w_admins);
    } else {
      notifyError("You don't have permission");
    }
  };

  const handleDeleteAdmin = async (index:number) => {
    let w_res = await deleteAdmin(index);
    if(w_res === 1) {
      let w_admins = await getAdmins();
      setAdminWallets(w_admins);
    } else {
      notifyError("You don't have permission");
    }
  };

  const handleNetAddress = async () => {
    setIsShowConfirmNet(true);
  };

  const handleFeeAddress = () => {
    setIsShowConfirmFee(true);
  };

  const handleCancel = () => {
    setIsShowConfirmFee(false);
    setIsShowConfirmNet(false);
  }

  const confirmFee = async() => {
    setIsShowConfirmFee(false);
    let w_res = await setFeeWithdrawAddress(feeAddress);
    if(w_res !== 1) {
      notifyError("You don't have permission!");
    } 
  }

  const confirmNet = async() => {
    setIsShowConfirmNet(false);
    let w_res = await setNetWithdrawAddress(netAddress);
    if(w_res !== 1) {
      notifyError("You don't have permission!");
    } 
  }

  useEffect(() => {
    async function getInitialValues() {
      let w_admins = await getAdmins();
      setAdminWallets(w_admins);
      let w_netWithdrawAddress = await getNetWithdrawAddress();
      let w_feeWithdrawAddress = await getFeeWithdrawAddress();
      setFeeAddress(w_feeWithdrawAddress);
      setNetAddress(w_netWithdrawAddress);
    }

    getInitialValues()
  }, [])
  return (
    <Row>
      <Col xs={24} sm={12} style={{padding: '0px 10px'}}>
        <S.Title className="white orderDesc">Admin Wallet</S.Title>
        <Row justify={'space-between'}>
          <S.Input value={admin} onChange={(e) => setAdmin(e.target.value)}></S.Input>
          <S.Button onClick={() => handleAddAdmin()} style={{width: '80px'}}>Add</S.Button>
        </Row>
        <div style={{ marginTop: '20px' }}>
          <S.Title className="white prod">Added admin wallets:</S.Title>
          {adminWallets.map((admin, index) => (
            <S.Tag
              closable
              onClose={() => handleDeleteAdmin(index)}
              key={index}
              style={{ marginTop: '10px' }}
            >
              {formatShortAddress(admin)}
            </S.Tag>
          ))}
        </div>
      </Col>
      <Col xs={24} sm={12} style={{padding: '0px 10px'}}>
        <S.Title className="white orderDesc">Net profit withdraw address</S.Title>
        <Row justify={'space-between'}>
        <S.Input value={netAddress} onChange={(e) => setNetAddress(e.target.value)}></S.Input>
        <S.Button style={{width: '80px'}} onClick={handleNetAddress}>Set</S.Button>
        </Row>
        <S.Title className="white orderDesc">Fee profit withdraw address</S.Title>
        <Row justify={'space-between'}>
        <S.Input value={feeAddress} onChange={(e) => setFeeAddress(e.target.value)}></S.Input>
        <S.Button style={{width: '80px'}} onClick={handleFeeAddress}>Set</S.Button>  
        </Row>
      </Col>
      <S.Modal onCancel={handleCancel} onOk={confirmNet} open={isShowConfirmNet}>
        <h1>Please confirm again</h1>
        <h2>{netAddress}</h2>
      </S.Modal>
      <S.Modal onCancel={handleCancel} onOk={confirmFee} open={isShowConfirmFee}>
        <h1>Please confirm again</h1>
        <h2>{feeAddress}</h2>
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
      margin-top: 10px !important;
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
  `,
  Tag: styled(Tag)`
    color: white !important;
    font-size: 14px;
    &.ant-tag .ant-tag-close-icon {
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
    max-width: 100%;
    display: inline-block;
    font-family: 'Changa';
    &::placeholder {
      color: white;
    }
    @media (min-width: 230px) {
      margin-bottom: 10px;
    }
    @media (min-width: 530px) {
      max-width: 300px;
      margin-bottom: 0px;
    }
    @media (min-width: 576px) {
      max-width: 300px;
      margin-bottom: 10px;
    }
    @media (min-width: 1267px) {
      max-width: 300px;
      margin-bottom: 0px;
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
