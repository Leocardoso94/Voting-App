const btnMoreOptions = document.querySelector('button.more-options');

btnMoreOptions.addEventListener('click', () => {
    const input = document.createElement('input');
    input.className = 'validate';
    input.name = 'option';

    const options = document.querySelector('.options');

    options.appendChild(input);
});

document.getElementById('new-poll-btn').onclick = () => {
    document.getElementById('my-polls').style.display = 'none';
    document.getElementById('new-poll').style.display = 'block';
};

document.getElementById('my-polls-btn').onclick = () => {
    document.getElementById('my-polls').style.display = 'block';
    document.getElementById('new-poll').style.display = 'none';
};

const deletePollBtns = [...document.querySelectorAll('.delete-poll')];

deletePollBtns.map(btn => btn.addEventListener('click', event => {
    if (!confirm('Are you sure?')) event.preventDefault();

}));