const Archimedean = {
    Cuboctahedron: {
        facesTypes: [
            { sides: 3, amount: 8 },
            { sides: 4, amount: 6 }
        ],
        edges: { "3-4": { amount: 20, dihedralAngle: 125.26 } },
        volume: (side) => 5 / 3 * Math.SQRT2 * side * side * side,
        radii: { inner: 0.75, side: 0.866603, outer: 1 }
    },
    TruncatedTetrahedron: {
        facesTypes: [
            { sides: 3, amount: 4 },
            { sides: 6, amount: 4 }
        ],
        edges: {
            "3-6": { amount: 12, dihedralAngle: 109.4711 },
            "6-6": { amount: 6, dihedralAngle: 70.52889 }
        }
    },
    TruncatedCube: {
        facesTypes: [
            { sides: 8, amount: 6 },
            { sides: 3, amount: 8 }
        ],
        edges: {
            "3-8": { amount: 24, dihedralAngle: 125.2642 },
            "8-8": { amount: 12, dihedralAngle: 90 },
        }
    },
    TruncatedOctahedron: {
        facesTypes: [
            { sides: 4, amount: 6 },
            { sides: 6, amount: 8 }
        ],
        edges: {
            "4-6": { amount: 24, dihedralAngle: 125.2642 },
            "6-6": { amount: 12, dihedralAngle: 109.4711 }
        }
    },
    Rhombicuboctahedron: {
        facesTypes: [
            { sides: 4, amount: 18 },
            { sides: 3, amount: 8 }
        ],
        edges: {
            "4-4": { amount: 24, dihedralAngle: 135 },
            "3-4": { amount: 24, dihedralAngle: 144.74 }
        }
    },
    TruncatedCuboctahedron: {
        facesTypes: [
            { sides: 4, amount: 12 },
            { sides: 6, amount: 8 },
            { sides: 8, amount: 6 }
        ],
        edges: {
            "4-6": { amount: 24, dihedralAngle: 144.7355556 },
            "4-8": { amount: 24, dihedralAngle: 135 },
            "6-8": { amount: 24, dihedralAngle: 125.2641667 }
        }
    }
}
const Platonic = {
    Dodecahedron: {
        facesTypes: [
            { sides: 5, amount: 12 }
        ],
        edges:{
            "5-5": { amount: 30, dihedralAngle: 116.57 }
        },
        volume: (side) => 1 / 4 + (15 + 7 * Math.sqrt(5)) * side * side * side
    }
};