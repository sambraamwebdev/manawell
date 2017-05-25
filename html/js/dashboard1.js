var data;
var originalCSVData = "";
var dataTable = {};
var chart = {};
var prevPoint = -1;
var indexes = [];

function getDataFromCSV() {
    $.toast({
        heading: 'Loading...',
        text: 'Reading Data from CSV File',
        position: 'top-right',
        loaderBg: '#fb4',
        bgColor: '#7ace4c',
        textColor: 'white',
        hideAfter: 2000,
        stack: 6
    });

    $.ajax({
        type: "GET",
        url: "data/Sales_data_RETAIL_raw_v3.csv",
        dataType: "text",
        async: false,
        success: function(res) {
            originalCSVData = res;
            refreshPage();
        },
        error: function(res) {
        }
     });
}

function refreshPage() {
    data = convertCSVTextToJSON(originalCSVData);

    buildTableWithData(" ", 0);
    drawChart();
}

var salesLocationArray = [" "];
function convertCSVTextToJSON(str) {
    var lines = str.split(/\r\n|\n/);
    var result = [];
    var operatorIDArray = [];
    salesLocationArray = [" "];

    for (var i = 1; i < lines.length; i++) {
        var values = lines[i].split(',');
        var tmp = {
            index: parseInt(values[0]),
            beverageTransaction: parseInt(values[1]),
            curSales: parseFloat(values[2]),
            dtmSaleDatetime: values[3],
            foodTransaction: parseInt(values[4]),
            intOperatorID: values[5],
            totalItems: parseInt(values[6]),
            operatorName: values[7],
            salesLocation: values[8],
            timeConDouble: parseInt(values[9]),
            timeConMultiple: parseInt(values[10]),
            timeConSingle: parseInt(values[11]),    
            transCountTotal: parseInt(values[12]),
            transCountDouble: parseInt(values[13]),
            transCountMultiple: parseInt(values[14]),
            transCountSingle: parseInt(values[15]),
            upsaleTransaction: parseInt(values[16])
        }

        if (!tmp.salesLocation) continue;
    
        var startDate = new Date($("#start-date").val());
        var endDate = new Date($("#end-date").val());
        var curDate = new Date(tmp.dtmSaleDatetime);
        
        var intOperatorID = tmp.intOperatorID;
        var chosen_location = $("#sales-location-filter").val();
        
        if (curDate < startDate || curDate > endDate) {
            continue;
        }

        if (!result[intOperatorID]) {
            result[intOperatorID] = {};
        }

        if (!result[intOperatorID][" "]) {
            result[intOperatorID][" "] = {
                index: intOperatorID,
                customers: 0,
                beverageTransaction: 0,
                foodTransaction: 0,
                upsaleTransaction: 0.,
                upsalePercent: 0.00,
                totalItems: 0,
                sale_pr_kvito: 0.00,
                transCountSingle: 0,
                transCountMultiple: 0,
                transCountDouble: 0,
                username: "",
                curSales: 0,
                timeConSingle: 0,
                timeConDouble: 0,
                timeConMultiple: 0,
                time_pr_customer_single: 0.00,
                time_pr_customer_double: 0.00,
                time_pr_customer_multiple: 0.00,
                items_pr_transaction : 0.00
            };
        }

        if (!result[intOperatorID][tmp.salesLocation]) {
            result[intOperatorID][tmp.salesLocation] = {
                index: intOperatorID,
                customers: 0,
                beverageTransaction: 0,
                foodTransaction: 0,
                upsaleTransaction: 0.,
                upsalePercent: 0.00,
                totalItems: 0,
                sale_pr_kvito: 0.00,
                transCountSingle: 0,
                transCountMultiple: 0,
                transCountDouble: 0,
                username: "",
                curSales: 0,
                timeConSingle: 0,
                timeConDouble: 0,
                timeConMultiple: 0,
                time_pr_customer_single: 0.00,
                time_pr_customer_double: 0.00,
                time_pr_customer_multiple: 0.00,
                items_pr_transaction : 0.00
            };
        }

        ///////////// individual location ///////////////////////////
        result[intOperatorID][tmp.salesLocation].username = tmp.operatorName;
        result[intOperatorID][tmp.salesLocation].beverageTransaction += tmp.beverageTransaction;
        result[intOperatorID][tmp.salesLocation].foodTransaction += tmp.foodTransaction;
        result[intOperatorID][tmp.salesLocation].upsaleTransaction += tmp.upsaleTransaction;
        result[intOperatorID][tmp.salesLocation].customers += tmp.transCountTotal;
        result[intOperatorID][tmp.salesLocation].timeConSingle += tmp.timeConSingle;
        result[intOperatorID][tmp.salesLocation].timeConDouble += tmp.timeConDouble;
        result[intOperatorID][tmp.salesLocation].timeConMultiple += tmp.timeConMultiple;
        result[intOperatorID][tmp.salesLocation].transCountSingle += tmp.transCountSingle;
        result[intOperatorID][tmp.salesLocation].transCountDouble += tmp.transCountDouble;
        result[intOperatorID][tmp.salesLocation].transCountMultiple += tmp.transCountMultiple;
        result[intOperatorID][tmp.salesLocation].curSales += tmp.curSales;
        result[intOperatorID][tmp.salesLocation].totalItems += tmp.totalItems;
        result[intOperatorID][tmp.salesLocation].sale_pr_kvito = result[intOperatorID][tmp.salesLocation].customers == 0 ? '0.00' : parseFloat(result[intOperatorID][tmp.salesLocation].curSales / result[intOperatorID][tmp.salesLocation].customers).toFixed(2);
        result[intOperatorID][tmp.salesLocation].upsalePercent = result[intOperatorID][tmp.salesLocation].foodTransaction == 0 ? '0.00' : parseFloat(result[intOperatorID][tmp.salesLocation].upsaleTransaction / result[intOperatorID][tmp.salesLocation].foodTransaction * 100).toFixed(2);
        result[intOperatorID][tmp.salesLocation].time_pr_customer_single = result[intOperatorID][tmp.salesLocation].transCountSingle == 0 ? '0.00' : parseFloat(result[intOperatorID][tmp.salesLocation].timeConSingle / result[intOperatorID][tmp.salesLocation].transCountSingle).toFixed(2);
        result[intOperatorID][tmp.salesLocation].time_pr_customer_double = result[intOperatorID][tmp.salesLocation].transCountDouble == 0 ? '0.00' : parseFloat(result[intOperatorID][tmp.salesLocation].timeConDouble / result[intOperatorID][tmp.salesLocation].transCountDouble).toFixed(2);
        result[intOperatorID][tmp.salesLocation].time_pr_customer_multiple = result[intOperatorID][tmp.salesLocation].transCountMultiple == 0 ? '0.00' : parseFloat(result[intOperatorID][tmp.salesLocation].timeConMultiple / result[intOperatorID][tmp.salesLocation].transCountMultiple).toFixed(2);
        result[intOperatorID][tmp.salesLocation].items_pr_transaction = result[intOperatorID][tmp.salesLocation].customers == 0 ? '0.00' : parseFloat(result[intOperatorID][tmp.salesLocation].totalItems / result[intOperatorID][tmp.salesLocation].customers).toFixed(2);        

        /////////////////////////////// all //////////////////
        result[intOperatorID][" "].username = tmp.operatorName;
        result[intOperatorID][" "].beverageTransaction += tmp.beverageTransaction;
        result[intOperatorID][" "].foodTransaction += tmp.foodTransaction;
        result[intOperatorID][" "].upsaleTransaction += tmp.upsaleTransaction;
        result[intOperatorID][" "].customers += tmp.transCountTotal;
        result[intOperatorID][" "].timeConSingle += tmp.timeConSingle;
        result[intOperatorID][" "].timeConDouble += tmp.timeConDouble;
        result[intOperatorID][" "].timeConMultiple += tmp.timeConMultiple;
        result[intOperatorID][" "].transCountSingle += tmp.transCountSingle;
        result[intOperatorID][" "].transCountDouble += tmp.transCountDouble;
        result[intOperatorID][" "].transCountMultiple += tmp.transCountMultiple;
        result[intOperatorID][" "].curSales += tmp.curSales;
        result[intOperatorID][" "].totalItems += tmp.totalItems;        
        result[intOperatorID][" "].sale_pr_kvito = result[intOperatorID][" "].customers == 0 ? '0.00' : parseFloat(result[intOperatorID][" "].curSales / result[intOperatorID][" "].customers).toFixed(2);
        result[intOperatorID][" "].upsalePercent = result[intOperatorID][" "].foodTransaction == 0 ? '0.00' : parseFloat(result[intOperatorID][" "].upsaleTransaction / result[intOperatorID][" "].foodTransaction * 100).toFixed(2);
        result[intOperatorID][" "].time_pr_customer_single = result[intOperatorID][" "].transCountSingle == 0 ? '0.00' : parseFloat(result[intOperatorID][" "].timeConSingle / result[intOperatorID][" "].transCountSingle).toFixed(2);
        result[intOperatorID][" "].time_pr_customer_double = result[intOperatorID][" "].transCountDouble == 0 ? '0.00' : parseFloat(result[intOperatorID][" "].timeConDouble / result[intOperatorID][" "].transCountDouble).toFixed(2);
        result[intOperatorID][" "].time_pr_customer_multiple = result[intOperatorID][" "].transCountMultiple == 0 ? '0.00' : parseFloat(result[intOperatorID][" "].timeConMultiple / result[intOperatorID][" "].transCountMultiple).toFixed(2);
        result[intOperatorID][" "].items_pr_transaction = result[intOperatorID][" "].customers == 0 ? '0.00' : parseFloat(result[intOperatorID][" "].totalItems / result[intOperatorID][" "].customers).toFixed(2);        

        if (operatorIDArray.indexOf(intOperatorID) == -1) {
            operatorIDArray.push(intOperatorID);
        }

        if (salesLocationArray.indexOf(tmp.salesLocation) == -1) {
            salesLocationArray.push(tmp.salesLocation);
        }
    }

    var returnData = [];
    for (var i = 0; i < operatorIDArray.length; i++) {
        returnData.push(result[operatorIDArray[i]]);
    }
    
    return returnData;
}       

function buildTableWithData(location, customerLimit) {
    var html = `
    <table class="table table-condensed table-hover" id="sale-table">
        <thead>
            <tr>
                <th class="text-center">#</th>
                <th class="text-left">Name</th>
                <th class="text-center number">Total Transactions</th>
                <!--<th class="text-center number">Beverage Transactions</th>-->
                <th class="text-center number">Food Transactions</th>
                <!--<th class="text-center number">Upsale Transactions</th>-->
                <th class="text-center number">Beverage Upsale [%]</th>
                <th class="text-center number">Revenue/Transaction [SEK]</th>
                <th class="text-center number">Items/Transaction</th>
                <th class="text-center number">Time/Single transactions [s]</th>
                <th class="text-center number">Time/Double transactions [s]</th>
                <th class="text-center number">Time/Multi transactions [s]</th>
            </tr>
        </thead>
    `;

    var customersMean = 0;
    var foodTransactionMean = 0;
    var upsalePercenteMean = 0;
    var sale_pr_kvito_mean = 0;
    var items_pr_transaction_mean = 0;
    var time_pr_customer_single_mean = 0;
    var time_pr_customer_double_mean = 0;
    var time_pr_customer_multiple_mean = 0;
    var count = 0;

    for (var i = 0 ; i < data.length; i++) {
        var item = data[i];

        if (!item[location] || !item[location].username || customerLimit > item[location].customers) continue;

        count++;
        customersMean += item[location].customers;
        foodTransactionMean += parseFloat(item[location].foodTransaction);
        upsalePercenteMean += parseFloat(item[location].upsalePercent);
        sale_pr_kvito_mean += parseFloat(item[location].sale_pr_kvito);
        items_pr_transaction_mean += parseFloat(item[location].items_pr_transaction);
        time_pr_customer_single_mean += parseFloat(item[location].time_pr_customer_single);
        time_pr_customer_double_mean += parseFloat(item[location].time_pr_customer_double);
        time_pr_customer_multiple_mean += parseFloat(item[location].time_pr_customer_multiple);

        html += 
        `   <tr>
                <td class="text-center p-l-10">${i+1}</td>
                <td class="text-left">${item[location].username}</td>
                <td class="text-center">${item[location].customers}</td>
                <td class="text-center">${item[location].foodTransaction}</td>
                <td class="text-center">${item[location].upsalePercent}</td>
                <td class="text-center">${item[location].sale_pr_kvito}</td>
                <td class="text-center">${item[location].items_pr_transaction}</td>
                <td class="text-center">${item[location].time_pr_customer_single}</td>
                <td class="text-center">${item[location].time_pr_customer_double}</td>
                <td class="text-center">${item[location].time_pr_customer_multiple}</td>
            </tr>
        `;
    }

    customersMean = parseFloat(customersMean / count).toFixed(2);
    foodTransactionMean = parseFloat(foodTransactionMean / count).toFixed(2);
    upsalePercenteMean = parseFloat(upsalePercenteMean / count).toFixed(2);
    sale_pr_kvito_mean = parseFloat(sale_pr_kvito_mean / count).toFixed(2);
    items_pr_transaction_mean = parseFloat(items_pr_transaction_mean / count).toFixed(2);
    time_pr_customer_single_mean = parseFloat(time_pr_customer_single_mean / count).toFixed(2);
    time_pr_customer_double_mean = parseFloat(time_pr_customer_double_mean / count).toFixed(2);
    time_pr_customer_multiple_mean = parseFloat(time_pr_customer_multiple_mean / count).toFixed(2);

    html += `</tbody>
        <tfoot>
            <tr>
                <td class="text-center"></td>
                <td class="text-right">Mean Values</td>
                <td class="text-center number">${customersMean}</td>
                <td class="text-center number">${foodTransactionMean}</td>
                <td class="text-center number">${upsalePercenteMean}</td>
                <td class="text-center number">${sale_pr_kvito_mean}</td>
                <td class="text-center number">${items_pr_transaction_mean}</td>
                <td class="text-center number">${time_pr_customer_single_mean}</td>
                <td class="text-center number">${time_pr_customer_double_mean}</td>
                <td class="text-center number">${time_pr_customer_multiple_mean}</td>
            </tr>
        </tfoot>
    </table>`;
    $("#main-table").html(html);

    $("#main-table tr").click(function (e) {
        e.stopPropagation();
        unselectChartPoint(2);

        var index = parseInt(this.children[0].innerHTML) - 1;
        
        var newindex = indexes.indexOf(index);
        if (newindex != -1) {
            selectChartPoint(newindex);
        }
    });

    dataTable = $("#sale-table").DataTable();
    

    /////////////  Location Select Filter   ///////////////
    $("#sales-location-filter").html('');
    for (var i = 0; i < salesLocationArray.length; i++) {
        var option = document.createElement("option");
        option.value = salesLocationArray[i];
        option.text = salesLocationArray[i];
        if (option.value == location) {
            option.selected = "selected";
        }
        $("#sales-location-filter").append(option);
    }
} 


function drawChart() {
    console.log($("#sales-location-filter"))
    var location = $("#sales-location-filter").val() ? $("#sales-location-filter").val() : " ";
    var key = $("#filter").val();
    var chartdata = [];
    indexes = [];

    if (!$("#customer-filter").val()) {
        $("#customer-filter").val(0);
    }

    for (var i = 0; i < data.length; i++) {
        if (!data[i][location]) continue;
        if (parseFloat(data[i][location][key]) && parseFloat(data[i][location].customers) >= $("#customer-filter").val()) {
            chartdata.push(parseFloat(data[i][location][key]));
            indexes.push(i);
        }
    }

    var startDate = $("#start-date").val();
    var endDate = $("#end-date").val();

    var keyText = document.getElementById('filter').options[document.getElementById('filter').selectedIndex].text;

    chart = Highcharts.chart('sale-data', {
        chart: {
            type: 'column'
        },
        title: {
            text: ''
        },
        
        colors: ['rgb(86,156,208)'],
        
        subtitle: {
            text: `From ${startDate} to ${endDate}`
        },
        xAxis: {
            categories: chartdata.map( (item, index) => { return ""; } ),
            crosshair: true
        },
        yAxis: {
            min: '0',
            title: {
                text: keyText
            }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            backgroundColor: 'rgb(70,70,70)',
            borderColor: 'none',
            formatter: function() {
                var point = this.points[0].point;
                return `
                    <table class="tooltip-${point.index}">
                        <tr style="color: white">
                            <td class="text-right" style="padding-right:5px;">Name: </td>
                            <td style="padding:0"><b>${ data[indexes[point.index]][location].username }</b></td>
                        </tr>                        
                        <tr style="color: white">
                            <td class="text-right" style="padding-right:5px;">Transactions: </td>
                            <td style="padding:0"><b>${ data[indexes[point.index]][location].customers }</b></td>
                        </tr>                        
                        <tr style="color: white">
                            <td class="text-right" style="padding-right:5px;">${keyText }:</td>
                            <td style="padding:0"><b>${ data[indexes[point.index]][location][key] }</b></td>
                        </tr>    
                    </table>
                `;
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            },
            series: {
                point: {
                    events: {
                        click: function(e) {
                            e.stopPropagation();
                            var index = this.index;
                            dataTable.columns(0).search(`\\b${indexes[index]+1}\\b`, true, false).draw();
                            //dataTable.fnFilter("^"+'12'+"$", "#", true);
                            if (prevPoint != index) {
                                selectChartPoint(index);
                            } else {
                                unselectChartPoint(2);
                            }
                        }
                    }
                }                
            }
        },
        legend: false,
        series: [{
            name: keyText,
            data: chartdata
        }]
    });
}

function selectChartPoint(index) {
    if (prevPoint > -1) {
        chart.series[0].points[prevPoint].update({color: 'rgb(86,156,208)'}, true);
    }
    chart.series[0].points[index].update({color: 'black'}, true);;
    prevPoint = index;
}

function unselectChartPoint(type) {
    if (chart.series[0].points[prevPoint]) {
        chart.series[0].points[prevPoint].update({color: 'rgb(86,156,208)'}, true);
    }
    prevPoint = -1;
    if (type == 2) {
        dataTable.search('').columns().search('').draw();
    }
}
  
$(document).ready(function () {
     "use strict";

     $('.datepicker').datepicker();

     $("#filter").change(function() {
        unselectChartPoint(2);
        drawChart();
     });

     $(".date").change(function() {
        var startDate = new Date($("#start-date").val());
        var endDate = new Date($("#end-date").val());

        if (startDate > endDate) {
            $.toast({
                heading: 'Date Error',
                text: `End Date must be later than Start Date`,
                position: 'top-right',
                loader: false,
                icon: 'error',
                hideAfter: 6000,
                stack: 6
            });

            $(".date").addClass("validation-error");

            return;
        }

        $(".date").removeClass("validation-error");
        refreshPage();
     });

     $(document).click(function(e) {
        if (prevPoint == -1) {
            unselectChartPoint(1);
        } else {
            unselectChartPoint(2);
        }
     });

     getDataFromCSV();


    $("#customer-filter").change(function(e) {
        buildTableWithData($("#sales-location-filter").val(), this.value);
        drawChart();
    });

    $("#sales-location-filter").change(function(e) {
        buildTableWithData(this.value, $("#customer-filter").val());
        drawChart();
    })
 });
