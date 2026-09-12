const btnCalcul = document.getElementById('calcul');
const result = document.getElementById('result');
const tabResult = document.getElementById('tab');

const toPerCent = (number) => {
  const perCentNumber = number / 100;
  return perCentNumber;
};

const futureValue = (presentValue, period, interest) => {
  let fv = presentValue * Math.pow(1 + interest, period);
  fv = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(fv);

  result.innerHTML = fv;
};

const buildHeadTab = (displayInterest) => {
  let headTab = '<table>';
  headTab += '    <thead>';
  headTab += '        <tr>';
  headTab += '            <th>Période</th>';
  headTab += '            <th>Valeur</th>';
  headTab += '            <th>Part des intérêts (' + displayInterest + ' ) </th>';
  headTab += '        </tr>';
  headTab += '    </thead>';
  headTab += '    <tbody>';

  return headTab;
};

const buildBodyTab = (value, time, interestPart) => {
  let bodyTab = '        <tr>';
  bodyTab += '            <td>' + time + '</td>';
  bodyTab += '            <td>' + value + '</td>';
  bodyTab += '            <td>' + interestPart + '</td>';
  bodyTab += '        </tr>';
  return bodyTab;
};

const buildFootTab = () => {
  let footTab = '    </tbody>';
  footTab += '</table>';
  return footTab;
};

const makeGraph = (dataValue, dataInterestPart) => {
  console.log('DataValue : ', dataValue);
  console.log('DataInterest : ', dataInterestPart);
  const ctx = document.getElementById('futureValueChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: [1, 2, 3, 4, 5],
      datasets: [
        {
          label: "Part d'intérêts",
          type: 'bar',
          data: dataInterestPart,
          backgroundColor: 'rgba(62, 149, 205, 0.2)',
          borderColor: '#3e95cd',
          fill: false,
        },
        {
          label: 'Valeur du capital',
          data: dataValue,
          borderColor: '#8e5ea2',
          backgroundColor: 'rgba(142, 94, 162, 0.4)',
          fill: false,
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Évolution du capital',
      },
    },
  });
};

const detailFutureValue = (presentValue, period, interest) => {
  let value = presentValue;
  const dataInterestPart = [];
  const dataValue = [];
  const optionDisplayInterest = {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const displayInterest = new Intl.NumberFormat('fr-FR', optionDisplayInterest).format(interest);
  let tab = buildHeadTab(displayInterest);
  const displayInitValue = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(presentValue);
  tab += buildBodyTab(displayInitValue, 0, 0);

  for (let i = 0; i < period; i++) {
    const init = value;
    value = value * (1 + interest);
    const interestPart = value - init;
    dataInterestPart.push(interestPart);
    dataValue.push(value);

    const displayValue = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
    const displayInterestPart = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(interestPart);
    tab += buildBodyTab(displayValue, i + 1, displayInterestPart);
  }

  tab += buildFootTab();
  tabResult.innerHTML = tab;
  makeGraph(dataValue, dataInterestPart);
};

btnCalcul.addEventListener('click', (event) => {
  event.preventDefault();

  const presentValue = parseFloat(document.getElementById('present_value').value);
  const period = parseInt(document.getElementById('period').value);
  let interest = parseFloat(document.getElementById('interest').value);
  interest = toPerCent(interest);

  futureValue(presentValue, period, interest);
  detailFutureValue(presentValue, period, interest);
});
