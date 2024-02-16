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

export function useGetTokenBalance () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getTokenBalance = async(account:string) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await contract.balanceOf(account);
        return parseBigNumberToFloat(w_res, 18);
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }

  return getTokenBalance;
}

export function useGetNetProfit () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getNetBalance = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await contract.getBalance();
        return parseBigNumberToFloat(w_res, 18);
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }

  return getNetBalance;
}

export function useGetFeeProfit () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getFeeBalance = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await contract.getBalanceByFee();
        return parseBigNumberToFloat(w_res, 18);
      } else {
        return 0;
      }
    } catch {
      return 0;
    }
  }

  return getFeeBalance;
}

export function useSetBuyPrice () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const setBuyPrice = async(price:number) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.setBuyPrice(units(price.toString(), 18))
        funcTx? handleTransaction(funcTx.hash, TransactionType.setbuyprice) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return setBuyPrice;
}

export function useSetSellPrice () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const setSellPrice = async(price:number) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.setSellPrice(units(price.toString(), 18))
        funcTx? handleTransaction(funcTx.hash, TransactionType.setsellprice) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return setSellPrice;
}

export function useAddadmin () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const addAdmin = async(address:string) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.addAdmin(address)
        funcTx? handleTransaction(funcTx.hash, TransactionType.addAdmin) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return addAdmin;
}

export function useDeleteadmin () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const deleteAdmin = async(index:number) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.deleteAdmin(index)
        funcTx? handleTransaction(funcTx.hash, TransactionType.deleteAdmin) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return deleteAdmin;
}

export function useGetadmins () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getAdmins = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await contract.getAdmins();
        return w_res;
      }
    } catch {
      return [];
    }
  }

  return getAdmins;
}

export function useSetFeeWithdrawAddress () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const setFeeWithdrawAddress = async(address:string) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.setWithdrawFeeAddress(address)
        funcTx? handleTransaction(funcTx.hash, TransactionType.setFeeWithdrawAddress) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return setFeeWithdrawAddress;
}

export function useSetNetWithdrawAddress () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const setNetWithdrawAddress = async(address:string) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.setWithdrawUSDTAddress(address)
        funcTx? handleTransaction(funcTx.hash, TransactionType.setFeeWithdrawAddress) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return setNetWithdrawAddress;
}

export function useGetNetWithdrawAddress () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getNetWithdrawAddress = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await contract.getWithdrawAddress();
        return w_res;
      }
    } catch {
      return [];
    }
  }

  return getNetWithdrawAddress;
}

export function useGetFeeWithdrawAddress () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const getFeeWithdrawAddress = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        let w_res = await contract.getWithdrawFeeAddress();
        return w_res;
      }
    } catch {
      return [];
    }
  }

  return getFeeWithdrawAddress;
}

export function useSetSellFee() {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const setSellFee = async(fee:number) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.setSellFee(units(fee.toString(), 1))
        funcTx? handleTransaction(funcTx.hash, TransactionType.setSellFee) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return setSellFee;
}

export function useSetBuyFee() {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const setBuyFee = async(fee:number) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.setBuyFee(units(fee.toString(), 1))
        funcTx? handleTransaction(funcTx.hash, TransactionType.setBuyFee) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return setBuyFee;
}

export function useSetEnableSell() {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const setEnableSell = async(enable:boolean) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.allowSell(enable)
        funcTx? handleTransaction(funcTx.hash, TransactionType.setEnableSell) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return setEnableSell;
}

export function useSend() {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const send = async(amount:number, address:string) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.send(address, units(amount.toString(), 18))
        funcTx? handleTransaction(funcTx.hash, TransactionType.send) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return send;
}

export function useSell() {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;
  const usdtAddress = chainConfig(chainId)?.usdtAddress;

  const sell = async(amount:number, address:string, preAmount:number) => {
    try {
      if(!!signerOrProvider && contract_address && usdtAddress) {
        const usdtContract = getContract(usdtAddress, erc20Abi, signerOrProvider);
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        
        let w_tokenBalance = await contract.balanceOf(address);
        w_tokenBalance = parseBigNumberToFloat(w_tokenBalance);
        if(amount > w_tokenBalance)
          return -1;

        let w_usdtBalance = await usdtContract.balanceOf(contract_address);
        w_usdtBalance = parseBigNumberToFloat(w_usdtBalance);
        if(preAmount > w_usdtBalance)
          return -2;

        const funcTx = await contract.sell(units(amount.toString(), 18))
        funcTx? handleTransaction(funcTx.hash, TransactionType.send) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return sell;
}

export function useBuy() {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;
  const usdtAddress = chainConfig(chainId)?.usdtAddress;
  
  const buy = async(amount:number, address:string) => {
    try {
      if(!!signerOrProvider && contract_address && usdtAddress) {
        const usdtContract = getContract(usdtAddress, erc20Abi, signerOrProvider);
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);

        let w_usdtBalance = await usdtContract.balanceOf(address);
        w_usdtBalance = parseBigNumberToFloat(w_usdtBalance);
        if(amount > w_usdtBalance)
          return -1;
        
        const funcApproveTx = await usdtContract.approve(contract_address, units(amount.toString(), 18))
        funcApproveTx? handleTransaction(funcApproveTx.hash, TransactionType.approve) : clearTransaction();
        await funcApproveTx.wait()
        const delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms));
        await delay(2000)

        const funcTx = await contract.buy(units(amount.toString(), 18))
        funcTx? handleTransaction(funcTx.hash, TransactionType.send) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return buy;
}

export function useWithdrawNetProfit() {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;
  
  const withdrawNetProfit = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);

        const funcTx = await contract.withdrawBalance()
        funcTx? handleTransaction(funcTx.hash, TransactionType.send) : clearTransaction();
        await funcTx.wait();
        return 1;
      }
    } catch {
      return 0;
    }
  }
  
  return withdrawNetProfit;
}

export function useWithdrawFeeProfit() {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;
  
  const withdrawFeeProfit = async() => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);

        const funcTx = await contract.withdrawFee()
        funcTx? handleTransaction(funcTx.hash, TransactionType.send) : clearTransaction();
        await funcTx.wait();
        return 1;
      }
    } catch {
      return 0;
    }
  }
  
  return withdrawFeeProfit;
}

export function useDeposit() {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;
  const usdtAddress = chainConfig(chainId)?.usdtAddress;

  const deposit = async(amount:number, address:string) => {
    try {
      if(!!signerOrProvider && contract_address && usdtAddress) {
        const usdtContract = getContract(usdtAddress, erc20Abi, signerOrProvider);
        
        let w_usdtBalance = await usdtContract.balanceOf(address);
        w_usdtBalance = parseBigNumberToFloat(w_usdtBalance);
        if(amount > w_usdtBalance)
          return -1;

        const funcTx = await usdtContract.transfer(contract_address, units(amount.toString(), 18))
        funcTx? handleTransaction(funcTx.hash, TransactionType.deposit) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return deposit;
}

export function useSetSuperadmin () {
  const {chainId} = useWeb3React();
  const signerOrProvider = useSignerOrProvider();

  const contract_address = chainConfig(chainId)?.contractAddress;

  const setSuperadmin = async(address:string) => {
    try {
      if(!!signerOrProvider && contract_address) {
        const contract = getContract(contract_address || '', contractAbi, signerOrProvider);
        const funcTx = await contract.setSuperAdmin(address)
        funcTx? handleTransaction(funcTx.hash, TransactionType.setSuperadmin) : clearTransaction();
        await funcTx.wait()
        return 1;
      }
    } catch {
      return 0;
    }
  }

  return setSuperadmin;
}