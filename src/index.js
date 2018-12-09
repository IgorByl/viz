/* eslint-disable no-unused-vars */
import './styles/main.css';
import './styles/reset.css';
import Chart from 'chart.js';

const _ = require('lodash');
const sessionFirst2018Q1 = require('./rsschool2018Q1.json');
const usersArr2018Q1 = require('./users2018Q1.json');
const sessionSecond2018Q3 = require('./rsschool-demo2018Q3.json');
const sessionFirst2018Q3 = require('./rsschool2018Q3.json');
const usersArr2018Q3 = require('./users2018Q3.json');

const selectSession = document.querySelector('.select-session');
const tenUsers = [];
const Q = _.intersectionWith(_.map(usersArr2018Q1, 'displayName'), _.map(usersArr2018Q3, 'displayName'));
let currentSession = sessionFirst2018Q3;
let headerNamesArr = [];

const findUsersArr2018Q = (user) => {
  const arr = [];
  for (let i = 0; i < Q.length; i += 1) {
    arr.push(_.find(user, _.matchesProperty('displayName', Q[i])));
  }
  return arr;
};

const main = document.createElement('main');
document.body.appendChild(main);
main.classList.add('main');

const table = document.createElement('table');
main.appendChild(table);
table.classList.add('table');

const caption = document.createElement('caption');
table.appendChild(caption);
caption.classList.add('caption');
caption.textContent = 'CSS Quick Draw Scoreboard';

const thead = document.createElement('tr');
table.appendChild(thead);
thead.classList.add('tr');

const tbody = document.createElement('tbody');
table.appendChild(tbody);

function fillTHead(session) {
  headerNamesArr.push('Participant displayName');
  for (let i = 0; i < session.puzzles.length; i += 1) {
    headerNamesArr.push(session.puzzles[i].name);
  }
  headerNamesArr.push('Total time');
  headerNamesArr.push('Comparison');
  for (let i = 0; i < headerNamesArr.length; i += 1) {
    const th = document.createElement('th');
    thead.appendChild(th);
    th.classList.add('th');
    th.textContent = `${headerNamesArr[i]}`;
  }
}

fillTHead(currentSession);

function createRowArr(session, users, index) {
  const rowArr = [];
  rowArr.push([users[index].displayName]);
  for (let i = 0; i < session.puzzles.length; i += 1) {
    if (session.rounds[i].solutions[users[index].uid] === undefined) {
      rowArr.push([150]);
    } else {
      rowArr.push([session.rounds[i].solutions[users[index].uid].time.$numberLong,
        session.rounds[i].solutions[users[index].uid].code]);
    }
  }
  rowArr.push([rowArr.slice(1).reduce((sum, curr) => sum + +curr[0], 0)]);
  return rowArr;
}

function createTBody(session, users) {
  if (!_.isEmpty(session.participants)) {
    for (let j = 0; j < users.length; j += 1) {
      const tr = document.createElement('tr');
      tr.classList.add('tr');
      tbody.appendChild(tr);
      const currentRow = createRowArr(session, users, j);
      for (let i = 0; i < headerNamesArr.length; i += 1) {
        const td = document.createElement('td');
        if (currentRow[i] !== undefined) {
          const score = currentRow[i][0];
          td.innerHTML = score;
          const span = document.createElement('span');
          if (currentRow[i][1] !== undefined && currentRow[i][1] !== '') {
            const solution = currentRow[i][1];
            span.textContent = solution;
          } else span.textContent = 'no solution';
          if (i !== 0 && i !== headerNamesArr.length - 2) {
            span.classList.add('tooltiptext');
            td.appendChild(span);
          }
        } else if (currentRow[i] === undefined) {
          const input = document.createElement('input');
          input.type = 'checkbox';
          input.name = 'user';
          const nickname = currentRow[0][0];
          input.value = nickname;
          td.appendChild(input);
        }
        tr.appendChild(td);
        td.classList.add('td');
      }
    }
  } else {
    tbody.textContent = 'Sorry, this session is empty...';
  }
}

createTBody(currentSession, usersArr2018Q3);

function createTBodyVS() {
  for (let j = 0; j < findUsersArr2018Q().length; j += 1) {
    const tr = document.createElement('tr');
    tr.classList.add('tr');
    tbody.appendChild(tr);
    const currentRow = createRowArr(sessionFirst2018Q1, findUsersArr2018Q(usersArr2018Q1), j);
    const currentRow2 = createRowArr(sessionFirst2018Q3, findUsersArr2018Q(usersArr2018Q3), j);
    const td = document.createElement('td');
    td.innerHTML = `${currentRow[0]}`;
    tr.appendChild(td);
    td.classList.add('td');
    const td2 = document.createElement('td');
    td2.innerHTML = `${currentRow[11]}`;
    tr.appendChild(td2);
    td2.classList.add('td');
    const td3 = document.createElement('td');
    td3.innerHTML = `${currentRow2[11]}`;
    tr.appendChild(td3);
    td3.classList.add('td');
  }
}

selectSession.addEventListener('click', (e) => {
  if (e.target.name === 'session') {
    switch (e.target.value) {
      case 'rsschool':
        currentSession = sessionFirst2018Q3;
        thead.innerHTML = '';
        tbody.innerHTML = '';
        document.getElementById('myChart').style.visibility = 'hidden';
        headerNamesArr = [];
        fillTHead(currentSession);
        createTBody(currentSession, usersArr2018Q3);
        break;
      case 'rsschool-demo':
        currentSession = sessionSecond2018Q3;
        thead.innerHTML = '';
        tbody.innerHTML = '';
        document.getElementById('myChart').style.visibility = 'hidden';
        headerNamesArr = [];
        fillTHead(currentSession);
        createTBody(currentSession, usersArr2018Q3);
        break;
      case 'vs':
        thead.innerHTML = '';
        tbody.innerHTML = '';
        document.getElementById('myChart').style.visibility = 'hidden';
        headerNamesArr = [];
        headerNamesArr.push('Participant displayName');
        headerNamesArr.push('Total time Q1');
        headerNamesArr.push('Total time Q3');
        for (let i = 0; i < headerNamesArr.length; i += 1) {
          const th = document.createElement('th');
          thead.appendChild(th);
          th.classList.add('th');
          th.textContent = `${headerNamesArr[i]}`;
        }
        createTBodyVS();
        break;
      default: break;
    }
  }
});

tbody.addEventListener('click', (e) => {
  if (e.target.name === 'user') {
    document.getElementById('myChart').style.visibility = 'visible';
    if (tenUsers.length < 10) {
      tenUsers.length = 0;
      for (let k = 0; k < usersArr2018Q3.length; k += 1) {
        if (table.querySelectorAll('input[name="user"]')[k].checked === true) {
          tenUsers.push(createRowArr(currentSession, usersArr2018Q3, k));
        }
      }
    } else if (e.target.checked === true) {
      e.target.checked = false;
    } else if (e.target.checked === false) {
      tenUsers.length -= 1;
    }
  }

  function setLineObj(user) {
    return {
      label: user[0][0],
      data: user.slice(1, 11).map(n => n[0]),
      fill: false,
      borderColor: `rgb(${_.random(0, 244)},${_.random(0, 244)},${_.random(0, 244)})`,
      trancition: 0.1,
    };
  }

  const datasets = _.map(tenUsers, setLineObj);
  const ctx = document.getElementById('myChart');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: _.map(currentSession.puzzles, 'name'),
      datasets,
    },
    options: {
      title: {
        display: true,
        text: 'Line chart of students progress',
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          },
        }],
      },
    },
  });
});
