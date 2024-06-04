// import Highcharts from 'highcharts';

// crimeCount should be a number, crimeCategoryFreq should be an object of category:count.
export function createCrimeFreqPie(crimeCount, crimeCategoryFreq) {
    const crimeFreqChartSeriesData = [];
    const onePercent = crimeCount / 100;

    for (const cat in crimeCategoryFreq) {
        crimeFreqChartSeriesData.push({
            name: cat,
            y: crimeCategoryFreq[cat] / onePercent,
        });
    }

    Highcharts.chart("crimeFreqContainer", {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: "pie",
        },
        title: {
            text: "",
        },
        tooltip: {
            pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
        },
        accessibility: {
            point: {
                valueSuffix: "%",
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: "pointer",
                dataLabels: {
                    enabled: true,
                    format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                },
            },
        },
        series: [
            {
                name: "Crime Frequency",
                colorByPoint: true,
                data: crimeFreqChartSeriesData,
            },
        ],
    });
}
