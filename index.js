// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');
const obj = document.getElementById('obj');

var expressionObj = {
  angry: 0.000006727961135766236,
  disgusted: 9.93469129184632e-9,
  fearful: 0.000015661238649045117,
  happy: 0.185803055763245,
  neutral: 0.2799791991710663,
  sad: 0.000041106035496341065,
  surprised: 0.0013768896460533142,
};

var max_exp_name = Object.keys(expressionObj)[0];
var max_exp_value = Object.values(expressionObj)[0];

for (let key in expressionObj) {
  if (expressionObj[key] >= max_exp_value) {
    max_exp_value = expressionObj[key];
    max_exp_name = key;
  }
}

console.log(max_exp_name, max_exp_value);

obj.innerHTML = `${JSON.stringify(expressionObj)}`;

appDiv.innerHTML = `${max_exp_name}-${max_exp_value}`;
