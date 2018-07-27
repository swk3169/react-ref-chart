import React, { Component } from 'react';
import moment from 'moment';
import './App.css';
import axios from 'axios';
import Buttons from './components/Buttons';
import LineChart from './components/LineChart';

class App extends Component {

  state = {
    pair: 'BTCUSD',
    data: []
  }

  handleChangePair = (pair) => {
    // pair 값을 바꾸는 함수
    this.setState({ pair });
  }

  getData = async () => {
    const { pair } = this.state;
    try {
      // API 호출하고
      const response = await axios.get(`https://api.bitfinex.com/v2/candles/trade:5m:t${pair}/hist?limit=288`);
      // 데이터는 다음과 같은 형식인데,
      /* [ MTS, OPEN, CLOSE, HIGH, LOW, VOLUME ] */
      const data = response.data.map(
        // 필요한 값만 추출해서 날짜, 값이 들어있는 객체 생성
        (candle) => ({
          date: moment(candle[0]).format('LT'), // 시간만 나타나도록 설정
          value: candle[2]
        })
      ).reverse(); // 역순으로 받아오게 되므로 순서를 반대로 소팅
      this.setState({
        data
      });
    } catch (e) {
      console.log(e);
    }
  }

  componentDidMount() {
    // 첫 로딩시에 getData 호출
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    // pair 값이 바뀌면, getData 호출
    if (prevState.pair !== this.state.pair) {
      this.getData();
    }
  }

  render() {
    return (
      <div className="App">
        <Buttons onChangePair={this.handleChangePair} />
        { /* 데이터가 없으면 렌더링하지 않음 */}
        {this.state.data.length > 0 && <LineChart data={this.state.data} pair={this.state.pair} />}
      </div>
    );
  }
}

export default App;