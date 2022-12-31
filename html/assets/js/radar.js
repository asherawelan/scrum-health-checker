export class Radar {

    constructor(data) {
        let that = this;
        $(data).on('change', function() {
            that.update();
        });

        this.data = data;
    }


    /**
     * Returns an array of labels from the data that can be used
     * by the chart
     * @returns {*[]}
     */
    createLabels() {
        let labels = Object.values(this.data.getSections()).map(function (value) {
            return value.title;
        });

        return labels;
    }

    /**
     * Returns an array of values from the list item check box states
     * by section, that can be plotted on the chart
     * @returns {*[]}
     */
    createData() {
        let data = Object.values(this.data.getSections()).map(function (value) {
            let values = Object.values(value.questions).map(function (question) {
                return question['checked'];
            });

            return values.filter(function (value) {
                return value == true;
            }).length;
        });

        return data;
    }

    /**
     * Updates the chart
     */
    update() {
        this.chart.data.datasets[0].data = this.createData();
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
                labels: this.createLabels(),
                datasets: [
                    {
                        label: 'Actual',
                        fill: true,
                        backgroundColor: 'rgba(179,181,198,0.2)',
                        borderColor: 'rgba(179,181,198,1)',
                        pointBorderColor: '#fff',
                        pointBackgroundColor: 'rgba(179,181,198,1)',
                        data: this.createData()
                    }, {
                        label: 'Ideal',
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
                title: {
                    display: true,
                    text: 'Test Title'
                },
                scale: {
                    min: 0,
                    max: 10,
                    ticks: {
                        beginAtZero: true,
                        fontSize: 20,
                        gridLines: {
                            color: 'rgba(0, 0, 0, 0.2)'
                        },
                        angleLines: {
                            color: '#000'
                        }
                    }
                },
                scales: {
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