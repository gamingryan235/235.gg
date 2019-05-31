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
    let givens = {}
    $('.roulette__row').each((i, element) => {
        let item = $(element).find('.roulette__item').text();
        let given = parseFloat($(element).find('.roulette__given_prob').val());

        givens[item] = given / 100;  // Perecent to probability
    });

    return givens;
}

/**
 * Compute actual probabilities from given probabilities dictionary.
 * @param {*} givens - Probabilities inputed by user.
 */
function givensToActuals(givens) {
    let actuals = {};
    let actualMissProbability = (
        // First paren: P(Star = n)
        // Second paren: P(Miss | Star = n)
        // TODO Magic numbers
        0
        + (givens['꽝'] * 1  ) * (0.3)                      // 1 Star
        + (givens['꽝'] * 0.8) * (0.7 * 0.8)                // 2 Stars
        + (givens['꽝'] * 0.5) * (0.7 * 0.2 * 0.93)         // 3 Stars
        + (givens['꽝'] * 0.3) * (0.7 * 0.2 * 0.07 * 0.97)  // 4 Stars
        + (givens['꽝'] * 0.1) * (0.7 * 0.2 * 0.07 * 0.03)  // 5 Stars
    );
    actuals['꽝'] = actualMissProbability;

    let extraProbabilityFactor = (givens['꽝'] - actualMissProbability) / (1 - givens['꽝']);
    for (let key in givens) {
        if (key == '꽝') { continue; }
        actuals[key] = givens[key] * (1 + extraProbabilityFactor);
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
        let item = $(element).find('.roulette__item').text();
        $(element).find('.roulette__actual_prob').text(actuals[item] * 100);
    });
}

function updateGivenSumText(givens) {
    let total = 0
    for (let key in givens) {
        total += givens[key];
    }
    total *= 100;
    $('.given_total').text(total.toString());
    if(total != 100) {
        $('.given_total').css('color', 'red');
        $('.roulette__actual_prob').css('color', 'red');
    } else {
        $('.given_total').css('color', 'black');
        $('.roulette__actual_prob').css('color', 'black');
    }
}


$( document ).ready(() => {
    update();
    $('input.roulette__given_prob').change(function() {
        update();
    });

});