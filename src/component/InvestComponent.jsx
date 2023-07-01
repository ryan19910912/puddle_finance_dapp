import {
  ConnectButton,
  useAccountBalance,
  useWallet,
  SuiChainId,
  ErrorCode,
  formatSUI,
  addressEllipsis,
  useSuiProvider
} from "@suiet/wallet-kit";

import { useState, useEffect, useRef } from 'react';

import {
  getYourFundItems,
  getYourInvestItems,
  getPuddleStatistics,
  handleSignMsg,
} from "../resources/sui_api.js";

import axios from 'axios';

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Tab,
  Icon,
  Input,
  position,
} from '@chakra-ui/react';

import { CloseIcon } from '@chakra-ui/icons'

import Popup from 'reactjs-popup';
import '../resources/style.css';
import 'reactjs-popup/dist/index.css';

export default function WalletComponent() {

  const walletStyle = {
    textAlign: 'center'
  }

  const WalletTableStyle = {
    backgroundColor: '#111524',
    border: '1px solid darkgoldenrod',
    padding: '20px',
    borderRadius: '18px',
    width: '45vw',
    margin: '15px',
    display: 'inline-table',
  }

  const FundTableStyle = {
    backgroundColor: '#111524',
    border: '1px solid darkgoldenrod',
    padding: '20px',
    borderRadius: '18px',
    width: '45vw',
    margin: '15px',
    display: 'inline-table',
  }

  const ThStyle = {
    fontSize: '24px',
    color: 'darkorchid',
  }

  const TdStyle = {
    padding: '2vh 0'
  }

  function timestampChange(timestamp) {
    if (timestamp == 0) {
      return "N/A";
    }
    var date = new Date(timestamp);
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    return Y + M + D + h + m + s;
  }

  const wallet = useWallet();
  const { balance } = useAccountBalance();

  const SUI_MAINNET_API_URL = "https://fullnode.mainnet.sui.io";
  const SUI_TESTNET_API_URL = "https://fullnode.testnet.sui.io";
  const SUI_DEVNET_API_URL = "https://fullnode.devnet.sui.io";

  const SUI_MAINNET_SUIEXPLOR_URL = "https://suiexplorer.com/{type}/{id}?network=mainnet";
  const SUI_TESTNET_SUIEXPLOR_URL = "https://suiexplorer.com/{type}/{id}?network=testnet";
  const SUI_DEVNET_SUIEXPLOR_URL = "https://suiexplorer.com/{type}/{id}?network=devnet";

  const [apiurl, setApiurl] = useState(SUI_TESTNET_API_URL);
  const [suiexplor, setSuiexplor] = useState();
  const [yourInvestItem, setYourInvestItem] = useState(new Array());
  const [puddleStatistics, setPuddleStatistics] = useState(new Object());
  const [payAmount, setPayAmount] = useState(0);

  useEffect(() => {
    if (wallet.connected) {
      if (wallet.chain.name === 'Sui Devnet') {
        setApiurl(SUI_DEVNET_API_URL);
        setSuiexplor(SUI_DEVNET_SUIEXPLOR_URL);
      } else if (wallet.chain.name === 'Sui Testnet') {
        setApiurl(SUI_TESTNET_API_URL);
        setSuiexplor(SUI_TESTNET_SUIEXPLOR_URL);
      } else {
        setApiurl(SUI_MAINNET_API_URL);
        setSuiexplor(SUI_MAINNET_SUIEXPLOR_URL);
      }
      getYourInvsetFunds();
      getFundsData();
    }
  }, [wallet.connected]);

  function getFundsData() {
    getPuddleStatistics(axios, apiurl, wallet.account.address).then(resp => {
      setPuddleStatistics(resp);
    });
  }

  function getYourInvsetFunds() {
    // getYourInvestItems(axios, apiurl, wallet.account.address).then(resp => {
    //   setYourInvestItem(resp);
    // });
    handleSignMsg(wallet, "aaaa");
  }

  const changePayAmount = (e) => {
    setPayAmount(e.target.value);
  }

  function modifyInvestAmount(e) {

  }

  return (
    <div className="wallet" style={walletStyle}>
      <div style={WalletTableStyle}>
        <h1 style={{ color: 'dodgerblue' }}>Wallet Detail</h1>
        <Table variant='simple' align="center" style={{ width: "100%" }}>
          <Thead>
            <Tr>
              <Th style={{ ...ThStyle, width: "30%" }} >Network</Th>
              <Th style={{ ...ThStyle, width: "50%" }} >Status</Th>
              <Th style={{ ...ThStyle, width: "20%" }} >Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{wallet.chain ? wallet.chain.name : 'N/A'}</Td>
              <Td>
                {wallet.connecting
                  ? 'Connecting'
                  : wallet.connected
                    ? 'Connected'
                    : 'N/A'}
              </Td>
              <Td>
                {balance ? formatSUI(balance ?? 0, {
                  withAbbr: false
                }) + ' SUI' : 'N/A'}
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <h1 style={{ color: 'gold' }}>Your Invested Puddles</h1>
        <Table variant='simple' align="center" style={{ width: "100%" }}>
          <Thead>
            <Tr>
              <Th style={{ ...ThStyle, width: "30%" }} >Name</Th>
              <Th style={{ ...ThStyle, width: "50%" }} >Description</Th>
              <Th style={{ ...ThStyle, width: "20%" }} >Invested</Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              yourInvestItem?.map(puddle => {
                return (
                  <Tr>
                    <Td style={{ wordBreak: 'break-all' }}>
                      <Popup trigger={<a href="javascript:void(0)">{puddle?.puddle?.metadata.name}</a>}
                        modal
                        nested
                        data-theme='dark'
                        position="right center">
                        {close => (
                          <div>
                            <div style={{ textAlign: "left" }}>
                              <a style={{ cursor: "pointer" }}>
                                <Icon as={CloseIcon} className="close" onClick={close} />
                              </a>
                            </div>
                            <div style={{ overflow: 'overlay' }}>
                              <h1 style={{ color: 'gold' }}>Fund Detail</h1>
                              <Table variant='simple' align="center" style={{ width: "100%", color: "white" }}>
                                <Thead>
                                  <Tr>
                                    <Th style={ThStyle} >Fund Name</Th>
                                    <Th style={ThStyle} >Total Supply</Th>
                                    <Th style={ThStyle} >Max Supply</Th>
                                    <Th style={ThStyle} >Fund Trader</Th>
                                    <Th style={ThStyle} >Proportion</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  <Tr>
                                    <Td >{puddle?.puddle?.metadata.name}</Td>
                                    <Td>{Number(puddle?.puddle?.metadata.total_supply) / Number(puddle?.puddle?.coin_decimals) + " " + puddle?.puddle?.coin_name}</Td>
                                    <Td >{Number(puddle?.puddle?.metadata.max_supply) / Number(puddle?.puddle?.coin_decimals) + " " + puddle?.puddle?.coin_name}</Td>
                                    <Td>
                                      <a target="_black" href={suiexplor.replace("{id}", puddle?.puddle?.metadata.trader).replace("{type}", "address")}>{addressEllipsis(puddle?.puddle?.metadata.trader)}</a>
                                    </Td>
                                    <Td>{puddle.proportion}</Td>
                                  </Tr>
                                </Tbody>
                              </Table>
                              <Table style={{ width: '100%' }}>
                                <Thead>
                                  <Tr>
                                    <Th style={ThStyle} >Description</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  <Tr>
                                    <Td style={{ width: "40%", wordBreak: 'break-all' }}>{puddle?.puddle?.metadata.desc}</Td>
                                  </Tr>
                                </Tbody>
                              </Table>

                              <hr />

                              <h1 style={{ color: 'gold' }}>Invested Detail</h1>
                              <Table variant='simple' align="center" style={{ width: "100%", color: "white" }}>
                                <Thead>
                                  <Tr>
                                    <Th style={{...ThStyle, width:'30%'}} >Invested</Th>
                                    <Th style={{...ThStyle, width:'70%'}} >Deposit / Sale</Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  <Tr>
                                    <Td>
                                      <b style={{ color: 'cyan' }}>{Number(puddle?.shares) / Number(puddle?.puddle.coin_decimals) + " " + puddle?.puddle.coin_name}</b>
                                    </Td>
                                    <Td>
                                      <input type="number" onChange={changePayAmount} value={payAmount} />
                                      &nbsp;
                                      <button className="btn">Deposit</button>
                                      &nbsp;
                                      <button className="btn">Sale</button>
                                    </Td>
                                  </Tr>
                                </Tbody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </Popup>
                    </Td>
                    <Td className="fontverylong">{puddle?.puddle.metadata.desc}</Td>
                    <Td>{Number(puddle?.shares) / puddle?.puddle.coin_decimals + " " + puddle?.puddle.coin_name}</Td>
                  </Tr>
                )
              })
            }
          </Tbody>
        </Table>
      </div>

      <div style={FundTableStyle}>
        <h1 style={{ color: 'fuchsia' }}>Puddles</h1>
        <Table variant='simple' align="center" style={{ width: "100%" }}>
          <Thead>
            <Tr>
              <Th style={ThStyle} >Name</Th>
              <Th style={ThStyle} >Description</Th>
              <Th style={ThStyle} >Total Supply</Th>
              <Th style={ThStyle} ></Th>
            </Tr>
          </Thead>
          <Tbody>
            {
              puddleStatistics?.in_progress_puddles?.map(puddle => {
                if (!puddle?.isInvest) {
                  return (
                    <Tr>
                      <Td style={TdStyle}>
                        <Popup trigger={<a href="javascript:void(0)">{puddle?.metadata.name}</a>}
                          modal
                          nested
                          data-theme='dark'
                          position="right center">
                          <div>Popup content here !!</div>
                        </Popup>
                      </Td>
                      <Td>{puddle?.metadata?.desc}</Td>
                      <Td>{Number(puddle?.metadata?.total_supply) / puddle?.coin_decimals + " " + puddle?.coin_name}</Td>
                    </Tr>
                  )
                }
              })
            }
          </Tbody>
        </Table>
      </div>
    </div >
  );
}