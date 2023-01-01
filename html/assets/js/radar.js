export class Radar {

    constructor(data) {
        let that = this;

        $(data).on('change', function () {
            that.update();
        });

        this.data = data;
    }

    /**
     * Returns an array of labels from the data that can be used
     * by the chart
     * @returns {*[]}
     */
    labels() {
        return Object.values(this.data.getSections()).map(function (value) {
            return value.title;
        });
    }

    /**
     * Returns an array of values from the list item check box states
     * by section, that can be plotted on the chart
     * @returns {*[]}
     */
    values() {
        return Object.values(this.data.getSections()).map(function (value) {
            let values = Object.values(value.questions).map(function (question) {
                return question['checked'];
            });

            return values.filter(function (value) {
                return value == true;
            }).length;
        });
    }

    /**
     * Updates the chart
     */
    update() {
        this.chart.data.datasets[0].data = this.values();
        this.chart.update();
    }

    /**
     * Renders the chart
     */
    render() {
        this.chart = new Chart(
            $('#spiderChart'), {
                type: 'radar',
                data: {
                    labels: this.labels(),
                    datasets: [
                        {
                            label: 'Today',
                            fill: true,
                            backgroundColor: 'rgba(179,181,198,0.2)',
                            borderColor: 'rgba(179,181,198,1)',
                            pointBorderColor: '#fff',
                            pointBackgroundColor: 'rgba(179,181,198,1)',
                            data: this.values()
                        }, {
                            label: 'Goal',
                            fill: true,
                            backgroundColor: 'rgba(255,99,132,0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            pointBorderColor: '#fff',
                            pointBackgroundColor: 'rgba(255,99,132,1)',
                            data: [7, 7, 7, 7, 7, 7, 7, 7, 7]
                        }
                    ]
                },
                options: {
                    maintainAspectRatio: true,
                    aspectRatio: 1.3,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Agile Scrum Health Check',
                            font: {
                                size: 30
                            },
                            padding: {
                                top: 30,
                                bottom: 10
                            }
                        },
                        subtitle: {
                            display: true,
                            text: 'Team Pegasus',
                            font: {
                                size: 22
                            },
                            padding: {
                                top: 10,
                                bottom: 50
                            }
                        },
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                color: '#000',
                                padding: 30
                            }
                        }
                    },
                    scale: {
                        min: 0,
                        max: 10,
                        ticks: {
                            beginAtZero: true,
                            fontSize: 16,
                            gridLines: {
                                color: 'rgba(0, 0, 0, 0.2)'
                            },
                            angleLines: {
                                color: '#000'
                            }
                        }
                    },
                    scales: {
                        yAxes: [{
                            position: 'top'
                        }],
                        r: {
                            pointLabels: {
                                font: {
                                    size: 18
                                }
                            }
                        }
                    }
                }
            });
    }
}