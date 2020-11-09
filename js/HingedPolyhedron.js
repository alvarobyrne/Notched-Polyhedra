/**
 * s: notch depth: described at docs/dihedralAngle-hinge-formulae.svg- It relates to both the hinge and the face
 * gap: mdf calibre material calibre: described at docs/... if could be mdf or plexiglass
 */
class HingedPolyhedron {
    constructor({svg, gui, sideLength, Polyhedron}) {
        this.sideLength = sideLength;
        const guiFolder = gui.addFolder("HingedPolyhedron");
        guiFolder.open();
        this.s = 20;//pixels
        this.s = 6;//mm
        this.gap = 20//pixels;
        this.gap = 3//mm;
        const doUpdate_ = () => this.update()
        const {facesTypes, dihedralAngles} = Polyhedron
        // guiFolder.add(this, 's', 0, sideLength*0.5).name("notch depth (s)").onChange(doUpdate_);
        guiFolder.add(this, 's', 0, 10).name("notch depth (s)[mm]").onChange(doUpdate_);
        // this.gapGUI = guiFolder.add(this, 'gap', 10, sideLength*0.5,10).name("mdf calibre (g)").onChange(doUpdate_);
        this.gapGUI = guiFolder.add(this, 'gap', 2.5, 9,0.5).name("mdf calibre (g)[mm]").onChange(doUpdate_);
        guiFolder.add(this, 'sideLength', 20, 500).name("side length").onChange(this.doUpdateSideLength.bind(this));
        const { faceTypesR, anglesR } = this.randomize();
        if(!facesTypes)
            facesTypes = faceTypesR
        if(!dihedralAngles)
            dihedralAngles = anglesR
        const hingesAmounts= [Polyhedron.edges*2];
        console.log('hingesAmounts: ', hingesAmounts);
        const facesSidesAmounts=facesTypes.map(element => {
            console.log('element: ', element);
            return element.sides;
            
        });
            
        this.facesManager  = new FacesManager ({svg, guiFolder, facesTypes,    sideLength})
        this.hingesManager = new HingesManager({svg, guiFolder, dihedralAngles,facesSidesAmounts,hingesAmounts})
        this.update();
        this.doUpdateSideLength();
    }
    doUpdateSideLength(){
        const sideLength = to_mm(this.sideLength);
        // console.log('sideLength: ', sideLength);
        this.h00 = sideLength-this.gap*0.5;
        const facesManager = this.facesManager;
        // console.log('facesManager: ', facesManager);
        const lastNotchDistance = facesManager.notchDistance;
        // console.log('lastNotchDistance: ', lastNotchDistance);
        const h00 = lastNotchDistance - this.gap*0.5;
        // console.log('h00: ', h00);
        facesManager.sideLength = sideLength;
        facesManager.updateLength()
    }
    randomize() {
        const posibleFacesSides = [3, 4, 5, 6, 8, 10, 12];
        const randomFacesAmount = 1 + 3 * Math.random() | 0;
        // console.log('randomFacesAmount: ', randomFacesAmount);
        const faceTypesR = [];
        for (let index = 0; index < randomFacesAmount; index++) {
            const randomFaceIndex = posibleFacesSides.length * Math.random() | 0;
            const randomFaceSide = posibleFacesSides.splice(randomFaceIndex, 1)[0];
            faceTypesR.push(randomFaceSide);
        }
        // console.log('faceTypes: ', faceTypes);
        const anglesR = faceTypesR.map(faceSidesAmount => {

            const randomAngle = Math.random() * Math.random() * 90 + 90;
            // console.log('randomAngle: ', randomAngle);
            return randomAngle;
        });
        // console.log('angles: ', angles);
        return {  faceTypesR,  anglesR };
    }
    update() {
        const s = to_mm(this.s);
        const g = to_mm(this.gap);
        this.facesManager.update(s,g);
        this.hingesManager.update(s,g);
    }
    setSideLength(v){
        console.log('v: ', v);
        this.sideLength=v;
        this.doUpdateSideLength();

    }
    setNotchDistance(v){
        console.log('v: ', v);

    }
    setHingeGap(g){
        console.log('g: ', g);
        this.gap= g;
        this.update();
    }
    static arrayToPath(points){
        const dString = ["M "+points[0][0]+" "+points[0][1]];
        for (let index = 1; index < points.length; index++) {
            const point = points[index];
            const pointString = "L " + point[0] + " " + point[1];
            dString.push(pointString)
        }
        return dString.join(" ")
    }
    static rotate2D(vector, angle){
        var theta = angle * Math.PI / 180; // radians
        var matrix = [  
            Math.cos(theta),  Math.sin(theta), 
            -Math.sin(theta), Math.cos(theta)
        ];
        return [ 
            matrix[0] * vector[0] + matrix[1] * vector[1], 
            matrix[2] * vector[0] + matrix[3] * vector[1]
        ]
    }
}