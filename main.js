var btnCalcul = document.getElementById("calcul")
var result = document.getElementById("result")
var tabResult = document.getElementById("tab")

function toPerCent(number){
    var perCentNumber = number / 100
    return perCentNumber
}

function futureValue(presentValue, period, interest){
    var fv = presentValue*Math.pow((1+interest), period)
    fv = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(fv)

    result.innerHTML = fv
}

function buildHeadTab(displayInterest){
    var headTab = "<table>"
    headTab +=    "    <thead>"
    headTab +=    "        <tr>"
    headTab +=    "            <th>Période</th>"
    headTab +=    "            <th>Valeur</th>"
    headTab +=    "            <th>Part des intérêts (" + displayInterest + " ) </th>"
    headTab +=    "        </tr>"
    headTab +=    "    </thead>"
    headTab +=    "    <tbody>"

    return headTab
}

function buildBodyTab(value, time, interestPart){

    var bodyTab = "        <tr>"
    bodyTab +=    "            <td>" + time + "</td>"
    bodyTab +=    "            <td>" + value + "</td>"
    bodyTab +=    "            <td>" + interestPart + "</td>"
    bodyTab +=    "        </tr>"
    return bodyTab
}

function buildFootTab(){
    var footTab = "    </tbody>"
    footTab +=    "</table>"
    return footTab
}

function makeGraph(dataValue, dataInterestPart){
    console.log("DataValue : ", dataValue)
    console.log("DataInterest : ", dataInterestPart)
    var ctx = document.getElementById("futureValueChart").getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [1, 2, 3, 4, 5],
            datasets: [{ 
                label: "Part d'intérêts",
                type: "bar",
                data: dataInterestPart,
                backgroundColor: "rgba(62, 149, 205, 0.2)",
                borderColor: "#3e95cd",
                fill: false
              }, { 
                label: "Valeur du capital",
                data: dataValue,
                borderColor: "#8e5ea2",
                backgroundColor: "rgba(142, 94, 162, 0.4)",
                fill: false
              }
            ]
          },
          options: {
            title: {
              display: true,
              text: 'Evolution du capital'
            }
          }
    });
}

function detailFutureValue(presentValue, period, interest){
    var value = presentValue
    var dataInterestPart = []
    var dataValue = []
    var optionDisplayInterest = {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }
    var displayInterest = new Intl.NumberFormat('fr-FR', optionDisplayInterest).format(interest)
    var tab = buildHeadTab(displayInterest)
    var displayInitValue = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(presentValue)
    tab += buildBodyTab(displayInitValue, 0, 0)

    for(var i = 0; i < period; i++){
        var init = value
        value = value*(1+interest)
        interestPart = value - init
        dataInterestPart.push(interestPart)
        dataValue.push(value)

        var displayValue = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value)
        var displayInterestPart = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(interestPart)
        tab += buildBodyTab(displayValue, i+1, displayInterestPart)
    }

    tab += buildFootTab()
    tabResult.innerHTML = tab
    makeGraph(dataValue, dataInterestPart)
}

btnCalcul.addEventListener('click',(event) => {
    event.preventDefault()

    var presentValue = parseFloat(document.getElementById("present_value").value)
    var period = parseInt(document.getElementById("period").value)
    var interest = parseFloat(document.getElementById("interest").value)
    interest = toPerCent(interest)

    futureValue(presentValue, period, interest)
    detailFutureValue(presentValue, period, interest)
})
