import React, { Component } from 'react';
import './App.scss';
import InputBox from './components/InputBox/index';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            rates: {},
            items: [],
            inputOne: 0,
            inputTwo: 0,
            currencyOne: null,
            currencyTwo: null,
            exchangeRate: 0
        };
        this.inputOneHandler = this.inputOneHandler.bind(this);
        this.inputTwoHandler = this.inputTwoHandler.bind(this);
        this.currencyOneHandler = this.currencyOneHandler.bind(this);
        this.currencyTwoHandler = this.currencyTwoHandler.bind(this);
    }
    componentDidMount() {
        this.fetchData();
        setInterval(() => {
            this.fetchData();
        }, 10000);
    }
    fetchData() {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = 'https://openexchangerates.org/api/latest.json?app_id=23b1a42c552847edbb1e7c4379651eba';
        fetch(proxyUrl + targetUrl,
            {
                method: 'get',
                headers: new Headers({
                    'pragma': 'no-cache',
                    'cache-control': 'no-cache'
                })
            })
            .then(response => response.json())
            .then(
                (result) => {
                    const rates = result.rates;
                    let ratesArray = [];
                    Object.keys(rates).forEach(e => {
                        ratesArray.push({
                            key: e,
                            value: e,
                            text: e
                        });
                    });
                    this.setState({
                        rates: rates,
                        isLoaded: true,
                        items: ratesArray
                    });
                    this.currencyOneHandler(this.state.currencyOne ? this.state.currencyOne : ratesArray[0].value);
                    this.currencyTwoHandler(this.state.currencyTwo ? this.state.currencyTwo : ratesArray[0].value);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    currencyOneHandler(value, exchange) {
        this.setState({currencyOne: value}, () => {
            this.calcCurrency();
            if (exchange) {
                this.exchangeHandler(false);
            }
        });
    }
    currencyTwoHandler(value, exchange) {
        this.setState({currencyTwo: value}, () => {
            this.calcCurrency();
            if (exchange) {
                this.exchangeHandler(true);
            }
        });
    }
    calcCurrency() {
        if (this.state.currencyOne && this.state.currencyTwo) {
            const usdVal = 1 / this.state.rates[this.state.currencyOne];
            const inputTwo = usdVal * this.state.rates[this.state.currencyTwo];
            const res = Math.round(inputTwo * 10000) / 10000;
            this.setState({exchangeRate: res});
        }
    }
    inputOneHandler(value) {
        this.setState({inputOne: Number(value), currencyOne: this.state.currencyOne}, () => {
            if (!isNaN(Number(value))) {
                this.exchangeHandler(true);
            }
        });
    }
    inputTwoHandler(value) {
        this.setState({inputTwo: Number(value), currencyTwo: this.state.currencyTwo}, () => {
            if (!isNaN(Number(value))) {
                this.exchangeHandler(false);
            }
        });
    }
    exchangeHandler(itemOne) {
        if (itemOne) {
            const usdVal = this.state.inputOne / this.state.rates[this.state.currencyOne];
            const inputTwo = usdVal * this.state.rates[this.state.currencyTwo];
            this.setState({inputTwo: Math.round(inputTwo * 100) / 100});
        } else {
            const usdVal = this.state.inputTwo / this.state.rates[this.state.currencyTwo];
            const inputOne = usdVal * this.state.rates[this.state.currencyOne];
            this.setState({inputOne: Math.round(inputOne * 100) / 100});
        }

    }
    exchangeBtn() {
        alert('Nice One!');
        this.inputOneHandler(0);
    }
    render() {
        if (this.state.items.length > 0) {
            return (
                <div className="app-wrap">
                    <header className="app-header">
                        <h4>Exchange</h4>
                    </header>
                    <section className="app-body">
                        <InputBox items={this.state.items} rates={this.state.rates} inputValue={this.state.inputOne}
                                  inputHandler={this.inputOneHandler} currencyValue={this.state.currencyOne}
                                  currencyHandler={this.currencyOneHandler}/>
                        <div className="app-exchange-rates">
                            <div className="app-exchange-rates__text">1 {this.state.currencyOne} = {this.state.exchangeRate} {this.state.currencyTwo}</div>
                        </div>
                        <InputBox items={this.state.items} rates={this.state.rates} inputValue={this.state.inputTwo}
                                  inputHandler={this.inputTwoHandler} currencyValue={this.state.currencyTwo}
                                  currencyHandler={this.currencyTwoHandler}/>
                    </section>
                    <button className="app-exchange-btn" onClick={() => this.exchangeBtn()}>Exchange</button>
                </div>
            );
        }
        return (<div className="app-wrap app-wrap--loading">loading...</div>);
    }
}

export default App;
