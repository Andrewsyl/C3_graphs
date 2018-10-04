$.getJSON('http://localhost:5000/ftrack/mn107/retakes', function(mongodata) {

    function compare(a, b) {
            if (a.episode < b.episode)
                return -1;
            if (a.episode > b.episode)
                return 1;
            return 0;
        }
    mongodata.sort(compare)

    var episodes = []
    var retakes = ['retakes']

    for (i = 0; i < mongodata.length; i++) {
        retakes.push(mongodata[i]['retakes'])
        episodes.push(mongodata[i]['episode'])
    }


    var chart = c3.generate({
        bindto: '#chart',
        size: {
                height: 700
        },
        data: {
            columns: [
                retakes
            ]
        },
        axis: {
            x: {
            tick: {
                rotate: 75,
                multiline: false
            },
                type: 'category',
                categories: episodes
            },
        }
    });
});