const Archimedean = {
    Cuboctahedron : {
        facesTypes: [
            { sides: 3, amount: 8 },
            { sides: 4, amount: 6 }
        ],
        edges: { "3-4": 20 },
        dihedralAngles: { "3-4": 125.26 },
        volume: (side) => 5 / 3 * Math.SQRT2 * side * side * side,
        radii: { inner: 0.75, side: 0.866603, outer: 1 }
    },
    TruncatedTetrahedron : {
        facesTypes: [
            { sides: 3, amount: 4 },
            { sides: 6, amount: 4 }
        ],
        edges: {
            "3-6": 12,
            "6-6": 6
        },
        dihedralAngles: {
            "3-6": 109.4711,
            "6-6": 70.52889
        }
    },
    TruncatedCube : {
        facesTypes: [
            { sides: 8, amount: 6 },
            { sides: 3, amount: 8 }
        ],
        edges: {
            "3-8": 24,
            "8-8": 12
        },
        dihedralAngles: {
            "3-8": 125.2642,
            "8-8": 90
        }
    },
    TruncatedOctahedron : {
        facesTypes: [
            { sides: 4, amount: 6 },
            { sides: 6, amount: 8 }
        ],
        edges: {
            "4-6": 24,
            "6-6": 12
        },
        dihedralAngles: {
            "4-6": 125.2642,
            "6-6": 109.4711
        }
    },
    Rhombicuboctahedron : {
        facesTypes: [
            { sides: 4, amount: 18 },
            { sides: 3, amount: 8 }
        ],
        edges: {
            "4-4": 24,
            "3-4": 24
        },
        dihedralAngles: {
            "4-4": 135,
            "3-4": 144.74
        }
    },
    TruncatedCuboctahedron : {
        facesTypes: [
            { sides: 4, amount: 12 },
            { sides: 6, amount: 8 },
            { sides: 8, amount: 6 }
        ],
        edges: {
            "4-6": 24,
            "4-8": 24,
            "6-8": 24
        },
        dihedralAngles: {
            "4-6": 144.7355556,
            "4-8": 135,
            "6-8": 125.2641667
        }
    }
}
const Dodecahedron = {
    facesTypes: [
        { sides: 5, amount: 12 }
    ],
    dihedralAngles: [116.57],
    volume: (side) => 1 / 4 + (15 + 7 * Math.sqrt(5)) * side * side * side
};
const concreteDodecahedronPlanter1Volume = Dodecahedron.volume(3);
console.log('concreteDodecahedronPlanter1Volume: ', concreteDodecahedronPlanter1Volume);
