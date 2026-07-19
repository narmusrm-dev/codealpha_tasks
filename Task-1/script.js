document.getElementById('age-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);

    const resultDiv = document.getElementById('result');
    const errorP = document.getElementById('error');

    // Hide previous results/errors
    resultDiv.classList.add('hidden');
    errorP.classList.add('hidden');

    // Validate the date
    if (!isValidDate(day, month, year)) {
        errorP.textContent = 'Please enter a valid date of birth.';
        errorP.classList.remove('hidden');
        return;
    }

    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    if (birthDate > today) {
        errorP.textContent = 'Date of birth cannot be in the future.';
        errorP.classList.remove('hidden');
        return;
    }

    const age = calculateAge(birthDate, today);

    document.getElementById('years').textContent = age.years;
    document.getElementById('months').textContent = age.months;
    document.getElementById('days').textContent = age.days;

    resultDiv.classList.remove('hidden');
});

function isValidDate(day, month, year) {
    if (month < 1 || month > 12) return false;
    if (day < 1) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;

    if (year < 1900 || year > new Date().getFullYear()) return false;

    return true;
}

function calculateAge(birthDate, today) {
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        // Get the number of days in the previous month
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    return { years, months, days };
}
