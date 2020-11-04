const Cuboctahedron = {
    facesTypes:[
        {sides:3,amount:4},
        {sides:4,amount:4}
    ],
    dihedralAngles:[125.26],
    volume:(side)=>5/3*Math.SQRT2*side*side*side,
    radii:{inner:0.75,side:0.866603,outer:1}
};
const Dodecahedron = {facesTypes:[5],dihedralAngles:[116.57],volume:(side)=>1/4+(15+7*Math.sqrt(5))*side*side*side};
const concreteDodecahedronPlanter1Volume = Dodecahedron.volume(3);
console.log('concreteDodecahedronPlanter1Volume: ', concreteDodecahedronPlanter1Volume);
