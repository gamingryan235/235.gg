/**
 * Return true or false, chosen randomly according to given probability.
 *
 * https://stackoverflow.com/questions/26271868/is-there-a-simpler-way-to-implement-a-probability-function-in-javascript?lq=1
 * @param {*} n - Probability of returning true.
 */
function probability(n) {
    return !!n && Math.random() <= n;
};

/**
 * Simulate number of stars for roulette.
 */
function getStar() {
    if(probability(.7)) {
        if(probability(.2)) {
            if(probability(.07)) {
                if(probability(.03)) {
                    return 5;
                }
                return 4;
            }
            return 3;
        }
        return 2;
    }
    return 1;
}


/**
 * Parse given probabilities from HTML.
 */
function parseGivens() {
    let givens = [];
    $('.roulette__row').each((i, element) => {
        // let item = $(element).find('.roulette__item').val();
        let given = parseFloat($(element).find('.roulette__given_prob').val());

        givens.push(given / 100);  // Perecent to probability
    });

    return givens;
}

/**
 * Compute actual probabilities from given probabilities dictionary.
 * @param {*} givens - Probabilities inputed by user.
 */
function givensToActuals(givens) {
    let actuals = [];
    let actualMissProbability = (
        // First paren: P(Star = n)
        // Second paren: P(Miss | Star = n)
        // TODO Magic numbers
        0
        + (givens[0] * 1  ) * (0.3)                      // 1 Star
        + (givens[0] * 0.8) * (0.7 * 0.8)                // 2 Stars
        + (givens[0] * 0.5) * (0.7 * 0.2 * 0.93)         // 3 Stars
        + (givens[0] * 0.3) * (0.7 * 0.2 * 0.07 * 0.97)  // 4 Stars
        + (givens[0] * 0.1) * (0.7 * 0.2 * 0.07 * 0.03)  // 5 Stars
    );
    actuals.push(actualMissProbability);

    let extraProbabilityFactor = (givens[0] - actualMissProbability) / (1 - givens[0]);
    for (let i in givens) {
        if (i == 0) { continue; } // 꾕
        actuals.push(givens[i] * (1 + extraProbabilityFactor));
    }
    
    return actuals;
}

function update() {
    let givens = parseGivens();
    let actuals = givensToActuals(givens);
    updateGivenSumText(givens);
    updateActuals(actuals);
}

/**
 * Update HTML text by reparsing and recomputing.
 */
function updateActuals(actuals) {
    $('.roulette__row').each((i, element) => {
        // let item = $(element).find('.roulette__item').val();
        $(element).find('.roulette__actual_prob').text(actuals[i] * 100);
    });
}

function updateGivenSumText(givens) {
    let total = 0
    for (let i in givens) {
        total += givens[i];
    }
    total *= 100;
    total = +total.toFixed(4);
    $('.given_total').text(total.toString());
    if(100 - 0.0001 < total && total < 100 + 0.0001) {
        $('.given_total').css('color', 'black');
        $('.roulette__actual_prob').css('color', 'black');
    } else {
        $('.given_total').css('color', 'red');
        $('.roulette__actual_prob').css('color', 'red');
    }
}


function addRow() {
    $("table").append(
        "<tr class=\"roulette__row\">" +
            "<td><input class=\"roulette__item\" value=\"상품 X\"></input></td>" +
            "<td><input class=\"roulette__given_prob\" placeholder=\"%\" value=\"0\"></input></td>" +
            "<td><span class=\"roulette__actual_prob\"></span>%</td>" +
        "</tr>"
    );
}


$(document).ready(() => {
    update();
    $('input.roulette__given_prob').change(function() {
        update();
    });
    $('.roulette__actions__more_button').click(() => {
        addRow();
        if ($('.roulette__row').length >= 20) {
            $('.roulette__warning__max_20').show();
            $('.roulette__actions__more_button').hide();
        }
        $('input.roulette__given_prob').last().change(function() {
            update();
        });
        update();
    });
});
