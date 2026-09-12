const btnCalcul = document.getElementById('calcul');
const result = document.getElementById('result');
const tabResult = document.getElementById('tab');
const graphContainer = document.getElementById('futureValueChart');
let graph;

const currencyFormat = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

const graphSize = () => ({
  width: graphContainer.clientWidth,
  height: 360,
});

new ResizeObserver(() => {
  if (graph && graphContainer.clientWidth > 0) {
    graph.setSize(graphSize());
  }
}).observe(graphContainer);

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
  // uPlot attend [abscisses, valeurs de la série 1, valeurs de la série 2].
  // Chaque tableau doit avoir la même longueur ; la période 0 est le capital initial.
  const periods = dataValue.map((_, index) => index);
  const data = [periods, dataValue, dataInterestPart];

  if (graph) {
    graph.setData(data);
    return;
  }

  graph = new uPlot({
    title: 'Évolution du capital',
    ...graphSize(),
    scales: {
      x: {
        time: false, // Les abscisses sont des périodes, pas des dates.
        range: (_, min, max) => [min, max > min ? max : min + 1],
      },
    },
    series: [
      { label: 'Période', value: (_, value) => value == null ? '—' : String(value) },
      {
        label: 'Valeur du capital',
        stroke: '#8e5ea2',
        width: 2,
        fill: 'rgba(142, 94, 162, 0.1)',
        value: (_, value) => value == null ? '—' : currencyFormat.format(value),
      },
      {
        label: 'Intérêts de la période',
        stroke: '#3e95cd',
        width: 2,
        value: (_, value) => value == null ? '—' : currencyFormat.format(value),
      },
    ],
    axes: [
      {
        label: 'Période',
        values: (_, ticks) => ticks.map((value) => Number.isInteger(value) ? String(value) : ''),
        grid: { show: false },
      },
      {
        size: 90,
        values: (_, ticks) => ticks.map((value) => new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(value)),
        grid: { stroke: '#e5e7eb', width: 1 },
      },
    ],
  }, data, graphContainer);
};

const detailFutureValue = (presentValue, period, interest) => {
  let value = presentValue;
  const dataInterestPart = [0];
  const dataValue = [presentValue];
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
  const periodInput = document.getElementById('period');
  const period = periodInput.valueAsNumber;
  let interest = parseFloat(document.getElementById('interest').value);

  if (!Number.isFinite(presentValue) || !Number.isInteger(period) || period < 0 || !Number.isFinite(interest)) {
    result.textContent = 'Saisissez un capital, un taux et un nombre entier de périodes supérieur ou égal à 0.';
    return;
  }
  interest = toPerCent(interest);

  if (!Number.isFinite(presentValue * Math.pow(1 + interest, period))) {
    result.textContent = 'Le résultat dépasse la capacité de calcul. Réduisez les valeurs saisies.';
    return;
  }

  futureValue(presentValue, period, interest);
  detailFutureValue(presentValue, period, interest);
});
