var generate_buttons = true;

function main(episode) {

    $.getJSON('http://localhost:5000/ftrack/projects', function(mongodata) {

        // Function to sort by shot.
        function compare(a, b) {
            if (a.shot < b.shot)
                return -1;
            if (a.shot > b.shot)
                return 1;
            return 0;
        }
        mongodata.sort(compare)

        //MN107 Lists being populated
        var MN_start_time_diff = ['Started to Completed']
        var MN_end_time_diff = ['Completed to Locked Schedule']
        var MN_locked_time = ['Due Date']
        var MN_completed_date = ['Completed']
        var MN_shots = []
        var MN_started_time = ['Started']
        var eps = []

        // Grabs URL and takes the episode number at the end. Then uses it to filter data by episode below
        episode = (window.location.href)
        episode = episode.split('/')
        episode = episode[episode.length -1]

        // Loops through mongodb data by project and episode. Builds arrays of dates, shots, time deltas.
        for (i = 0; i < mongodata.length; i++) {
            if (mongodata[i]['episode'] == episode && mongodata[i]['project'] == 'MN107') {
                if (mongodata[i]['start_completed_difference'] != null) {
                    MN_start_time_diff.push((mongodata[i]['start_completed_difference']).split(',')[0])
                } else {
                    MN_start_time_diff.push(null)
                };
                MN_end_time_diff.push((mongodata[i]['completed_locked_difference']).split(',')[0])
                MN_locked_time.push(mongodata[i]['locked_schedule_date'].slice(0, 10))
                MN_completed_date.push(mongodata[i]['completed_date'].slice(0, 10))
                MN_shots.push(mongodata[i]['shot'])
                if (mongodata[i]['start_date'] != null) {
                    MN_started_time.push(mongodata[i]['start_date'].slice(0, 10))
                } else {
                    MN_started_time.push(null)
                };
            }
        };
        for (i = 0; i < mongodata.length; i++) {
            if (mongodata[i]['project'] == 'MN107') {
                if (!(eps.includes(mongodata[i]['episode']))) {
                    eps.push(mongodata[i]['episode'])
                };
            };
        };
        eps.sort()
        if (generate_buttons) {
            for (i = 0; i < eps.length; i++) {
                var btn = $("<button/>");
                $('#test').append('<a href="' + eps[i] + '"><button class="btn btn-info" value="' + eps[i] + '">' + eps[i] + '</button></a> ');

                generate_buttons = false;
            }
        }

        $("button").click(function() {
            var episode = $(this).val();
            //            main(episode)
        });
        if (MN_shots.length > 100) {
            height = MN_shots.length * 9
        } else {
            height = MN_shots.length * 50
        }
        var chart = c3.generate({
            bindto: '#chart',
            size: {
                height: height
            },
            title: {
                text:'Episode: ' + episode,
                padding: {
                  top: 10,
                  right: 20,
                  bottom: 25,
                  left: 50
                }
            },
            tooltip: {
                format: {},
                contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
                    var dent = d.length

                    d.push({
                        id: 'Completed Date',
                        value: MN_locked_time[d[0].index + 1]
                    });
                    d.push({
                        id: 'Locked Date',
                        value: MN_completed_date[d[0].index + 1],
                    })

                    var $$ = this,
                        config = $$.config,
                        titleFormat = config.tooltip_format_title || defaultTitleFormat,
                        nameFormat = config.tooltip_format_name || function(name) {
                            return name;
                        },
                        valueFormat = config.tooltip_format_value || defaultValueFormat,
                        text, i, title, value, name, bgcolor;
                    for (i = 0; i < d.length; i++) {
                        if (!text) {
                            title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                            text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                        }

                        name = nameFormat(d[i].name);
                        value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                        if (!value) {
                            value = d[i].value
                        }
                        bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

                        text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                        if (name == 'Completed to Locked Schedule' && d[i].value > 0) {
                            text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + 'OverDue' + "</td>";
                        } else if ((name === 'Completed to Locked Schedule' && d[i].value < 0)) {
                            text += "<td class='name'><span style='background-color:" + '#1da31d' + "'></span>" + 'On Time' + "</td>";
                        }
                        else {
                            text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + d[i].id + "</td>";
                        }
                        if (value){
                            var thing = value.toString()
                            if ( thing.indexOf('-') > 0) {
                                value = dateformater(value)
                                text += "<td class='value'>" + value + "</td>";
                            } else {
                                text += "<td class='value'>" + value + " days</td>";
                            }
                        } else {
                            value = 'No Data'
                            text += "<td class='value'>" + value + "</td>";
                        }
                        text += "</tr>";
                    }
                    return text + "</table>";
                }
            },
            data: {
                order: null,
                xFormat: '%Y-%m-%d',
                columns: [
                    MN_start_time_diff,
                    MN_end_time_diff,
                ],
                type: 'bar',
                colors: {
                    'Completed to Locked Schedule': function(d) {
                        return d.value < 0 ? '#1da31d' : '#ff4747';
                    }
                },
            },
            grid: {
                y: {
                    lines: [{
                        value: 0
                    }]
                }
            },
            axis: {
                rotated: true,
                x: {
                    type: 'category',
                    categories: MN_shots,
                    lines: [{
                        value: 0
                    }]
                },
                y: {
                    type: 'category',
                    tick: {},
                },
            }
        });


        setTimeout(function() {
            chart.groups([
                ['Started to Completed', 'Completed to Locked Schedule']
            ])
        }, 1000);


    });
}

function dateformater(value) {
    value = value.split('-')
    value = value.reverse()
    value = value.join('/')
    return value
}
main()