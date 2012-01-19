// ia.js

var niveauNappe = [
  0.5,
  1.5,
  1.75,
  3,
  2,
  1.7,
  1.2,
  1.25,
  0,
  1.4,
  10
];

var humidite = [
  0,
  30,
  65,
  81,
  40,
  55,
  75,
  60,
  45,
  50,
  100
];

var temperature = [
  0,
  30,
  65,
  81,
  40,
  55,
  75,
  60,
  45,
  50,
  100
];

var arrosageThCourt = [
  0,
  0,
  0,
  0.88,
  0,
  0,
  0,
  0.8,
  0.75,
  0.5,
  0
];

var arrosageThMoyen = [
  0,
  0,
  0.63,
  0,
  0.8,
  0,
  0.5,
  0.2,
  0,
  0.13,
  0
];

var arrosageThLong = [
  1,
  1,
  0.38,
  0,
  0,
  0.75,
  0,
  0,
  0,
  0,
  0
];

var dureeTheorique = [
  23.67,
  23.67,
  17.13,
  3.74,
  15.17,
  23.28,
  15.86,
  9.1,
  3.87,
  9.39,
  0
];

var duree = [
  0,
  15,
  14.16,
  3.74,
  15.17,
  17.34,
  4.26,
  4.5,
  0,
  4.5,
  0
];

var arrosageCourt = [
  0,
  0,
  0.5,
  0.88,
  0,
  0,
  0.4,
  0.2,
  0,
  0.13,
  0
];

var arrosageMoyen = [
  0,
  1,
  0.5,
  0,
  0.8,
  0.6,
  0,
  0,
  0.4,
  0.2,
  0,
  0.13,
  0
];

var arrosageLong = [
  0,
  0,
  0.38,
  0,
  0,
  0.4,
  0,
  0,
  0,
  0,
  0
];





function between(min, max, x) {
  return (x - min) / (max - min);
}


function rule1(temp) {
  var discreteTable = {
    froid: 0,
    doux: 0,
    normal: 0,
    chaud: 0,
    caniculaire: 0,
  };

  if (temp <= 5) {
    discreteTable.froid = 1;
  } else if (temp < 13) {
    discreteTable.doux = between(5, 13, temp);
    discreteTable.froid = 1 - discreteTable.doux;
  } else if (temp == 13) {
    discreteTable.doux = 1;
  } else if (temp < 18) {
    discreteTable.normal = between(13, 18, temp);
    discreteTable.doux = 1 - discreteTable.normal;
  } else if (temp <= 22) {
    discreteTable.normal = 1;
  } else if (temp < 26) {
    discreteTable.chaud = between(22, 26, temp);
    discreteTable.normal = 1 - discreteTable.chaud;
  } else if (temp <= 30) {
    discreteTable.chaud = 1;
  } else if (temp < 38) {
    discreteTable.caniculaire = between(30, 38, temp);
    discreteTable.chaud = 1 - discreteTable.caniculaire;
  } else {
    discreteTable.caniculaire = 1;
  }

  return discreteTable;
}



console.log('-- Test 1 --');

[
rule1(85),
rule1(32),
rule1(47),
rule1(Math.PI),
].forEach(function(e) {
  console.log(e);
});






function rule2(hume) {
  var discreteTable = {
    sec: 0,
    humide: 0,
    trempe: 0,
  };

  if (hume <= 40) {
    discreteTable.sec = 1;
  } else if (hume < 60) {
    discreteTable.humide = between(40, 60, hume);
    discreteTable.sec = 1 - discreteTable.humide;
  } else if (hume <= 70) {
    discreteTable.humide = 1;
  } else if (hume < 80) {
    discreteTable.trempe = between(70, 80, hume);
    discreteTable.humide = 1 - discreteTable.trempe;
  } else {
    discreteTable.trempe = 1;
  }

  return discreteTable;
}



console.log('-- Test 2 --');

[
rule2(85),
rule2(32),
rule2(47),
rule2(Math.PI),
].forEach(function(e) {
  console.log(e);
});





function rule3(nappe) {
  var discreteTable = {
    insuffisant: 0,
    faible: 0,
    suffisant: 0,
  };

  if (nappe <= 1) {
    discreteTable.insuffisant = 1;
  } else if (nappe < 1.5) {
    discreteTable.faible = between(1, 1.5, nappe);
    discreteTable.insuffisant = 1 - discreteTable.faible;
  } else if (nappe === 1.5) {
    discreteTable.faible = 1;
  } else if (nappe < 2) {
    discreteTable.suffisant = between(1.5, 2, nappe);
    discreteTable.faible = 1 - discreteTable.suffisant;
  } else {
    discreteTable.suffisant = 1;
  }

  return discreteTable;
}



console.log('-- Test 3 --');

[
rule3(1.74),
rule3(1.2),
rule3(0.5),
rule3(Math.PI),
].forEach(function(e) {
  console.log(e);
});




// Controler

function control1(temp, hume) {
  var t = rule1(temp),
      h = rule2(hume),
      map = {
        court: t.froid * h.sec + t.doux * h.humide + t.caniculaire * h.trempe,
        moyen: t.doux * h.sec + t.normal * h.sec + t.normal * h.humide +
          t.chaud * h.humide,
        long: t.chaud * h.sec + t.caniculaire * h.sec + t.caniculaire * h.humide
      };
  return map;
}



function control2(temp, hume, nappe) {
  var ctrl1 = control1(temp, hume),
      n = rule3(nappe),
      map = {
        court: n.suffisant * ctrl1.court + n.faible * ctrl1.moyen,
        moyen: n.insuffisant * ctrl1.moyen + n.faible * ctrl1.long,
        long: n.suffisant * ctrl1.long
      };
  return map;
}


console.log('-- Test de controle --');

for (var i = 0; i < 10; i++) {
  var c = control2(temperature[i], humidite[i], niveauNappe[i]),
      map = {
        court: arrosageCourt[i],
        moyen: arrosageMoyen[i],
        long: arrosageLong[i]
      };
  console.log('c:', c);
  console.log('a:', map);
}

