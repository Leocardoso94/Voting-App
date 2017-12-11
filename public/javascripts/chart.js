window.onload = function () {

    const { options } = poll;

    const randomBgColors = options.map(opt => {
        return "#" + Math.random().toString(16).slice(2, 8);
    });

    new Chart(document.getElementById("pie-chart"), {
        type: 'pie',
        data: {
            labels: options.map(opt => opt.name),
            datasets: [{
                label: "Votes",
                backgroundColor: randomBgColors,
                data: options.map(opt => opt.votes)
            }]
        },

    });

}