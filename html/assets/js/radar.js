export class Radar {

    constructor(data) {
        $(data).on('change',  () => {
            this.updateValues();
            this.updateTitle();
        });

        this.data = data;
    }

    /**
     * Updates the chart title, with value from data object
     */
    updateTitle() {
        this.chart.options.plugins.title.text = this.data.team();
        this.chart.update();
    }

    /**
     * Updates the chart dataset with values from the data object
     */
    updateValues() {
        this.chart.data.datasets[0].data = this.values();
        this.chart.update();
    }

    /**
     * Returns an array of labels from the data that can be used
     * by the chart
     * @returns {*[]}
     */
    labels() {
        return Object.values(this.data.sections()).map(function (value) {
            return value.title;
        });
    }

    /**
     * Returns an array of values from the list item check box states
     * by section, that can be plotted on the chart
     * @returns {*[]}
     */
    values() {
        return Object.values(this.data.sections()).map(function (value) {
            let values = Object.values(value.questions).map(function (question) {
                return question['checked'];
            });

            return values.filter(function (value) {
                return value == true;
            }).length;
        });
    }

    /**
     * Returns a formatted date
     * @returns {string}
     */
    date() {
        return new Date().toLocaleDateString(
            'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }
        );
    }

    /**
     * Downloads the chart as a PNG
     */
    download() {
        const canvas = document.getElementById('radar');
        canvas.toBlob((blob) => {
            saveAs(blob, `${this.data.team()} - ${this.date()}.png`);
        });
    }

    /**
     * Renders the chart
     */
    render(callback) {
        const customCanvasBackgroundColor = {
            id: 'customCanvasBackgroundColor',
            beforeDraw: (chart, args, options) => {
                const {ctx} = chart;
                ctx.save();
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = options.color || '#99ffff';
                ctx.fillRect(0, 0, chart.width, chart.height);
                ctx.restore();
            }
        };

        this.chart = new Chart(
            $('canvas'), {
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
                    backgroundColor: '#fff',
                    maintainAspectRatio: true,
                    aspectRatio: 1.3,

                    layout: {
                        padding: {
                            bottom: 50
                        }
                    },

                    plugins: {
                        title: {
                            display: true,
                            text: this.data.team(),
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
                            text: `${this.date()}`,
                            font: {
                                size: 18,
                            },
                            padding: {
                                top: 10,
                                bottom: 60
                            }
                        },
                        legend: {
                            display: true,
                            position: 'bottom',
                            labels: {
                                color: '#000',
                                padding: 30
                            }
                        },
                        customCanvasBackgroundColor: {
                            color: 'white',
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
                        r: {
                            pointLabels: {
                                font: {
                                    size: 18
                                }
                            }
                        }
                    }
                },
                plugins: [customCanvasBackgroundColor],
            });

        callback(this);
    }
}