import React, { Component } from "react";
import _ from "lodash";

import "./App.css";

import web3 from "./web3";
import { lottery, lotteryws } from "./lottery_abi";

import { Grid, Button, Image, Container, Form, Label } from "semantic-ui-react";

import { Howl } from "howler";

import CoinBg from "./Coin.bg";
import livePatern from "./bg";

class App extends Component {
  state = {
    manager: "",
    managerName: "loading...",
    players: [],
    balance: "",
    value: "",
    message: " Yarilabs - Lottery ",
    accounts: [],
    selectedAccount: "",
    jumpCoin: false,
    logs: [],
    lastPlayers: [],
    loadingUserTx: false,
    formName: "",
    formValue: "0.02",
    eventTransfer: [],
    featuredMessage: "YOU CAN WIN!",
    lastContractWinners: []
  };

  constructor(props) {
    super(props);
    this.soundAddCoin = new Howl({
      src: ["./assets/sounds/coin_1.ogg"]
    });
    this.soundWinner = new Howl({
      src: ["./assets/sounds/win.wav"]
    });
    this.soundCrowd = new Howl({
      src: ["./assets/sounds/crowd.wav"]
    });
  }

  playEnterCoin = () => {
    this.setState({ jumpCoin: true });
    // Play the sound.
    this.soundAddCoin.play();
    // Change global volume.
    // Howler.volume(0.5);
    setTimeout(() => {
      this.soundAddCoin.stop();
      this.setState({ jumpCoin: false });
    }, 1250);
  };

  playWinner = () => {
    this.soundWinner.play();
    setTimeout(() => {
      this.soundCrowd.play();
    }, 250);
    // Change global volume.
    // Howler.volume(0.5);
    // setTimeout(() => {
    //   this.soundWinner.stop();
    // }, 300 );
  };

  listenSolEvents = async () => {
    lotteryws.events.Transfer((err, event) => {
      if (event) {
        const { from, to, amount } = event.returnValues;
        this.setState({ message: `Winner: ${to}` });
        let tmp = this.state.eventTransfer;
        tmp.push({ from, to, amount });
        this.setState({
          eventTransfer: tmp,
          featuredMessage: `Winner ${to}`
        });
        this.playWinner();
        this.loadBalance();
        this.loadAllTransactionsOfContract();
      } else {
        console.err("Events: ", err);
      }
    });

    lotteryws.events.NewPlayer((err, event) => {
      if (event) {
        console.log("​App -> listenSolEvents -> event", event);
        const _name = event.returnValues.name;
        const _value = event.returnValues.value;
        const _account = event.returnValues.account;

        let tmp = this.state.lastPlayers;
        tmp.push({ _name, _value, _account });
        this.setState({
          lastPlayers: tmp
        });
        this.playEnterCoin();
        this.loadBalance();
        this.loadAllTransactionsOfContract();
      } else {
        console.err("Events: ", err);
      }
    });
  };

  loadBalance = async () => {
    const balance = await web3.eth.getBalance(lottery.options.address); // address of contract and return an big number
    this.setState({ balance });
  };

  initAppState = async () => {
    const manager = await lottery.methods.manager().call();
    const managerName = await lottery.methods.managerName().call();
    const players = await lottery.methods.getPlayers().call();
    const lastPlayers = players.map(address => {
      return { _name: "<Last session>", _value: "", _account: address };
    });
    const accounts = await web3.eth.getAccounts();
    const winners = await lottery.methods.getWinners().call();
    this.setState({
      manager,
      players,
      accounts,
      managerName,
      lastPlayers,
      lastContractWinners: this.state.lastContractWinners.concat(winners)
    });
    this.loadBalance();
  };

  async componentDidMount() {
    livePatern.init(false); // set to false for cancel animation bg
    this.initAppState();
    this.listenSolEvents();
    this.loadAllTransactionsOfContract();
  }

  showPickWinner = () => {
    if (this.state.accounts[0] === this.state.manager) {
      return (
        <Button inverted color="red" onClick={this.pickWinnerEvent}>
          Pick Winner
        </Button>
      );
    } else {
      return <div>.</div>;
    }
  };

  gotoEtherScanByAddress = address => {
    return `https://rinkeby.etherscan.io/address/${address}`;
  };

  jumpCoinEvent = () => {
    this.playEnterCoin();
  };

  pickWinnerEvent = async () => {
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success ... " });
    try {
      await lottery.methods
        .pickWinner()
        .send({
          from: accounts[0]
        })
        .once("transactionHash", hash => {
          console.log("​App -> hash", hash);
          this.setState({ message: "Tx hash received!" });
          setTimeout(() => {
            this.setState({ loadingUserTx: false });
          }, 1000);
        })
        .once("receipt", receipt => {
          console.log("​App -> receipt", receipt);
          this.setState({
            message: "You have received the first Receipt from transation."
          });
        })
        .once("confirmation", (confNumber, receipt) => {
          console.log("pickWinnerEvent ->  receipt", receipt);
          console.log("pickWinnerEvent -> confNumber", confNumber);
          this.setState({ message: "A winner has been picked! ... " });
          this.playWinner();
        })
        .on("error", error => {
          console.log("pickWinnerEvent error", error);
          this.setState({ message: "Transaction error!" });
        })
        .then(receipt => {
          console.log("pickWinnerEvent -> receipt", receipt);
          setTimeout(() => {
            this.setState({ message: "Yarilabs - Lottery" });
          }, 3000);
        });
    } catch (error) {
      this.setState({ loadingUserTx: false, message: "Transaction error!" });
    }
  };

  sidebox = (title, items = [], _type = "ev") => {
    const listItems = items.map((it, index) => {
      switch (_type) {
        case "tx":
          return (
            <li key={index}>
              {it.blockN} -{" "}
              <a href={`https://rinkeby.etherscan.io/tx/${it.trx}`}> see tx </a>
            </li>
          );
        case "ev":
          let valueTx =
            it._value !== ""
              ? web3.utils.fromWei(
                  new web3.utils.BN(it._value).toString(),
                  "ether"
                )
              : "";
          return (
            <li key={index}>
              {it._name} - {valueTx}
              <a href={this.gotoEtherScanByAddress(it._account)}> more </a>
            </li>
          );
        case "winners":
          return (
            <li key={index}>
              <a href={this.gotoEtherScanByAddress(it)}> Winner address </a>
            </li>
          );
        default:
          return <li key={index}> - </li>;
      }
    });

    return (
      <div className="sidebox">
        <div className="title">{title}</div>
        <div className="list-wrp">{listItems}</div>
      </div>
    );
  };

  submitNewPlayer = async event => {
    event.preventDefault();
    const { formName, formValue } = this.state;
    this.setState({ loadingUserTx: true });
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Wait for transaction ... " });
    try {
      await lottery.methods
        .enter(formName)
        .send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.formValue, "ether")
        })
        .once("transactionHash", hash => {
          console.log("​App -> hash", hash);
          this.setState({ message: "Tx hash received!" });
          setTimeout(() => {
            this.setState({ loadingUserTx: false });
          }, 1000);
        })
        .once("receipt", receipt => {
          console.log("​App -> receipt", receipt);
          this.setState({
            message: "You have received the first Receipt from transation."
          });
        })
        .once("confirmation", (confNumber, receipt) => {
          console.log("​App ->  receipt", receipt);
          console.log("​App -> confNumber", confNumber);
          this.setState({ message: "You have been enter on this lottery!" });
        })
        .on("error", error => {
          console.log("submitNewPlayer error", error);
          this.setState({ message: "Transaction error!" });
        })
        .then(receipt => {
          console.log("submitNewPlayer -> receipt", receipt);
          setTimeout(() => {
            this.setState({ message: "Yarilabs - Lottery" });
          }, 3000);
        });
    } catch (error) {
      this.setState({ loadingUserTx: false, message: "Transaction error!" });
    }
  };

  loadAllTransactionsOfContract = async () => {
    const { _address } = lottery;
    const allTrans = await web3.eth.getPastLogs({
      fromBlock: "0x0",
      address: _address
    });
    let _logs = [];
    for (const iterator of allTrans) {
      _logs.push({
        blockN: iterator.blockNumber,
        trx: iterator.transactionHash
      });
    }
    this.setState({
      logs: _.orderBy(_logs, ["type", "blockN"], ["asc", "desc"])
    });
  };

  handleChangeValue = e => {
    const { value } = e.target;
    this.setState({ formValue: value });
  };

  userSubmitForm = () => {
    const { formValue } = this.state;
    return (
      <Form
        className="form-new-user"
        onSubmit={this.submitNewPlayer}
        loading={this.state.loadingUserTx}
      >
        <Form.Group grouped>
          <Label color="olive">Name:</Label>
          <Form.Field>
            <input
              placeholder="Name"
              value={this.state.formName}
              onChange={event =>
                this.setState({ formName: event.target.value })
              }
            />
          </Form.Field>
        </Form.Group>
        <Form.Group inline>
          <Label color="teal">Ether to spend: {this.state.formValue} </Label>
          {/*  <Form.Field
            label="0.02"
            value="0.02"
            control="input"
            type="radio"
            checked={this.state.formValue === "0.02"}
            onChange={this.handleChangeValue}
          />
         */}
        </Form.Group>
        <Button type="submit" inverted color="green">
          Enter
        </Button>
      </Form>
    );
  };

  header() {
    return (
      <Container fluid className="header">
        <Grid className="full-h">
          <Grid.Row color="black">
            <Grid.Column width={4} verticalAlign="middle">
              <Image src="/assets/img/logo_yarilabs.png" />
            </Grid.Column>
            <Grid.Column width={8}>
              <p>
                {this.state.managerName} (<a
                  href={this.gotoEtherScanByAddress(this.state.manager)}
                >
                  Manager Address
                </a>{" "}
                )
              </p>
              <p>
                <a href={this.gotoEtherScanByAddress(lottery.options.address)}>
                  {" "}
                  Contract address{" "}
                </a>
              </p>
            </Grid.Column>
            <Grid.Column width={4}>{this.showPickWinner()}</Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  main() {
    return (
      <Container fluid className="main">
        <CoinBg jumpCoinValue={this.state.jumpCoin} />

        <Grid className="full-h menus" columns="equal">
          <Grid.Row stretched>
            <Grid.Column width={4}> </Grid.Column>
            <Grid.Column width={8}> </Grid.Column>
            <Grid.Column width={4}> </Grid.Column>
          </Grid.Row>

          <Grid.Row stretched>
            <Grid.Column width={4}>
              {this.sidebox(
                "Last Players events",
                this.state.lastPlayers,
                "ev"
              )}
            </Grid.Column>
            <Grid.Column width={8}>
              <div className="coin-wrp">
                <div
                  className={
                    this.state.jumpCoin ? "coin coin-fast-to-furious" : "coin"
                  }
                >
                  <div className="front" />
                  <div className="back" />
                  <div className="shade" />
                </div>
              </div>
              <div className="win-balance-wrp">
                <p className="featured anim-text-flow">
                  {" "}
                  {this.state.featuredMessage}{" "}
                </p>
                <p className="value">
                  {web3.utils.fromWei(this.state.balance, "ether")}{" "}
                </p>
                <p className="coin">'ethers'</p>
              </div>
            </Grid.Column>
            <Grid.Column width={4}>
              {this.sidebox(
                `Transactions (${this.state.logs.length}):`,
                this.state.logs,
                "tx"
              )}

              {this.sidebox(
                "Last winners",
                this.state.lastContractWinners,
                "winners"
              )}
            </Grid.Column>
          </Grid.Row>

          <Grid.Row stretched>
            <Grid.Column width={4} />
            <Grid.Column width={8}>{this.userSubmitForm()}</Grid.Column>
            <Grid.Column width={4} />
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  footer() {
    return (
      <Container fluid className="footer">
        <Grid className="full-h">
          <Grid.Row color="black">
            <Grid.Column>
              <marquee behavior="scroll" direction="right" scrollamount="6">
                {this.state.message}
              </marquee>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    );
  }

  render() {
    return (
      <div className="App" id="App">
        {this.header()}
        {this.main()}
        {this.footer()}
      </div>
    );
  }
}

export default App;
