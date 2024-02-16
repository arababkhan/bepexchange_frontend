import { useWeb3React } from '@web3-react/core';
import { useSignerOrProvider } from "../hooks/useSignerOrProvider";
import { getContract } from "../services/UtilService";
import contractAbi from '../abi/resBono.json';
import erc20Abi from '../abi/erc20.json';
import { chainConfig } from '../config';
import {units, coins} from '../services/UtilService';
import {parseBigNumberToFloat} from '../services/UtilService';
import { clearTransaction, handleTransaction, TransactionType } from '../graphql/variables/TransactionVariable';

export function useGetRole () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;
  
  const getRole = async(account:string) => {
    try {
      if(!!signerOrProvider && account && contract_address) {
        const resContract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await resContract.getRole(account);
        return w_res;
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }

  return getRole;
}

export function useGetSellPrice () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getSellPrice = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const resContract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await resContract._sellPrice();
        return parseBigNumberToFloat(w_res, 18);
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }
  
  return getSellPrice;
}

export function useGetBuyPrice () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getBuyPrice = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const resContract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await resContract._buyPrice();
        return parseBigNumberToFloat(w_res, 18);
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }
  
  return getBuyPrice;
}

export function useGetBuyFee () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getBuyFee = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const resContract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await resContract._buyFee();
        return parseBigNumberToFloat(w_res, 1);
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }
  
  return getBuyFee;
}

export function useGetSellFee () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getSellFee = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const resContract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await resContract._sellFee();
        return parseBigNumberToFloat(w_res, 1);
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }
  
  return getSellFee;
}

export function useGetSellState () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getSellState = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const resContract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await resContract._bAllowSell();
        return w_res;
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }
  
  return getSellState;
}

export function useGetUsdtBalance () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const usdtAddress = chainConfig(chainId)?.usdtAddress;

  const getUsdtBalance = async(account:string) => {
    try {
      if(!!signerOrProvider && usdtAddress) {
        const erc20UsdtContract = getContract(usdtAddress || '', erc20Abi, signerOrProvider);
        let w_res = await erc20UsdtContract.balanceOf(account);
        return parseBigNumberToFloat(w_res, 18);
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }

  return getUsdtBalance;
}

export function useGetTokenBalanc