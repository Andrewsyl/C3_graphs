$.getJSON('http://localhost:5000/ftrack/projects', function(mongodata) {

    function compare(a,b) {
      if (a.shot < b.shot)
        return -1;
      if (a.shot > b.shot)
        return 1;
      return 0;
    }
    mongodata.sort(compare)

    //MN107 Lists being populated
    var MN_start_time_diff = ['Start/Completed']
    var MN_end_time_diff = ['Completed/End']
    var MN_locked_time = ['Due Date']
    var MN_completed_date = ['Completed']
    var MN_shots = []
    var MN_started_time = ['Started']

    //RBA111 Lists being populated
    var RBA_start_time_diff = ['Start/Completed']
    var RBA_end_time_diff = ['Completed/End']
    var RBA_locked_time = ['Due Date']
    var RBA_completed_date = ['Completed']
    var RBA_shots = []
    var RBA_started_time = ['Started']


    for (i = 0; i < mongodata.length; i++) {
        if (mongodata[i]['project'] == 'MN107') {
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
        else if (mongodata[i]['project'] == 'RBA111') {
            if (mongodata[i]['start_completed_difference'] != null) {
                RBA_start_time_diff.push((mongodata[i]['start_completed_difference']).split(',')[0])
            } else {
                RBA_start_time_diff.push(null)
            };
            RBA_end_time_diff.push((mongodata[i]['completed_locked_difference']).split(',')[0])
            RBA_locked_time.push(mongodata[i]['locked_schedule_date'].slice(0, 10))
            RBA_completed_date.push(mongodata[i]['completed_date'].slice(0, 10))
            RBA_shots.push(mongodata[i]['shot'])
            if (mongodata[i]['start_date'] != null) {
                RBA_started_time.push(mongodata[i]['start_date'].slice(0, 10))
            } else {
                RBA_started_time.push(null)
            };
        };
    };

    var chart = c3.generate({
        bindto: '#chart',
        size: {
            height: RBA_shots.length * 15,
        },
        data: {
            order: null,
            xFormat: '%Y-%m-%d',
            columns: [
                RBA_start_time_diff,
                RBA_end_time_diff,
            ],
            type: 'bar',
            colors: {
                'Completed/End': function(d) {
                    return d.value < 0 ? '#1da31d' : '#ff7f0e';
                }
            },
        },
        tooltip: {
            format: {},
            contents: function(d, defaultTitleFormat, defaultValueFormat, color) {
                var $$ = this,
                    config = $$.config,
                    titleFormat = config.tooltip_format_title || defaultTitleFormat,
                    nameFormat = config.tooltip_format_name || function(name) {
                        return name;
                    },
                    valueFormat = config.tooltip_format_value || defaultValueFormat,
                    text, i, title, value, name, bgcolor;
                for (i = 0; i < d.length; i++) {
                    if (!(d[i] && (d[i].value || d[i].value === 0))) {
                        continue;
                    }

                    if (!text) {
                        title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                        text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                    }

                    name = nameFormat(d[i].name);
                    value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                    bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);

                    text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                    text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                    text += "<td class='value'>" + value + "</td>";
                    text += "</tr>";
                }
                return text + "</table>";
            }
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
                categories: RBA_shots,
                lines: [{
                    value: 0
                }]
            },
            y: {
                type: 'category',
                tick: {
                },
            },
        }
    });


    setTimeout(function() {
        chart.groups([
            ['Start/Completed', 'Completed/End']
        ])
    }, 2000);


    $("#rba").click(function(){
        setTimeout(function() {
        chart.resize({height:MN_shots.length *15})
        chart.load({
            columns: [
                MN_start_time_diff,
                MN_end_time_diff,
            ],
            categories: MN_shots,
            unload: RBA_end_time_diff,RBA_start_time_diff,

                    MN_shots
        });
        }, 2000);
    });

});