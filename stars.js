function colorTemperatureToRGB(kelvin){
    var temp = kelvin / 100;
    var red, green, blue;
    if( temp <= 66 ){ 
        red = 255; 
        green = temp;
        green = 99.4708025861 * Math.log(green) - 161.1195681661;
        if( temp <= 19){
            blue = 0;
        } else {
            blue = temp-10;
            blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
        }
    } else {
        red = temp - 60;
        red = 329.698727446 * Math.pow(red, -0.1332047592);
        green = temp - 60;
        green = 288.1221695283 * Math.pow(green, -0.0755148492 );
        blue = 255;
    }
    return [
        clamp(red,   0, 255),
        clamp(green, 0, 255),
        clamp(blue,  0, 255)
    ]
}

function clamp( x, min, max ) {
    if(x<min){ return min; }
    if(x>max){ return max; }
    return x;
}

function starType2Mass(type){
    switch(type){
      case 'O':
        return MASS_SUN * 50;
      case 'O':
        return MASS_SUN * 50;
    }
  }

const types = [
    {type: 'O', temperature: 40000, mass: 50 * MASS_SUN, radius: 10 * RADIUS_SUN, prob: 0.00001},
    {type: 'B', temperature: 20000, mass: 10 * MASS_SUN, radius: 5 * RADIUS_SUN, prob: 0.1},
    {type: 'A', temperature: 8500, mass: 2 * MASS_SUN, radius: 1.7 * RADIUS_SUN, prob: 0.7},
    {type: 'F', temperature: 6500, mass: 1.5 * MASS_SUN, radius: 1.3 * RADIUS_SUN, prob: 2},
    {type: 'G', temperature: 5700, mass: MASS_SUN, radius: RADIUS_SUN, prob: 3.5},
    {type: 'K', temperature: 4500, mass: 0.7 * MASS_SUN, radius: 0.8 * RADIUS_SUN, prob: 8},
    {type: 'M', temperature: 3200, mass: 0.2 * MASS_SUN, radius: 0.3 * RADIUS_SUN, prob: 80}
];

const total_prob = types.reduce((a,b)=>a+b.prob, 0);

function generateStar(type){
    let star = types.find(star=>star.type === type);
    star.color = color(...colorTemperatureToRGB(star.temperature));
    return star;
}

function sampleStar(){
    const pick = random(0, total_prob);
    let acc = 0
    for (let i=0; i<types.length; i++){
        acc += types[i].prob;
        if (acc > pick){
            return types[i].type;
        }
    }
}