function probabilidadUniforme(a, b, rnd) {
    return a + (b - a) * rnd;
}

console.log(probabilidadUniforme(24, 35, 0.56));