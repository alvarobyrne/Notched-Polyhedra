/**
 * s: notch depth: described at docs/dihedralAngle-hinge-formulae.svg- It relates to both the hinge and the face
 * gap: mdf calibre material calibre: described at docs/... if could be mdf or plexiglass
 */
class HingedPolyhedron extends EventTarget{
    constructor({svg, gui, sideLength, Polyhedron}) {
        super();
        this.updateEvent = new Event('update');
        this.isResizing=true;
        this.sideLength = sideLength;
        const guiFolder = gui.addFolder("HingedPolyhedron");
        this.guiFolder = guiFolder;
        guiFolder.open();
        this.s = 20;//pixels
        this.s = 6;//mm
        this.gap = 20//pixels;
        this.gap = 3//mm;
        this.isSingleNotch = true;
        const doUpdate_ = () => this.update()
        const {facesTypes, edges} = Polyhedron;
        const dihedralAngles = {};
        const hingesAmounts= {};
        for (const key in edges) {
            if (edges.hasOwnProperty(key)) {
                const element = edges[key];
                dihedralAngles[key]=(element.dihedralAngle)
                hingesAmounts[key]=(element.amount)
            }
        }
        guiFolder.add(this, 's', 0, 10).name("notch depth (s)[mm]").onChange(doUpdate_);
        this.gapGUI = guiFolder.add(this, 'gap', 2.5, 9,0.5).name("mdf calibre (g)[mm]").onChange(doUpdate_);
        guiFolder.add(this, 'sideLength', 20, 500).name("side length").onChange(this.doUpdateSideLength.bind(this));
        guiFolder.add(this,'isResizing').onChange(()=>{
            if(this.isResizing){
                this.dispatchEventUpdate();
            }
        })
        guiFolder.add(this,'isSingleNotch').onChange(doUpdate_)
        const facesSidesAmounts=facesTypes.map(element => {
            return element.sides;
            
        });
            
        this.facesManager  = new FacesManager ({svg, guiFolder, facesTypes,    sideLength,isSingleNotch:this.isSingleNotch})
        this.hingesManager = new HingesManager({svg, guiFolder, dihedralAngles,facesSidesAmounts,hingesAmounts,isSingleNotch:this.isSingleNotch})
        this.update();
        this.dispatchEventUpdate();
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
        facesManager.updateLength();
        this.dispatchEventUpdate();
    }
    dispatchEventUpdate(){
        if(this.isResizing){
            this.dispatchEvent(this.updateEvent);
        }
    }
    update() {
        const s = to_mm(this.s);
        const g = to_mm(this.gap);
        this.hingesManager.isSingleNotch=this.isSingleNotch;
        this.facesManager.isSingleNotch=this.isSingleNotch;
        this.hingesManager.update(s,g);
        const accumulatedHeight = this.hingesManager.accumulatedHeight;
        const bbox = this.hingesManager.clones.getBBox();
        const bbox2 = this.hingesManager.hinges[0].original.getBBox();
        const accumulated1 = bbox.height+Math.abs(bbox.y);
        const accumulated2 = bbox2.height+Math.abs(bbox2.y);
        const accumulatedY = accumulated1+accumulated2+20
        this.facesManager.update(s,g,true,accumulatedY);
        this.dispatchEventUpdate();
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
    static arrayToPath(points,isClosed=true){
        let dString = ["M "+points[0][0]+" "+points[0][1]];
        for (let index = 1; index < points.length; index++) {
            const point = points[index];
            const pointString = "L " + point[0] + " " + point[1];
            dString.push(pointString)
        }

        if(isClosed) dString = dString.join(" ")+" Z";
        return dString
    }
    static translate(vector, translation){
        return [ 
            translation[0] + vector[0],
            translation[1] * vector[1]
        ]

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