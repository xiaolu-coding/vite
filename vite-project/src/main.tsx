import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// 用来注入 Windi CSS 所需的样式，一定要加上！
import 'virtual:windi.css';
import fib from 'virtual:fib';

alert(`结果: ${fib(10)}`);
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
