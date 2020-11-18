const Cuboctahedron = {
    facesTypes:[
        {sides:3,amount:8},
        {sides:4,amount:6}
    ],
    edges:{"3-4":20},
    dihedralAngles:{"3-4":125.26},
    volume:(side)=>5/3*Math.SQRT2*side*side*side,
    radii:{inner:0.75,side:0.866603,outer:1}
};
const TruncatedTetrahedron = {
    facesTypes:[
        {sides:3,amount:4},
        {sides:6,amount:4}
    ],
    edges:{
        "3-6":12,
        "6-6":6
    },
    dihedralAngles:{
        "3-6":109.28,
        "6-6":70.31
    }
}
const Dodecahedron = {
    facesTypes:[
        {sides:5,amount:12}
    ],
    dihedralAngles:[116.57],
    volume:(side)=>1/4+(15+7*Math.sqrt(5))*side*side*side};
const concreteDodecahedronPlanter1Volume = Dodecahedron.volume(3);
console.log('concreteDodecahedronPlanter1Volume: ', concreteDodecahedronPlanter1Volume);
